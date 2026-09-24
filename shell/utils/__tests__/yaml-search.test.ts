import { EditorView, lineNumbers } from '@codemirror/view';
import { countMatches, yamlSearchSegments, setYamlSearch, SEARCH_STYLE } from '@shell/utils/yaml-search';

const { KEY, VALUE, DIM } = SEARCH_STYLE;

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

  describe('yamlSearchSegments', () => {
    it('dims a line without a match', () => {
      expect(yamlSearchSegments('  replicas: 2', 'bar')).toStrictEqual([{ end: 13, style: DIM }]);
    });

    it('returns no segments for an empty line', () => {
      expect(yamlSearchSegments('', 'bar')).toStrictEqual([]);
    });

    it('styles the key with its colon and the value of a matched line', () => {
      expect(yamlSearchSegments('foo: bar', 'bar')).toStrictEqual([
        { end: 4, style: KEY },
        { end: 5, style: null },
        { end: 8, style: VALUE },
      ]);
    });

    it('styles the whole line when only the key matches', () => {
      expect(yamlSearchSegments('fooBar: 1', 'bar')).toStrictEqual([
        { end: 7, style: KEY },
        { end: 8, style: null },
        { end: 9, style: VALUE },
      ]);
    });

    it('leaves the indentation unstyled', () => {
      expect(yamlSearchSegments('    tag: bar', 'bar')).toStrictEqual([
        { end: 4, style: null },
        { end: 8, style: KEY },
        { end: 9, style: null },
        { end: 12, style: VALUE },
      ]);
    });

    it('styles only the key of a map header', () => {
      expect(yamlSearchSegments('  sidebar:', 'bar')).toStrictEqual([
        { end: 2, style: null },
        { end: 10, style: KEY },
      ]);
    });

    it('styles a list item without a key as a value', () => {
      expect(yamlSearchSegments('  - foobar', 'bar')).toStrictEqual([
        { end: 4, style: null },
        { end: 10, style: VALUE },
      ]);
    });

    it('styles the key of a mapping inside a list item', () => {
      expect(yamlSearchSegments('- name: bar', 'bar')).toStrictEqual([
        { end: 2, style: null },
        { end: 7, style: KEY },
        { end: 8, style: null },
        { end: 11, style: VALUE },
      ]);
    });

    it('does not treat a colon inside a value as the key separator', () => {
      expect(yamlSearchSegments('url: http://bar.io', 'bar')).toStrictEqual([
        { end: 4, style: KEY },
        { end: 5, style: null },
        { end: 18, style: VALUE },
      ]);
    });

    it('styles a line without a key as a value', () => {
      expect(yamlSearchSegments('http://bar.io', 'bar')).toStrictEqual([{ end: 13, style: VALUE }]);
    });

    it('handles a quoted key that contains a colon', () => {
      expect(yamlSearchSegments('"a: b": bar', 'bar')).toStrictEqual([
        { end: 7, style: KEY },
        { end: 8, style: null },
        { end: 11, style: VALUE },
      ]);
    });

    it('matches regardless of the case in the line', () => {
      expect(yamlSearchSegments('BAR: 1', 'bar')).toStrictEqual([
        { end: 4, style: KEY },
        { end: 5, style: null },
        { end: 6, style: VALUE },
      ]);
    });
  });

  describe('codeMirror 6 extension', () => {
    const DOC = 'foo: bar\nreplicas: 2\nlist:\n  - Bar\nbaz: foobar';

    const createView = (doc = DOC) => new EditorView({ doc, extensions: [lineNumbers()] });
    const lineClasses = (view: EditorView) => Array.from(view.contentDOM.querySelectorAll('.cm-line')).map((l) => l.className);
    const marked = (view: EditorView, className: string) => Array.from(view.contentDOM.querySelectorAll(`.${ className }`)).map((el) => el.textContent);
    const gutterClasses = (view: EditorView) => Array.from(view.dom.querySelectorAll('.cm-lineNumbers .cm-gutterElement'))
      .filter((el) => /^\d+$/.test(el.textContent || '') && !(el as HTMLElement).style.visibility)
      .map((el) => el.className);

    describe('setYamlSearch', () => {
      it('marks the key and the value of each matched line', () => {
        const view = createView();

        setYamlSearch(view, 'BAR');

        expect(marked(view, KEY)).toStrictEqual(['foo:', 'baz:']);
        expect(marked(view, VALUE)).toStrictEqual(['bar', 'Bar', 'foobar']);
      });

      it('dims the lines without a match', () => {
        const view = createView();

        setYamlSearch(view, 'bar');

        expect(lineClasses(view)).toStrictEqual(['cm-line', `cm-line ${ DIM }`, `cm-line ${ DIM }`, 'cm-line', 'cm-line']);
      });

      it('dims the gutters of the lines without a match', () => {
        const view = createView();

        setYamlSearch(view, 'bar');

        expect(gutterClasses(view)).toStrictEqual([
          'cm-gutterElement', `cm-gutterElement ${ DIM }`, `cm-gutterElement ${ DIM }`, 'cm-gutterElement', 'cm-gutterElement'
        ]);
      });

      it('replaces the highlight when the query changes', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        setYamlSearch(view, 'replicas');

        expect(marked(view, KEY)).toStrictEqual(['replicas:']);
      });

      it('clears the highlight for an empty query', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        setYamlSearch(view, '');

        expect(lineClasses(view)).toStrictEqual(['cm-line', 'cm-line', 'cm-line', 'cm-line', 'cm-line']);
      });

      it('highlights a line again once it is edited to match', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        view.dispatch({ changes: { from: view.state.doc.line(2).to, insert: 'bar' } });

        expect(marked(view, VALUE)).toStrictEqual(['bar', '2bar', 'Bar', 'foobar']);
        expect(lineClasses(view)[1]).toStrictEqual('cm-line');
      });

      it('dims a line again once its match is removed', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        view.dispatch({ changes: { from: 5, to: 8 } });

        expect(lineClasses(view)[0]).toStrictEqual(`cm-line ${ DIM }`);
      });

      it('leaves the lines that were not edited alone', () => {
        const view = createView();

        setYamlSearch(view, 'bar');
        view.dispatch({ changes: { from: 0, insert: 'x' } });

        expect(lineClasses(view)).toStrictEqual(['cm-line', `cm-line ${ DIM }`, `cm-line ${ DIM }`, 'cm-line', 'cm-line']);
      });
    });
  });
});
