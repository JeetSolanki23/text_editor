import { type Editor } from '@tiptap/react';
import { LayoutPanelLeft, PlusCircle, RotateCcw } from 'lucide-react';
import { RESUME_TEMPLATE, INVOICE_TEMPLATE, REPORT_TEMPLATE } from './templates';

interface TemplatePickerProps {
  editor: Editor | null;
}

const TemplatePicker = ({ editor }: TemplatePickerProps) => {
  if (!editor) return null;

  const templates = [
    { name: 'Resume', content: RESUME_TEMPLATE },
    { name: 'Invoice', content: INVOICE_TEMPLATE },
    { name: 'Report', content: REPORT_TEMPLATE },
  ];

  const applyTemplate = (content: string, mode: 'append' | 'fresh') => {
    if (mode === 'fresh') {
      editor.commands.setContent(content);
    } else {
      editor.commands.insertContent(content);
    }
  };

  return (
    <div className="group relative">
      <button className="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1" title="Templates">
        <LayoutPanelLeft size={18} />
        <span className="text-sm">Templates</span>
      </button>
      <div className="absolute left-0 mt-2 w-64 bg-background border rounded shadow-lg hidden group-hover:block z-50">
        <div className="p-2 space-y-2">
          {templates.map((template) => (
            <div key={template.name} className="border rounded p-2">
              <p className="font-medium text-sm mb-2">{template.name}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => applyTemplate(template.content, 'fresh')}
                  className="flex-1 text-[10px] bg-primary text-primary-foreground py-1 px-2 rounded flex items-center justify-center gap-1"
                >
                  <RotateCcw size={10} /> Fresh
                </button>
                <button
                  onClick={() => applyTemplate(template.content, 'append')}
                  className="flex-1 text-[10px] bg-secondary text-secondary-foreground py-1 px-2 rounded flex items-center justify-center gap-1"
                >
                  <PlusCircle size={10} /> Append
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatePicker;
