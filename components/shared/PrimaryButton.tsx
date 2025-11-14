import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function PrimaryButton({
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      variant="default"
      className={cn(
        'bg-cta hover:bg-cta/90 text-white rounded-pill shadow-sm transition-all hover:shadow-md',
        'px-6 py-2.5 font-medium',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
