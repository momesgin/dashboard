import { EditorView, lineNumbers } from '@codemirror/view';
import { setLineClasses, DEFAULT_LINE_CLASS, LineClassMarker } from '@shell/utils/code-mirror-line-classes';

describe('fx: code-mirror-line-classes', () => {
  const DOC = 'a: 1\nb: 2\nc: 3';

  const createView = (doc = DOC) => new EditorView({ doc, extensions: [lineNumbers()] });
  const lineClasses = (view: EditorView) => Array.from(view.contentDOM.querySelectorAll('.cm-line')).map((l) => l.className);
  const gutterClasses = (view: EditorView) => Array.from(view.dom.querySelectorAll('.cm-lineNumbers .cm-gutterElement'))
    .filter((el) => /^\d+$/.test(el.textContent || '') && !(el as HTMLElement).style.visibility)
    .map((el) => el.className);

  describe('setLineClasses', () => {
    it('puts the default class on the given lines', () => {
      const view = createView();

      setLineClasses(view, [{ line: 0 }, { line: 2 }]);

      expect(lineClasses(view)).toStrictEqual([`cm-line ${ DEFAULT_LINE_CLASS }`, 'cm-line', `cm-line ${ DEFAULT_LINE_CLASS }`]);
    });

    it('puts the class on the gutters of the given lines', () => {
      const view = createView();

      setLineClasses(view, [{ line: 1 }]);

      expect(gutterClasses(view)).toStrictEqual(['cm-gutterElement', `cm-gutterElement ${ DEFAULT_LINE_CLASS }`, 'cm-gutterElement']);
    });

    it('honours a custom className', () => {
      const view = createView();

      setLineClasses(view, [{ line: 1, className: 'my-class' }]);

      expect(lineClasses(view)[1]).toStrictEqual('cm-line my-class');
    });

    it('ignores line numbers outside the document', () => {
      const view = createView();

      setLineClasses(view, [{ line: -1 }, { line: 1 }, { line: 3 }, { line: 99 }]);

      expect(lineClasses(view)).toStrictEqual(['cm-line', `cm-line ${ DEFAULT_LINE_CLASS }`, 'cm-line']);
    });

    it('accepts the lines in any order', () => {
      const view = createView();

      setLineClasses(view, [{ line: 2 }, { line: 0 }]);

      expect(lineClasses(view)).toStrictEqual([`cm-line ${ DEFAULT_LINE_CLASS }`, 'cm-line', `cm-line ${ DEFAULT_LINE_CLASS }`]);
    });

    it('replaces the previous classes', () => {
      const view = createView();

      setLineClasses(view, [{ line: 0 }]);
      setLineClasses(view, [{ line: 2 }]);

      expect(lineClasses(view)).toStrictEqual(['cm-line', 'cm-line', `cm-line ${ DEFAULT_LINE_CLASS }`]);
    });

    it('clears the classes when called without lines', () => {
      const view = createView();

      setLineClasses(view, [{ line: 0 }]);
      setLineClasses(view);

      expect(lineClasses(view)).toStrictEqual(['cm-line', 'cm-line', 'cm-line']);
    });

    it('keeps a class on its line when a line is added above it', () => {
      const view = createView();

      setLineClasses(view, [{ line: 1 }]);
      view.dispatch({ changes: { from: 0, insert: 'z: 0\n' } });

      expect(lineClasses(view)).toStrictEqual(['cm-line', 'cm-line', `cm-line ${ DEFAULT_LINE_CLASS }`, 'cm-line']);
    });
  });

  describe('lineClassMarker', () => {
    it('equals a marker with the same class', () => {
      expect(new LineClassMarker('a').eq(new LineClassMarker('a'))).toStrictEqual(true);
    });

    it('does not equal a marker with another class', () => {
      expect(new LineClassMarker('a').eq(new LineClassMarker('b'))).toStrictEqual(false);
    });
  });
});
