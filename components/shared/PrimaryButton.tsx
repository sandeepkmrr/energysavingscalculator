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
      className={cn('bg-primary hover:bg-primary/90 text-white', className)}
      {...props}
    >
      {children}
    </Button>
  );
}
