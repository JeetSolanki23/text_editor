import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import TurndownService from 'turndown';
import HTMLToDOCX from 'html-to-docx';

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

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Using jsPDF's html method for text-selectable PDF
  // Note: This requires a relatively modern jsPDF and might need some styling adjustments
  await pdf.html(element, {
    callback: (doc) => {
      doc.save(filename);
    },
    x: 10,
    y: 10,
    width: 190,
    windowWidth: 794, // Match our editor width for consistent scaling
    autoPaging: 'text',
  });
};

export const exportToDocx = async (content: string, filename: string = 'document.docx') => {
  try {
    const fileBuffer = await HTMLToDOCX(content, undefined, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    saveAs(fileBuffer, filename);
  } catch (error) {
    console.error('DOCX Export Error:', error);
    // Fallback to simple blob if html-to-docx fails
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>`;
    const footer = "</body></html>";
    const blob = new Blob(['\ufeff', header + content + footer], { type: 'application/msword' });
    saveAs(blob, filename);
  }
};
