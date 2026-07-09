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
          align: {
            default: 'center',
            renderHTML: (attributes) => {
              if (attributes.align === 'left') return { style: 'float: left; margin-right: 1rem; margin-bottom: 0.5rem;' };
              if (attributes.align === 'right') return { style: 'float: right; margin-left: 1rem; margin-bottom: 0.5rem;' };
              if (attributes.align === 'center') return { style: 'display: block; margin: 1rem auto;' };
              return {};
            },
          },
          alt: {
            default: null,
            renderHTML: (attributes) => ({
              alt: attributes.alt,
            }),
          },
        },
      },
    ];
  },
});
