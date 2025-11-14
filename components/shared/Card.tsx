import {
  Card as BaseCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function Card({
  className,
  title,
  description,
  footer,
  children,
  ...props
}: CardProps) {
  return (
    <BaseCard className={cn('shadow-card rounded-card', className)} {...props}>
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && (
            <CardTitle className="text-primary text-lg font-semibold">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-daikin-gray-500 text-sm">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="pt-0">{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </BaseCard>
  );
}
