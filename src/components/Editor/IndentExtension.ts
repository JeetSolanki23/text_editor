import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      minIndent: 0,
      maxIndent: 10,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: element => parseInt(element.style.paddingLeft, 10) / 40 || 0,
            renderHTML: attributes => {
              if (!attributes.indent) {
                return {};
              }

              return {
                style: `padding-left: ${attributes.indent * 40}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);
          state.doc.nodesBetween(selection.from, selection.to, (node: any, pos: number) => {
            if (this.options.types.includes(node.type.name)) {
              const indent = Math.min(this.options.maxIndent, (node.attrs.indent || 0) + 1);
              tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent });
            }
          });
          if (dispatch) dispatch(tr);
          return true;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);
          state.doc.nodesBetween(selection.from, selection.to, (node: any, pos: number) => {
            if (this.options.types.includes(node.type.name)) {
              const indent = Math.max(this.options.minIndent, (node.attrs.indent || 0) - 1);
              tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent });
            }
          });
          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});
