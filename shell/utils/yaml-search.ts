/**
 * Helpers for searching a YAML document shown in a CodeMirror 6 editor (see
 * YamlOverridesEditor.vue). Matching works like a browser's find in page: a plain,
 * case-insensitive substring match, so "bar" also matches "fooBar".
 */
import { EditorSelection, RangeSet, StateEffect, StateField } from '@codemirror/state';
import type { EditorState, Extension, Range, Text } from '@codemirror/state';
import {
  Decoration, EditorView, GutterMarker, ViewPlugin, gutterLineClass
} from '@codemirror/view';
import type { DecorationSet, ViewUpdate } from '@codemirror/view';
import {
  SearchQuery, findNext, findPrevious, getSearchQuery, search, setSearchQuery
} from '@codemirror/search';
import { LineClassMarker } from '@shell/utils/code-mirror-line-classes';

/** The search only runs once the query has at least this many characters. */
export const MIN_SEARCH_LENGTH = 3;

/**
 * Classes of the search results, styled in CodeMirror.vue. The key and the value
 * of a line with a match are marked. A line without a match gets the dim class on
 * the line and on its gutters, so the tint of a changed line is dimmed too.
 */
export const SEARCH_STYLE = {
  KEY:   'yaml-search-key',
  VALUE: 'yaml-search-value',
  DIM:   'yaml-search-dim-line',
};

/** Class of the match that is currently selected. */
export const SEARCH_CURRENT_CLASS = 'yaml-search-current';

/** A styled range of a line, from the end of the previous segment up to `end`. */
export interface SearchSegment {
  end: number;
  style: string | null;
}

// The start of a line: indentation plus an optional list item dash.
const LINE_PREFIX = /^\s*(?:-\s+)?/;
// A mapping key (plain or quoted) and its colon, which must be followed by a space
// or the end of the line so a colon inside a value (e.g. a URL) isn't taken as one.
const KEY = /^(?:"(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^\s"'][^:]*?):(?=\s|$)/;

/**
 * Count the case-insensitive, non-overlapping occurrences of `query` in `text`.
 * A single pass with `indexOf`, so it stays fast on very large documents.
 */
export function countMatches(text: string, query: string): number {
  if (!text || !query) {
    return 0;
  }

  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  let count = 0;
  let from = haystack.indexOf(needle);

  while (from !== -1) {
    count++;
    from = haystack.indexOf(needle, from + needle.length);
  }

  return count;
}

/**
 * Split one line into styled segments for the search highlight. A line that
 * contains the (lowercased) `needle` gets its whole key (with the colon) and its
 * whole value styled. Any other line is dimmed. Indentation, dashes and the space
 * after a colon are left unstyled.
 */
export function yamlSearchSegments(line: string, needle: string): SearchSegment[] {
  if (!line) {
    return [];
  }

  if (!needle || !line.toLowerCase().includes(needle)) {
    return [{ end: line.length, style: SEARCH_STYLE.DIM }];
  }

  const segments: SearchSegment[] = [];
  let pos = (line.match(LINE_PREFIX) as RegExpMatchArray)[0].length;

  if (pos > 0) {
    segments.push({ end: pos, style: null });
  }

  const key = line.slice(pos).match(KEY);

  if (key) {
    pos += key[0].length;
    segments.push({ end: pos, style: SEARCH_STYLE.KEY });

    const valueStart = pos + (line.slice(pos).match(/^\s*/) as RegExpMatchArray)[0].length;

    if (valueStart > pos) {
      pos = valueStart;
      segments.push({ end: pos, style: null });
    }
  }

  // Whatever is left is the value (or, for a list item or a multi-line value,
  // the whole content of the line).
  if (pos < line.length) {
    segments.push({ end: line.length, style: SEARCH_STYLE.VALUE });
  }

  return segments;
}

// --- CodeMirror 6 -----------------------------------------------------------

interface SearchHighlightState {
  needle: string;
  decorations: DecorationSet;
  gutters: RangeSet<GutterMarker>;
}

const setSearchHighlightEffect = StateEffect.define<string>();

const keyMark = Decoration.mark({ class: SEARCH_STYLE.KEY });
const valueMark = Decoration.mark({ class: SEARCH_STYLE.VALUE });
const dimLine = Decoration.line({ class: SEARCH_STYLE.DIM });
const dimGutter = new LineClassMarker(SEARCH_STYLE.DIM);
const currentMark = Decoration.mark({ class: SEARCH_CURRENT_CLASS });

/** The search highlight of the lines `fromLine` to `toLine` (1-based, inclusive). */
function highlightLines(doc: Text, needle: string, fromLine: number, toLine: number) {
  const decorations: Range<Decoration>[] = [];
  const gutters: Range<GutterMarker>[] = [];

  for (let n = fromLine; n <= toLine; n++) {
    const line = doc.line(n);
    let pos = line.from;

    yamlSearchSegments(line.text, needle).forEach((segment) => {
      const end = line.from + segment.end;

      if (segment.style === SEARCH_STYLE.DIM) {
        decorations.push(dimLine.range(line.from));
        gutters.push(dimGutter.range(line.from));
      } else if (segment.style) {
        decorations.push((segment.style === SEARCH_STYLE.KEY ? keyMark : valueMark).range(pos, end));
      }

      pos = end;
    });
  }

  return { decorations, gutters };
}

const noSearchHighlight: SearchHighlightState = {
  needle: '', decorations: Decoration.none, gutters: RangeSet.empty
};

function buildSearchHighlight(doc: Text, needle: string): SearchHighlightState {
  if (!needle) {
    return noSearchHighlight;
  }

  const { decorations, gutters } = highlightLines(doc, needle, 1, doc.lines);

  return {
    needle, decorations: Decoration.set(decorations, true), gutters: RangeSet.of(gutters, true)
  };
}

const searchHighlightField = StateField.define<SearchHighlightState>({
  create: () => noSearchHighlight,

  update(value, tr) {
    let next = value;

    tr.effects.forEach((e) => {
      if (e.is(setSearchHighlightEffect)) {
        next = buildSearchHighlight(tr.state.doc, e.value.toLowerCase());
      }
    });

    if (next !== value || !tr.docChanged || !value.needle) {
      return next;
    }

    // Only highlight the lines that were edited again, so typing stays fast on a
    // large document.
    const doc = tr.state.doc;
    let decorations = value.decorations.map(tr.changes);
    let gutters = value.gutters.map(tr.changes);

    tr.changes.iterChangedRanges((_fromA, _toA, fromB, toB) => {
      const from = doc.lineAt(fromB);
      const to = doc.lineAt(toB);
      const added = highlightLines(doc, value.needle, from.number, to.number);
      const range = {
        filterFrom: from.from, filterTo: to.to, filter: () => false
      };

      decorations = decorations.update({
        ...range, add: added.decorations, sort: true
      });
      gutters = gutters.update({
        ...range, add: added.gutters, sort: true
      });
    });

    return {
      needle: value.needle, decorations, gutters
    };
  },

  provide: (field) => [
    EditorView.decorations.from(field, (value) => value.decorations),
    gutterLineClass.from(field, (value) => value.gutters),
  ],
});

/** Marks the selected match, so it stands out from the other matches. */
const currentMatchHighlight = ViewPlugin.fromClass(class {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.build(view.state);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.selectionSet || update.startState.field(searchHighlightField) !== update.state.field(searchHighlightField)) {
      this.decorations = this.build(update.state);
    }
  }

  build(state: EditorState): DecorationSet {
    const { needle } = state.field(searchHighlightField);
    const { from, to } = state.selection.main;

    if (!needle || from === to || state.sliceDoc(from, to).toLowerCase() !== needle) {
      return Decoration.none;
    }

    return Decoration.set(currentMark.range(from, to));
  }
}, { decorations: (plugin) => plugin.decorations });

const yamlSearchExtension: Extension = [
  searchHighlightField,
  currentMatchHighlight,
  // Center the match, so it isn't hidden under a sticky search box above the editor
  search({ scrollToMatch: (range) => EditorView.scrollIntoView(range, { y: 'center' }) }),
];

/**
 * Highlight the lines that contain `query` (case-insensitive): their key and value
 * are marked and every other line is dimmed. It is also the query that
 * `findYamlSearchMatch` moves between. Pass an empty query to clear it. The
 * extension is only added to an editor the first time it's used.
 */
export function setYamlSearch(view: EditorView, query = '') {
  if (!view.state.field(searchHighlightField, false)) {
    view.dispatch({ effects: StateEffect.appendConfig.of(yamlSearchExtension) });
  }

  view.dispatch({
    effects: [
      setSearchHighlightEffect.of(query),
      setSearchQuery.of(new SearchQuery({ search: query, literal: true })),
    ]
  });
}

/**
 * The position of the selected match, from 1, or 0 when the selection isn't on a
 * match.
 */
export function yamlSearchMatchIndex(state: EditorState): number {
  const query = getSearchQuery(state);
  const { from, to } = state.selection.main;

  if (!query.valid || from === to) {
    return 0;
  }

  const cursor = query.getCursor(state);
  let index = 0;

  for (let match = cursor.next(); !match.done && match.value.from <= from; match = cursor.next()) {
    index++;

    if (match.value.from === from && match.value.to === to) {
      return index;
    }
  }

  return 0;
}

/**
 * Select the first, next or previous match of the query set by `setYamlSearch`
 * and scroll it into view. Next and previous wrap around, like a browser.
 * Returns the position of the selected match, from 1, or 0 when there is none.
 */
export function findYamlSearchMatch(view: EditorView, direction: 'first' | 'next' | 'previous'): number {
  const query = getSearchQuery(view.state);

  if (!query.valid) {
    return 0;
  }

  if (direction === 'first') {
    const first = query.getCursor(view.state).next();

    if (first.done) {
      return 0;
    }

    const { from, to } = first.value;

    view.dispatch({
      selection: EditorSelection.single(from, to),
      effects:   EditorView.scrollIntoView(EditorSelection.range(from, to), { y: 'center' }),
      userEvent: 'select.search',
    });
  } else if (direction === 'next') {
    findNext(view);
  } else {
    findPrevious(view);
  }

  return yamlSearchMatchIndex(view.state);
}
