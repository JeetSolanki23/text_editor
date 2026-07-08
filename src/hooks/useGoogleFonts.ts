import { useEffect } from 'react';

const fonts = [
  'Inter',
  'Merriweather',
  'JetBrains Mono',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Playfair Display',
];

export const useGoogleFonts = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    const fontQuery = fonts.map(f => f.replace(' ', '+')).join('&family=');
    link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
};
