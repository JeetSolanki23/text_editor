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

  const handleReplaceAll = () => {
    if (!editor || !findText) return;

    const { state } = editor;
    const { doc } = state;
    const replacements: { from: number; to: number }[] = [];

    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        let match;
        while ((match = regex.exec(node.text)) !== null) {
          replacements.push({
            from: pos + match.index,
            to: pos + match.index + findText.length,
          });
        }
      }
    });

    if (replacements.length === 0) return;

    editor.chain().focus().command(({ tr }) => {
      for (let i = replacements.length - 1; i >= 0; i--) {
        const { from, to } = replacements[i];
        tr.insertText(replaceText, from, to);
      }
      return true;
    }).run();
  };

  const handleReplace = () => {
    if (!editor || !findText) return;

    const { state } = editor;
    const { selection, doc } = state;
    const { from } = selection;

    let foundPos = -1;
    doc.descendants((node, pos) => {
      if (foundPos !== -1) return false;
      if (node.isText && node.text && pos + node.text.length > from) {
        const startSearch = Math.max(0, from - pos);
        const index = node.text.indexOf(findText, startSearch);
        if (index !== -1) {
          foundPos = pos + index;
          return false;
        }
      }
      return true;
    });

    if (foundPos !== -1) {
      editor.chain().focus().insertText(replaceText, foundPos, foundPos + findText.length).run();
    } else {
      // Wrap around search from beginning
      doc.descendants((node, pos) => {
        if (foundPos !== -1) return false;
        if (node.isText && node.text) {
          const index = node.text.indexOf(findText);
          if (index !== -1) {
            foundPos = pos + index;
            return false;
          }
        }
        return true;
      });
      if (foundPos !== -1) {
        editor.chain().focus().insertText(replaceText, foundPos, foundPos + findText.length).run();
      }
    }
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
