import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  note?: string;
  className?: string;
  valueClassName?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  note,
  className,
  valueClassName,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-card shadow-card p-6 flex flex-col gap-4 h-full border border-daikin-gray-100',
        className
      )}
      role="article"
      aria-labelledby={`metric-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex-shrink-0">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-daikin-gray-50 to-white border-2 border-daikin-gray-100 text-primary">
              <Icon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </div>
          </div>
        )}
        <h3
          id={`metric-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="flex-1 text-xs font-bold uppercase tracking-wide text-daikin-gray-500 leading-tight"
        >
          {title}
        </h3>
      </div>

      {/* Value */}
      <div className="flex-1 flex flex-col justify-center">
        <p
          className={cn(
            'text-3xl md:text-4xl font-bold leading-none text-primary',
            valueClassName
          )}
        >
          {value}
        </p>
        {subtitle && (
          <p className="mt-2 text-sm text-daikin-gray-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Note/Source */}
      {note && (
        <div className="pt-3 border-t border-daikin-gray-100">
          <p className="text-xs leading-relaxed text-daikin-gray-500">{note}</p>
        </div>
      )}
    </div>
  );
}

export interface MetricGridProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricGrid({ children, className }: MetricGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5',
        className
      )}
      role="group"
      aria-label="Key performance metrics"
    >
      {children}
    </div>
  );
}
