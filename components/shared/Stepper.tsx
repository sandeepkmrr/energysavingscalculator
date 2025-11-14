'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <nav
      className={cn('w-full overflow-x-auto scrollbar-hide', className)}
      aria-label="Progress"
    >
      <ol
        className="flex w-full min-w-max md:min-w-0 items-center px-2"
        role="list"
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          const handleClick = () => {
            if (isClickable && onStepClick) {
              onStepClick(stepNumber);
            }
          };

          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onStepClick?.(stepNumber);
            }
          };

          return (
            <li key={step} className="flex-1 flex items-center min-w-[100px]">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-center flex-1 gap-2">
                  {/* Circle Indicator */}
                  <div
                    className={cn(
                      'relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200',
                      isCompleted && 'bg-primary text-white',
                      isCurrent &&
                        'bg-white text-primary border-2 border-primary',
                      !isCompleted &&
                        !isCurrent &&
                        'bg-white text-daikin-gray-300 border-2 border-daikin-gray-300',
                      isClickable && 'cursor-pointer hover:scale-105'
                    )}
                    onClick={isClickable ? handleClick : undefined}
                    onKeyDown={isClickable ? handleKeyDown : undefined}
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`${step}${isCompleted ? ' (completed)' : ''}${
                      isCurrent ? ' (current)' : ''
                    }`}
                  >
                    {isCompleted ? (
                      <Check
                        className="w-5 h-5"
                        aria-hidden="true"
                        strokeWidth={3}
                      />
                    ) : (
                      <span className="text-sm font-semibold">
                        {stepNumber}
                      </span>
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={cn(
                      'text-xs font-medium text-center max-w-[110px] leading-tight transition-colors',
                      isCurrent && 'text-primary font-semibold',
                      isCompleted && 'text-primary',
                      !isCurrent && !isCompleted && 'text-daikin-gray-500'
                    )}
                  >
                    {step}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-[2px] mx-3 md:mx-4 transition-colors duration-300 min-w-[40px]',
                      isCompleted ? 'bg-primary' : 'bg-daikin-gray-200'
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
