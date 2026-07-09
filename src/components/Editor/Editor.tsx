import { EditorContent, type Editor as TiptapEditor } from '@tiptap/react';
import Ruler from './Ruler';

interface EditorProps {
  editor: TiptapEditor | null;
  isPageView: boolean;
  orientation: 'portrait' | 'landscape';
}

const Editor = ({ editor, isPageView, orientation }: EditorProps) => {
  if (!editor) return null;

  return (
    <div className={`flex flex-col items-center w-full min-h-full bg-muted/30 dark:bg-background/50 ${isPageView ? 'py-4 md:py-8' : ''}`}>
      {isPageView && (
        <div className="relative shadow-2xl transition-all max-w-full overflow-x-auto custom-scrollbar bg-white dark:bg-muted/10">
          <div className="hidden md:block">
            <Ruler orientation="horizontal" pageOrientation={orientation} />
          </div>
          <div className="flex">
            <div className="hidden md:block">
              <Ruler orientation="vertical" pageOrientation={orientation} />
            </div>
            <div className="relative bg-transparent">
              <div className="absolute top-0 left-0 right-0 h-[96px] flex items-center justify-center text-[10px] opacity-30 pointer-events-none select-none uppercase tracking-widest border-b border-dashed">
                Header
              </div>
              <EditorContent
                editor={editor}
                className="bg-transparent"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[96px] flex flex-col items-center justify-center text-[10px] opacity-30 pointer-events-none select-none uppercase tracking-widest border-t border-dashed">
                <span>Footer</span>
                <span className="mt-1">Page 1</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isPageView && (
        <EditorContent
          editor={editor}
          className="w-full flex justify-center"
        />
      )}
    </div>
  );
};

export default Editor;
export { Editor };
