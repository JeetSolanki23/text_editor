import { Node, mergeAttributes } from '@tiptap/core';

export const PageBreak = Node.create({
  name: 'pageBreak',
  group: 'block',
  selectable: true,
  draggable: true,

  parseHTML() {
    return [
      { tag: 'div.page-break' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'page-break', 'data-type': 'page-break' })];
  },

  addCommands() {
    return {
      setPageBreak: () => ({ commands }: any) => {
        return commands.insertContent({ type: this.name });
      },
    } as any;
  },
});
