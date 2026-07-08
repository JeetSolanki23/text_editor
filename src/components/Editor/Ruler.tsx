import { cn } from "../../utils/utils";

interface RulerProps {
  orientation: 'horizontal' | 'vertical';
}

const Ruler = ({ orientation }: RulerProps) => {
  const size = orientation === 'horizontal' ? 794 : 1123;
  const marks = Array.from({ length: Math.floor(size / 10) + 1 }, (_, i) => i * 10);

  return (
    <div
      className={cn(
        "bg-muted/50 dark:bg-muted/20 border-border select-none overflow-hidden",
        orientation === 'horizontal' ? "h-6 border-b w-[794px] sticky top-0 z-10" : "w-6 border-r h-[1123px] sticky left-0 z-10"
      )}
    >
      <div className={cn(
        "relative",
        orientation === 'horizontal' ? "flex" : "flex flex-col"
      )}>
        {marks.map((mark) => (
          <div
            key={mark}
            className={cn(
              "absolute border-muted-foreground/30 dark:border-muted-foreground/20",
              orientation === 'horizontal'
                ? "border-l top-0 h-2"
                : "border-t left-0 w-2",
              mark % 100 === 0 && (orientation === 'horizontal' ? "h-4" : "w-4")
            )}
            style={{
              [orientation === 'horizontal' ? 'left' : 'top']: `${mark}px`
            }}
          >
            {mark % 100 === 0 && (
              <span className={cn(
                "absolute text-[8px] opacity-50 dark:text-muted-foreground",
                orientation === 'horizontal' ? "top-4 left-1" : "left-4 top-1"
              )}>
                {mark / 100}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ruler;
