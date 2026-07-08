import { type Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { ListTree, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/utils';

interface OutlineProps {
  editor: Editor | null;
}

interface OutlineItem {
  text: string;
  level: number;
  id: string;
  pos: number;
}

const Outline = ({ editor }: OutlineProps) => {
  const [items, setItems] = useState<OutlineItem[]>([]);

  useEffect(() => {
    if (!editor) return;

    const updateOutline = () => {
      const headings: OutlineItem[] = [];
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          headings.push({
            text: node.textContent,
            level: node.attrs.level,
            id: `heading-${headings.length}`,
            pos,
          });
        }
      });
      setItems(headings);
    };

    updateOutline();
    editor.on('update', updateOutline);
    return () => {
      editor.off('update', updateOutline);
    };
  }, [editor]);

  if (items.length === 0) return null;

  return (
    <div className="w-64 border-r bg-background/50 h-full overflow-y-auto p-4 hidden xl:block shrink-0">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold opacity-70">
        <ListTree size={16} />
        OUTLINE
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              editor?.chain().focus().setTextSelection(item.pos).scrollIntoView().run();
            }}
            className={cn(
              "text-left w-full px-2 py-1.5 rounded-sm hover:bg-accent text-sm transition-colors flex items-center gap-1",
              item.level === 1 && "font-semibold",
              item.level === 2 && "pl-4",
              item.level === 3 && "pl-8",
              item.level > 3 && "pl-12 text-xs"
            )}
          >
            <ChevronRight size={12} className="shrink-0 opacity-40" />
            <span className="truncate">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Outline;
