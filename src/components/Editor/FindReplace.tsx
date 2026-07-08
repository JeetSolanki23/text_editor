import { type Editor } from '@tiptap/react';
import { useState } from 'react';
import { Search, ArrowRight, Replace, ReplaceAll } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface FindReplaceProps {
  editor: Editor | null;
}

const FindReplace = ({ editor }: FindReplaceProps) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const handleReplace = () => {
    if (!editor || !findText) return;
    const content = editor.getHTML();
    const newContent = content.replace(new RegExp(findText, 'g'), replaceText);
    editor.commands.setContent(newContent, { emitUpdate: true });
  };

  const handleReplaceAll = () => {
    handleReplace();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Search size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Search size={14} className="opacity-50" />
            <input
              placeholder="Find..."
              className="flex-1 bg-transparent border-none text-sm focus:ring-0"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight size={14} className="opacity-50" />
            <input
              placeholder="Replace with..."
              className="flex-1 bg-transparent border-none text-sm focus:ring-0"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" className="h-8" onClick={handleReplace}>
              <Replace size={14} className="mr-1" /> Replace
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={handleReplaceAll}>
              <ReplaceAll size={14} className="mr-1" /> All
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FindReplace;
