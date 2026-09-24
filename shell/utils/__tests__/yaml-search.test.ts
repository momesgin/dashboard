import { EditorSelection } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { countMatches, setYamlSearch, findYamlSearchMatch, yamlSearchMatchIndex } from '@shell/utils/yaml-search';

const MATCH = 'cm-searchMatch';
const SELECTED = 'cm-searchMatch-selected';

describe('fx: yaml-search', () => {
  describe('countMatches', () => {
    it.each([
      ['a single match', 'foo: bar\n', 'bar', 1],
      ['a match inside a word', 'fooBar: 1\n', 'bar', 1],
      ['matches regardless of case', 'BAR: bar\nBaR: 1\n', 'bar', 3],
      ['matches across keys and values', 'image:\n  repository: my/image\n', 'image', 2],
      ['no match', 'foo: bar\n', 'baz', 0],
    ])('counts %s', (_label, text, query, expected) => {
      expect(countMatches(text, query)).toStrictEqual(expected);
    });

    it('does not count overlapping matches', () => {
      expect(countMatches('aaaa', 'aaa')).toStrictEqual(1);
    });

    it.each([
      ['empty text', '', 'foo'],
      ['empty query', 'foo: bar', ''],
      ['null text', null as any, 'foo'],
      ['null query', 'foo: bar', null as any],
    ])('returns 0 for %s', (_label, text, query) => {
      expect(countMatches(text, query)).toStrictEqual(0);
    });
  });

  describe('codeMirror 6 extension', () => {
    const DOC = 'foo: bar\nreplicas: 2\nlist:\n  - Bar\nbaz: foobar';

    const createView = (doc = DOC) => new EditorView({ doc, extensions: [lineNumbers()] });
    const marked = (view: EditorView, className: string) => Array.from(view.contentDOM.querySelectorAll(`.${ className }`)).map((el) => el.textContent);

    describe('setYamlSearch', () => {
      it('marks each match regardless of case', () => {
        const view = createView();

        setYamlSearch(view, 'BAR');

        expect(marked(view, MATCH)).toStrictEqual(['bar', 'Bar', 'bar']);
      });

      it('marks only the matched text, not the whole line', () => {
        const view = createView();

        setYamlSearch(view, 'bar');

        expect(view.contentDOM.querySelectorAll('.cm-line')[4].querySelector(`.${ MATCH }`)?.textContent).toStrictEqual('bar');
      });

      it('replaces the highlight when the query changes', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        setYamlSearch(view, 'replicas');

        expect(marked(view, MATCH)).toStrictEqual(['replicas']);
      });

      it('clears the highlight for an empty query', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        setYamlSearch(view, '');

        expect(marked(view, MATCH)).toStrictEqual([]);
      });

      it('marks a match that is typed in', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        view.dispatch({ changes: { from: view.state.doc.line(2).to, insert: 'bar' } });

        expect(marked(view, MATCH)).toStrictEqual(['bar', 'bar', 'Bar', 'bar']);
      });

      it('unmarks a match that is deleted', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        view.dispatch({ changes: { from: 5, to: 8 } });

        expect(marked(view, MATCH)).toStrictEqual(['Bar', 'bar']);
      });

      it('does not mark a match as selected before one is selected', () => {
        const view = createView();

        setYamlSearch(view, 'bar');

        expect(marked(view, SELECTED)).toStrictEqual([]);
      });
    });

    describe('findYamlSearchMatch', () => {
      it.each([
        ['first', [], 1],
        ['next', [], 1],
        ['next', ['next'], 2],
        ['previous', [], 3],
        ['previous', ['previous'], 2],
      ])('selects match for %p after %p and returns its position %p', (direction, before, expected) => {
        const view = createView();

        setYamlSearch(view, 'bar');
        (before as ('next' | 'previous')[]).forEach((d) => findYamlSearchMatch(view, d));

        expect(findYamlSearchMatch(view, direction as 'first' | 'next' | 'previous')).toStrictEqual(expected);
      });

      it('selects the text of the match', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        findYamlSearchMatch(view, 'next');
        findYamlSearchMatch(view, 'next');

        const { from, to } = view.state.selection.main;

        expect(view.state.sliceDoc(from, to)).toStrictEqual('Bar');
      });

      it('wraps around after the last match', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        ['next', 'next', 'next'].forEach((d) => findYamlSearchMatch(view, d as 'next'));

        expect(findYamlSearchMatch(view, 'next')).toStrictEqual(1);
      });

      it('marks the selected match', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        findYamlSearchMatch(view, 'previous');

        expect(marked(view, SELECTED)).toStrictEqual(['bar']);
        expect(marked(view, MATCH)).toStrictEqual(['bar', 'Bar', 'bar']);
      });

      it('treats the query as plain text', () => {
        const view = createView('a: x\\ny\nb: x\\ny');

        setYamlSearch(view, 'x\\n');

        expect(findYamlSearchMatch(view, 'first')).toStrictEqual(1);
      });

      it.each(['first', 'next', 'previous'])('returns 0 for %p without a query', (direction) => {
        const view = createView();

        setYamlSearch(view, '');

        expect(findYamlSearchMatch(view, direction as 'first' | 'next' | 'previous')).toStrictEqual(0);
      });

      it('returns 0 when there is no match', () => {
        const view = createView();

        setYamlSearch(view, 'nothing');

        expect(findYamlSearchMatch(view, 'first')).toStrictEqual(0);
      });
    });

    describe('yamlSearchMatchIndex', () => {
      it('is 0 when the selection is not on a match', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        view.dispatch({ selection: EditorSelection.single(0, 3) });

        expect(yamlSearchMatchIndex(view.state)).toStrictEqual(0);
      });

      it('is 0 for an empty selection', () => {
        const view = createView();

        setYamlSearch(view, 'bar');

        expect(yamlSearchMatchIndex(view.state)).toStrictEqual(0);
      });

      it('follows the selected match while the document is edited', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        findYamlSearchMatch(view, 'next');
        view.dispatch({ changes: { from: 0, insert: 'bar: 1\n' } });

        expect(yamlSearchMatchIndex(view.state)).toStrictEqual(2);
      });
    });
  });
});
