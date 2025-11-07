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
    <Button variant="outline" className={cn('border-2', className)} {...props}>
      {children}
    </Button>
  );
}
