import { EditorContent, type Editor as TiptapEditor } from '@tiptap/react';

interface EditorProps {
  editor: TiptapEditor | null;
  isPageView: boolean;
}

const Editor = ({ editor, isPageView }: EditorProps) => {
  if (!editor) return null;

  return (
    <div className={`flex justify-center w-full min-h-screen bg-muted/30 ${isPageView ? 'overflow-auto' : ''}`}>
      <EditorContent
        editor={editor}
        className="w-full flex justify-center"
      />
    </div>
  );
};

export default Editor;
export { Editor };
