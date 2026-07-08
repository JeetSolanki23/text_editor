import { EditorContent, type Editor as TiptapEditor } from '@tiptap/react';
import Ruler from './Ruler';

interface EditorProps {
  editor: TiptapEditor | null;
  isPageView: boolean;
}

const Editor = ({ editor, isPageView }: EditorProps) => {
  if (!editor) return null;

  return (
    <div className={`flex flex-col items-center w-full min-h-full bg-muted/30 ${isPageView ? 'py-8' : ''}`}>
      {isPageView && (
        <div className="relative shadow-2xl transition-all">
          <Ruler orientation="horizontal" />
          <div className="flex">
            <Ruler orientation="vertical" />
            <EditorContent
              editor={editor}
              className="bg-white"
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
