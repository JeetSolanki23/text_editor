import { type Editor } from '@tiptap/react';

interface StatsProps {
  editor: Editor | null;
}

const Stats = ({ editor }: StatsProps) => {
  if (!editor) return null;

  const { characters, words } = editor.storage.characterCount;

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-full px-3 py-1 flex items-center gap-3 text-[10px] sm:text-xs font-medium shadow-sm z-50 opacity-90 sm:opacity-100 no-print">
      <span>{words()} words</span>
      <span className="w-px h-3 bg-border" />
      <span>{characters()} characters</span>
    </div>
  );
};

export default Stats;
