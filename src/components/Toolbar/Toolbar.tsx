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
  ChevronDown,
  Minus,
  Plus,
  Indent as IndentIcon,
  Outdent as OutdentIcon,
  Type,
  FilePlus,
  Printer,
} from 'lucide-react';
import React from 'react';
import { compressImage } from '../../utils/imageUtils';
import TemplatePicker from '../Templates/TemplatePicker';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import FindReplace from '../Editor/FindReplace';
import { cn } from '../../utils/utils';

interface ToolbarProps {
  editor: Editor | null;
  onExport: (format: 'docx' | 'pdf' | 'md' | 'txt' | 'print') => void;
  isPageView: boolean;
  togglePageView: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onNewDocument: () => void;
}

const Toolbar = ({
  editor,
  onExport,
  isPageView,
  togglePageView,
  isDarkMode,
  toggleDarkMode,
  zoom,
  onZoomChange,
  onNewDocument,
}: ToolbarProps) => {
  if (!editor) return null;

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'];
  const fontFamilies = [
    { label: 'Default', value: 'Inter, sans-serif' },
    { label: 'Serif', value: 'Merriweather, serif' },
    { label: 'Mono', value: 'JetBrains Mono, monospace' },
    { label: 'Roboto', value: 'Roboto, sans-serif' },
  ];
  const lineHeights = ['1', '1.15', '1.5', '2', '2.5', '3'];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedBase64 = await compressImage(file);
      editor.chain().focus().setImage({ src: compressedBase64 }).run();
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
    shortcut,
    className,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
    shortcut?: string;
    className?: string;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={cn("h-8 w-8 p-0 shrink-0", isActive && "bg-accent text-accent-foreground", className)}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="flex flex-col items-center">
        <span>{title}</span>
        {shortcut && <span className="text-[10px] opacity-60">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider delayDuration={400}>
      <div className="sticky top-0 z-50 flex items-center gap-1 p-1 border-b bg-background shadow-sm overflow-x-auto no-print scrollbar-hide">
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton onClick={onNewDocument} title="New Document">
            <FilePlus size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo" shortcut="Ctrl+Z">
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo" shortcut="Ctrl+Y">
            <Redo size={16} />
          </ToolbarButton>
          <div className="hidden sm:flex items-center gap-0.5">
            <ToolbarButton onClick={() => onExport('print')} title="Print">
              <Printer size={16} />
            </ToolbarButton>
          </div>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 shrink-0" />

        <div className="flex items-center gap-1 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-normal">
                <span className="hidden md:inline">
                  {fontFamilies.find(f => f.value === (editor.getAttributes('textStyle').fontFamily || 'Inter, sans-serif'))?.label || 'Font'}
                </span>
                <span className="md:hidden">F</span>
                <ChevronDown size={12} className="opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {fontFamilies.map((font) => (
                <DropdownMenuItem key={font.value} onClick={() => editor.chain().focus().setFontFamily(font.value).run()}>
                  {font.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1 px-1 text-xs font-normal w-12 sm:w-16">
                {editor.getAttributes('textStyle').fontSize || '16px'}
                <ChevronDown size={12} className="opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
              {fontSizes.map((size) => (
                <DropdownMenuItem key={size} onClick={() => editor.chain().focus().setFontSize(size).run()}>
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 shrink-0" />

        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold" shortcut="Ctrl+B">
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic" shortcut="Ctrl+I">
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline" shortcut="Ctrl+U">
            <UnderlineIcon size={16} />
          </ToolbarButton>
          <div className="hidden sm:flex items-center gap-0.5">
            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
              <Strikethrough size={16} />
            </ToolbarButton>
          </div>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 shrink-0" />

        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
            <AlignCenter size={16} />
          </ToolbarButton>
          <div className="hidden sm:flex items-center gap-0.5">
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
              <AlignRight size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
              <AlignJustify size={16} />
            </ToolbarButton>
          </div>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 shrink-0" />

        <div className="flex items-center gap-0.5 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Type size={16} />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {lineHeights.map((lh) => (
                <DropdownMenuItem key={lh} onClick={() => (editor as any).commands.setLineHeight(lh)}>
                  Line Height: {lh}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ToolbarButton onClick={() => (editor as any).commands.indent()} title="Indent">
            <IndentIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => (editor as any).commands.outdent()} title="Outdent">
            <OutdentIcon size={16} />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 shrink-0" />

        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
            <ListOrdered size={16} />
          </ToolbarButton>
          <div className="hidden sm:flex items-center gap-0.5">
            <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task List">
              <CheckSquare size={16} />
            </ToolbarButton>
          </div>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 shrink-0" />

        <div className="flex items-center gap-0.5 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <TableIcon size={16} />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                Insert Table (3x3)
              </DropdownMenuItem>
              {editor.isActive('table') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>Add Column Before</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>Add Column After</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>Add Row Before</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>Add Row After</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>Merge Cells</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>Split Cell</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()} className="text-destructive">Delete Table</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <ToolbarButton onClick={() => {}} title="Upload Image">
              <ImageIcon size={16} />
            </ToolbarButton>
          </div>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 shrink-0" />

        <TemplatePicker editor={editor} />

        <div className="flex items-center gap-0.5 ml-auto shrink-0">
          <div className="hidden lg:flex items-center gap-1 mr-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onZoomChange(Math.max(50, zoom - 10))}>
              <Minus size={14} />
            </Button>
            <span className="text-xs min-w-[3rem] text-center">{zoom}%</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onZoomChange(Math.min(200, zoom + 10))}>
              <Plus size={14} />
            </Button>
          </div>

          <FindReplace editor={editor} />

          <ToolbarButton onClick={togglePageView} isActive={isPageView} title={isPageView ? "Switch to Continuous View" : "Switch to Page View"}>
            <Layout size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={toggleDarkMode} title="Toggle Theme">
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </ToolbarButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 ml-1 sm:ml-2">
                <FileDown size={16} />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown size={12} className="opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport('docx')}>DOCX Document</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('pdf')}>PDF Document</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('md')}>Markdown File</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('txt')}>Plain Text File</DropdownMenuItem>
              <DropdownMenuSeparator className="sm:hidden" />
              <DropdownMenuItem onClick={() => onExport('print')} className="sm:hidden">Print Document</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
