import { Extension } from '@tiptap/core';

export const ImageResize = Extension.create({
  name: 'imageResize',

  addGlobalAttributes() {
    return [
      {
        types: ['image'],
        attributes: {
          width: {
            default: '100%',
            renderHTML: (attributes) => ({
              width: attributes.width,
            }),
          },
          height: {
            default: 'auto',
            renderHTML: (attributes) => ({
              height: attributes.height,
            }),
          },
        },
      },
    ];
  },
});
