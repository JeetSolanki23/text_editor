import { EditorContent, type Editor as TiptapEditor } from '@tiptap/react';
import Ruler from './Ruler';

interface EditorProps {
  editor: TiptapEditor | null;
  isPageView: boolean;
}

const Editor = ({ editor, isPageView }: EditorProps) => {
  if (!editor) return null;

  return (
    <div className={`flex flex-col items-center w-full min-h-full bg-muted/30 dark:bg-background/50 ${isPageView ? 'py-4 md:py-8' : ''}`}>
      {isPageView && (
        <div className="relative shadow-2xl transition-all max-w-full overflow-x-auto custom-scrollbar bg-white dark:bg-muted/10">
          <div className="hidden md:block">
            <Ruler orientation="horizontal" />
          </div>
          <div className="flex">
            <div className="hidden md:block">
              <Ruler orientation="vertical" />
            </div>
            <EditorContent
              editor={editor}
              className="bg-transparent"
            />
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
