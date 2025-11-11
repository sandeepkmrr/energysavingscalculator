'use client';

import { useId, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import { formatCompactValue, formatValueWithUnit } from './chartUtils';

export interface LifecycleAreaDatum {
  year: number;
  energy: number;
  maintenance: number;
  capex: number;
}

export interface LifecycleAreaChartProps {
  baselineData: LifecycleAreaDatum[];
  invData: LifecycleAreaDatum[];
  unit: string;
  className?: string;
}

interface LifecycleTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number | string;
  unit: string;
}

type LifecycleStackKey = Exclude<keyof LifecycleAreaDatum, 'year'>;

const STACK_ORDER: LifecycleStackKey[] = ['energy', 'maintenance', 'capex'];

const STACK_COLORS: Record<
  LifecycleStackKey,
  { stroke: string; fill: string; label: string }
> = {
  energy: {
    stroke: '#007AC2',
    fill: 'rgba(0, 122, 194, 0.25)',
    label: 'Energy',
  },
  maintenance: {
    stroke: '#60A5FA',
    fill: 'rgba(96, 165, 250, 0.35)',
    label: 'Maintenance',
  },
  capex: {
    stroke: '#93C5FD',
    fill: 'rgba(147, 197, 253, 0.45)',
    label: 'CapEx',
  },
};

const LifecycleTooltip = ({
  active,
  payload,
  label,
  unit,
}: LifecycleTooltipProps) => {
  if (!active || !payload || payload.length === 0 || label === undefined) {
    return null;
  }

  const dataPoint = payload[0]?.payload as LifecycleAreaDatum | undefined;

  if (!dataPoint) {
    return null;
  }

  const total = dataPoint.energy + dataPoint.maintenance + dataPoint.capex;

  return (
    <div className="rounded-md border border-daikin-gray-200 bg-white px-3 py-2 text-sm text-daikin-gray-700 shadow-lg">
      <p className="text-xs font-semibold text-primary">
        Year {label} — Total {formatValueWithUnit(total, unit)}
      </p>
      <dl className="mt-2 space-y-1 text-xs">
        {STACK_ORDER.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: STACK_COLORS[key].stroke }}
              aria-hidden="true"
            />
            <dt className="text-daikin-gray-500">{STACK_COLORS[key].label}:</dt>
            <dd className="font-medium text-daikin-gray-700">
              {formatValueWithUnit(dataPoint[key], unit)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

interface PanelProps {
  data: LifecycleAreaDatum[];
  label: string;
  unit: string;
  chartId: string;
}

function LifecyclePanel({ data, label, unit, chartId }: PanelProps) {
  return (
    <div
      className="flex h-full flex-col gap-2 rounded-lg border border-daikin-gray-100 bg-daikin-gray-50/40 p-4"
      role="img"
      aria-label={`${label} lifecycle cost composition over ${data.length} years`}
    >
      <h3 className="text-sm font-semibold text-primary">{label}</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => formatCompactValue(value)}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip
              content={<LifecycleTooltip unit={unit} />}
              wrapperStyle={{ outline: 'none' }}
            />
            {STACK_ORDER.map((key) => (
              <Area
                key={`${chartId}-${key}`}
                type="monotone"
                dataKey={key}
                stackId="total"
                stroke={STACK_COLORS[key].stroke}
                fill={STACK_COLORS[key].fill}
                strokeWidth={2}
                animationDuration={400}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LifecycleAreaChart({
  baselineData,
  invData,
  unit,
  className,
}: LifecycleAreaChartProps) {
  const chartId = useId();

  const normalizedBaseline = useMemo(
    () => baselineData.map((entry) => ({ ...entry })),
    [baselineData]
  );
  const normalizedInv = useMemo(
    () => invData.map((entry) => ({ ...entry })),
    [invData]
  );

  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}>
      <LifecyclePanel
        data={normalizedBaseline}
        label="Baseline System"
        unit={unit}
        chartId={`${chartId}-baseline`}
      />
      <LifecyclePanel
        data={normalizedInv}
        label="Daikin INV"
        unit={unit}
        chartId={`${chartId}-inv`}
      />
    </div>
  );
}
