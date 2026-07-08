import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Table as TableIcon,
  Image as ImageIcon,
  CheckSquare,
  FileDown,
  Layout,
  Sun,
  Moon,
  Columns,
  Rows,
  Trash2,
  Merge,
  Split,
} from 'lucide-react';
import React from 'react';
import { compressImage } from '../../utils/imageUtils';
import TemplatePicker from '../Templates/TemplatePicker';

interface ToolbarProps {
  editor: TiptapEditor | null;
  onExport: (format: 'docx' | 'pdf' | 'md' | 'txt') => void;
  isPageView: boolean;
  togglePageView: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

type TiptapEditor = Editor;

const Toolbar = ({
  editor,
  onExport,
  isPageView,
  togglePageView,
  isDarkMode,
  toggleDarkMode,
}: ToolbarProps) => {
  if (!editor) return null;

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'];
  const fontFamilies = [
    { label: 'Default', value: 'Inter, sans-serif' },
    { label: 'Serif', value: 'Merriweather, serif' },
    { label: 'Mono', value: 'JetBrains Mono, monospace' },
    { label: 'Roboto', value: 'Roboto, sans-serif' },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedBase64 = await compressImage(file);
      editor.chain().focus().setImage({ src: compressedBase64 }).run();
    }
  };

  const Button = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
    className = '',
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
        isActive ? 'bg-accent text-accent-foreground' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center gap-1 p-2 border-b bg-background shadow-sm overflow-x-auto max-w-full">
      <div className="flex items-center gap-1 border-r pr-2">
        <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo size={18} />
        </Button>
        <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <TemplatePicker editor={editor} />
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <select
          className="bg-transparent border-none text-sm p-1 focus:ring-0 cursor-pointer"
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontFamily || ''}
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <select
          className="bg-transparent border-none text-sm p-1 focus:ring-0 cursor-pointer"
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontSize || '16px'}
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          title="Task List"
        >
          <CheckSquare size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert Table"
        >
          <TableIcon size={18} />
        </Button>

        {editor.isActive('table') && (
          <div className="flex items-center gap-1 bg-muted/50 rounded px-1">
            <Button onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Before"><Columns size={16} className="rotate-180"/></Button>
            <Button onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column After"><Columns size={16} /></Button>
            <Button onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Before"><Rows size={16} className="rotate-180"/></Button>
            <Button onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row After"><Rows size={16} /></Button>
            <Button onClick={() => editor.chain().focus().mergeCells().run()} title="Merge Cells"><Merge size={16}/></Button>
            <Button onClick={() => editor.chain().focus().splitCell().run()} title="Split Cell"><Split size={16}/></Button>
            <Button onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table" className="text-destructive"><Trash2 size={16}/></Button>
          </div>
        )}

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            title="Upload Image"
          />
          <Button onClick={() => {}}>
            <ImageIcon size={18} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          onClick={togglePageView}
          isActive={isPageView}
          title={isPageView ? "Switch to Continuous View" : "Switch to Page View"}
        >
          <Layout size={18} />
        </Button>
        <Button onClick={toggleDarkMode} title="Toggle Theme">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <div className="group relative">
           <Button onClick={() => {}} title="Export">
             <FileDown size={18} />
           </Button>
           <div className="absolute right-0 mt-2 w-32 bg-background border rounded shadow-lg hidden group-hover:block z-50">
              <button onClick={() => onExport('docx')} className="w-full text-left px-4 py-2 hover:bg-accent text-sm">DOCX</button>
              <button onClick={() => onExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-accent text-sm">PDF</button>
              <button onClick={() => onExport('md')} className="w-full text-left px-4 py-2 hover:bg-accent text-sm">Markdown</button>
              <button onClick={() => onExport('txt')} className="w-full text-left px-4 py-2 hover:bg-accent text-sm">Text</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
