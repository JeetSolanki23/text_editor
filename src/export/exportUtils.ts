import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import TurndownService from 'turndown';

export const exportToTxt = (content: string, filename: string = 'document.txt') => {
  const tempEl = document.createElement('div');
  tempEl.innerHTML = content;
  const text = tempEl.innerText;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
};

export const exportToMarkdown = (content: string, filename: string = 'document.md') => {
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(content);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, filename);
};

export const exportToPdf = async (filename: string = 'document.pdf') => {
  const element = document.querySelector('.tiptap') as HTMLElement;
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
};

export const exportToDocx = async (content: string, filename: string = 'document.docx') => {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Export</title></head><body>
  `;
  const footer = "</body></html>";
  const sourceHTML = header + content + footer;

  const blob = new Blob(['\ufeff', sourceHTML], {
    type: 'application/msword'
  });

  saveAs(blob, filename);
};
