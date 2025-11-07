import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface ChartShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function ChartShell({
  title,
  description,
  children,
  className,
  height = '400px',
}: ChartShellProps) {
  return (
    <Card
      title={title}
      description={description}
      className={cn('w-full', className)}
    >
      <div
        className="flex items-center justify-center bg-daikin-gray-50 rounded-lg border-2 border-dashed border-daikin-gray-100"
        style={{ minHeight: height }}
      >
        {children || (
          <div className="text-center p-8">
            <p className="text-daikin-gray-500 text-sm">
              Chart placeholder - Replace with your charting library
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
