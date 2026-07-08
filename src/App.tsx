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

import Editor from './components/Editor/Editor';
import Toolbar from './components/Toolbar/Toolbar';
import Stats from './components/Editor/Stats';
import { db } from './db';
import debounce from 'lodash.debounce';
import { exportToDocx, exportToMarkdown, exportToPdf, exportToTxt } from './export/exportUtils';

const DEFAULT_CONTENT = '<h1>Welcome to your new document</h1><p>Start editing to see the magic happen...</p>';

function App() {
  const [isPageView, setIsPageView] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [initialContent, setInitialContent] = useState<string | null>(null);

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
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: 'Start typing...' }),
      CharacterCount,
      Subscript,
      Superscript,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      debouncedSave(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto ${
          isPageView ? 'bg-white shadow-lg min-h-[1123px] w-[794px] p-[96px] my-8 transition-all' : 'w-full max-w-4xl p-8 transition-all'
        } dark:prose-invert`,
      },
    },
  }, [initialContent, isPageView]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (editor) exportToDocx(editor.getHTML());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

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

  const handleExport = (format: 'docx' | 'pdf' | 'md' | 'txt') => {
    if (!editor) return;
    const content = editor.getHTML();

    switch (format) {
      case 'docx':
        exportToDocx(content);
        break;
      case 'pdf':
        exportToPdf();
        break;
      case 'md':
        exportToMarkdown(content);
        break;
      case 'txt':
        exportToTxt(content);
        break;
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (initialContent === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''} bg-muted/10 transition-colors`}>
      <Toolbar
        editor={editor}
        onExport={handleExport}
        isPageView={isPageView}
        togglePageView={() => setIsPageView(!isPageView)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="flex-1 overflow-auto">
        <Editor
          editor={editor}
          isPageView={isPageView}
        />
      </main>
      <Stats editor={editor} />
    </div>
  );
}

export default App;
