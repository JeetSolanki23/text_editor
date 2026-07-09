import { useState, useEffect, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { FontSize } from './components/Editor/FontSizeExtension';
import { ImageResize } from './components/Editor/ImageResizeExtension';
import { Indent } from './components/Editor/IndentExtension';
import { LineHeight } from './components/Editor/LineHeightExtension';

import Editor from './components/Editor/Editor';
import Toolbar from './components/Toolbar/Toolbar';
import Stats from './components/Editor/Stats';
import Outline from './components/Editor/Outline';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import { db } from './db';
import debounce from 'lodash.debounce';
import DOMPurify from 'dompurify';
import { exportToDocx, exportToMarkdown, exportToPdf, exportToTxt } from './export/exportUtils';
import { useGoogleFonts } from './hooks/useGoogleFonts';
import { compressImage } from './utils/imageUtils';

const DEFAULT_CONTENT = '<h1>Welcome to your new document</h1><p>Start editing to see the magic happen...</p>';

function App() {
  useGoogleFonts();
  const { toast } = useToast();
  const [isPageView, setIsPageView] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [initialContent, setInitialContent] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [, setTick] = useState(0);

  useEffect(() => {
    const loadDoc = async () => {
      const doc = await db.documents.get('main-doc');
      setInitialContent(doc?.content || DEFAULT_CONTENT);
    };
    loadDoc();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      ImageResize,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      FontSize,
      Indent,
      LineHeight,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: 'Start typing...' }),
      CharacterCount,
      Subscript,
      Superscript,
    ],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      const cleanHTML = DOMPurify.sanitize(editor.getHTML());
      debouncedSave(cleanHTML);
      setTick(t => t + 1); // Force re-render for stats
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto dark:prose-invert transition-all',
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            compressImage(file).then(base64 => {
              if (editor) editor.chain().focus().setImage({ src: base64 }).run();
            });
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();
            if (file) {
              compressImage(file).then(base64 => {
                if (editor) editor.chain().focus().setImage({ src: base64 }).run();
              });
              return true;
            }
          }
        }
        return false;
      },
    },
  }, [initialContent === null]);

  useEffect(() => {
    if (editor) {
      const isLandscape = orientation === 'landscape';
      const pageWidth = isLandscape ? '1123px' : '794px';
      const minHeight = isLandscape ? '794px' : '1123px';

      editor.setOptions({
        editorProps: {
          attributes: {
            class: `focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto dark:prose-invert transition-all origin-top editor-page ${
              isPageView ? 'p-[96px] my-8 shadow-lg' : 'w-full max-w-4xl p-8'
            }`,
            style: `transform: scale(${zoom / 100}); transform-origin: top center; ${isPageView ? `min-height: ${minHeight}; width: ${pageWidth};` : ''}`,
          },
        },
      });
    }
  }, [editor, isPageView, zoom, orientation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (editor) {
           exportToDocx(editor.getHTML());
           toast({ title: "Document Exported", description: "Your .docx file is ready." });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, toast]);

  const debouncedSave = useCallback(
    debounce(async (newContent: string) => {
      await db.documents.put({
        id: 'main-doc',
        title: 'Untitled Document',
        content: newContent,
        updatedAt: Date.now(),
      });
    }, 1000),
    []
  );

  const handleExport = async (format: 'docx' | 'pdf' | 'md' | 'txt' | 'print') => {
    if (!editor) return;
    const content = editor.getHTML();

    if (format === 'print') {
      window.print();
      return;
    }

    toast({ title: "Exporting...", description: `Preparing your ${format.toUpperCase()} file.` });

    try {
      switch (format) {
        case 'docx':
          await exportToDocx(content);
          break;
        case 'pdf':
          await exportToPdf();
          break;
        case 'md':
          await exportToMarkdown(content);
          break;
        case 'txt':
          await exportToTxt(content);
          break;
      }
      toast({ title: "Success", description: "Document exported successfully." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to export document." });
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNewDocument = () => {
    if (window.confirm("Start a new document? All unsaved changes will be lost.")) {
      editor?.chain().focus().selectAll().deleteSelection().insertContent(DEFAULT_CONTENT).run();
      toast({ title: "New Document", description: "Editor has been reset." });
    }
  };

  if (initialContent === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className={`min-h-screen h-screen flex flex-col bg-background text-foreground transition-colors overflow-hidden`}>
      <Toolbar
        editor={editor}
        onExport={handleExport}
        isPageView={isPageView}
        togglePageView={() => setIsPageView(!isPageView)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        zoom={zoom}
        onZoomChange={setZoom}
        onNewDocument={handleNewDocument}
        orientation={orientation}
        onOrientationChange={setOrientation}
      />
      <div className="flex-1 flex overflow-hidden">
        <Outline editor={editor} />
        <main className="flex-1 overflow-auto bg-muted/20 dark:bg-background custom-scrollbar relative">
          <div className="min-h-full flex justify-center">
            <Editor
              editor={editor}
              isPageView={isPageView}
              orientation={orientation}
            />
          </div>
        </main>
      </div>
      <Stats editor={editor} />
      <Toaster />
    </div>
  );
}

export default App;
