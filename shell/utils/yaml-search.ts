/**
 * Helpers for searching a YAML document shown in a CodeMirror 6 editor (see
 * YamlOverridesEditor.vue). Matching works like a browser's find in page: a plain,
 * case-insensitive substring match, so "bar" also matches "fooBar".
 */
import { EditorSelection, RangeSetBuilder, StateEffect } from '@codemirror/state';
import type { EditorState, Extension } from '@codemirror/state';
import { Decoration, EditorView, ViewPlugin } from '@codemirror/view';
import type { DecorationSet, ViewUpdate } from '@codemirror/view';
import {
  SearchQuery, findNext, findPrevious, getSearchQuery, search, setSearchQuery
} from '@codemirror/search';

/** The search only runs once the query has at least this many characters. */
export const MIN_SEARCH_LENGTH = 3;

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

// --- CodeMirror 6 -----------------------------------------------------------

const matchMark = Decoration.mark({ class: 'cm-searchMatch' });
const selectedMatchMark = Decoration.mark({ class: 'cm-searchMatch cm-searchMatch-selected' });

/**
 * Marks the matches of the query with the classes and colours of CodeMirror's own
 * search. CodeMirror only does this while its search panel is open, and we use our
 * own search box instead. Only the visible part of the document is marked.
 */
const searchMatchHighlight = ViewPlugin.fromClass(class {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.build(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.selectionSet || update.viewportChanged || getSearchQuery(update.startState) !== getSearchQuery(update.state)) {
      this.decorations = this.build(update.view);
    }
  }

  build(view: EditorView): DecorationSet {
    const query = getSearchQuery(view.state);

    if (!query.valid) {
      return Decoration.none;
    }

    const { from: selectedFrom, to: selectedTo } = view.state.selection.main;
    const builder = new RangeSetBuilder<Decoration>();

    view.visibleRanges.forEach(({ from, to }) => {
      const cursor = query.getCursor(view.state, from, to);

      for (let match = cursor.next(); !match.done; match = cursor.next()) {
        const selected = match.value.from === selectedFrom && match.value.to === selectedTo;

        builder.add(match.value.from, match.value.to, selected ? selectedMatchMark : matchMark);
      }
    });

    return builder.finish();
  }
}, { decorations: (plugin) => plugin.decorations });

const yamlSearchExtension: Extension = [
  searchMatchHighlight,
  // Center the match, so it isn't hidden under a sticky search box above the editor
  search({ scrollToMatch: (range) => EditorView.scrollIntoView(range, { y: 'center' }) }),
];

/**
 * Highlight the matches of `query` (case-insensitive). It is also the query that
 * `findYamlSearchMatch` moves between. Pass an empty query to clear it. The
 * extension is only added to an editor the first time it's used.
 */
export function setYamlSearch(view: EditorView, query = '') {
  if (!view.plugin(searchMatchHighlight)) {
    view.dispatch({ effects: StateEffect.appendConfig.of(yamlSearchExtension) });
  }

  view.dispatch({ effects: setSearchQuery.of(new SearchQuery({ search: query, literal: true })) });
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
