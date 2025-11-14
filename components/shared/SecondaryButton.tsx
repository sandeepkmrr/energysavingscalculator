import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SecondaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function SecondaryButton({
  className,
  children,
  ...props
}: SecondaryButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        'border-2 border-cta text-cta bg-white hover:bg-cta/5 rounded-pill',
        'px-6 py-2.5 font-medium transition-all',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
