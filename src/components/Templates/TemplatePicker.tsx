import { type Editor } from '@tiptap/react';
import { LayoutPanelLeft, PlusCircle, RotateCcw, ChevronDown } from 'lucide-react';
import { RESUME_TEMPLATE, INVOICE_TEMPLATE, REPORT_TEMPLATE } from './templates';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';

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
      editor.chain().focus().selectAll().deleteSelection().insertContent(content).run();
    } else {
      editor.chain().focus().insertContent(content).run();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-normal shrink-0">
          <LayoutPanelLeft size={16} />
          <span className="hidden md:inline">Templates</span>
          <ChevronDown size={12} className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Choose Template</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {templates.map((template) => (
          <div key={template.name} className="p-2 flex flex-col gap-1 border-b last:border-0">
            <span className="text-xs font-medium px-2 mb-1">{template.name}</span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[10px] flex-1"
                onClick={() => applyTemplate(template.content, 'fresh')}
              >
                <RotateCcw size={10} className="mr-1" /> Fresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[10px] flex-1"
                onClick={() => applyTemplate(template.content, 'append')}
              >
                <PlusCircle size={10} className="mr-1" /> Append
              </Button>
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TemplatePicker;
