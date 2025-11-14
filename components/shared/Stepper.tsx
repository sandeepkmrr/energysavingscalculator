'use client';

import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

export interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
  contents?: ReactNode[];
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
  contents,
}: StepperProps) {
  const [openStates, setOpenStates] = useState<boolean[]>(() =>
    steps.map((_, index) => index + 1 === currentStep)
  );

  useEffect(() => {
    setOpenStates((prev) =>
      steps.map((_, index) =>
        index + 1 === currentStep ? true : prev[index] ?? false
      )
    );
  }, [currentStep, steps]);

  const handleAccordionToggle = (index: number, nextOpen: boolean) => {
    setOpenStates((prev) =>
      prev.map((isOpen, idx) => (idx === index ? nextOpen : isOpen))
    );
  };

  const getStatusText = (isCurrent: boolean, isCompleted: boolean) => {
    if (isCurrent) return 'Currently viewing';
    if (isCompleted) return 'Completed';
    return 'Upcoming';
  };

  const getDescription = (isCurrent: boolean, isCompleted: boolean) => {
    if (isCurrent) {
      return 'Work through the inputs below to complete this section.';
    }
    if (isCompleted) {
      return 'You can make edits at any time before finalizing results.';
    }
    return 'Preview the fields in this step so you can gather info in advance.';
  };

  return (
    <nav className={cn('w-full', className)} aria-label="Progress">
      <ol className="flex flex-col gap-4" role="list">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);
          const isOpen = openStates[index] ?? false;

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
          const statusText = getStatusText(isCurrent, isCompleted);
          const description = getDescription(isCurrent, isCompleted);
          const content = contents?.[index];

          return (
            <li key={step}>
              <details
                className="group border border-daikin-gray-100 rounded-lg bg-white shadow-sm open:shadow-md transition-shadow"
                open={isOpen}
                onToggle={(event) =>
                  handleAccordionToggle(index, event.currentTarget.open)
                }
              >
                <summary className="flex items-center gap-4 px-5 py-4 cursor-pointer list-none">
                  <div
                    className={cn(
                      'relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200',
                      isCompleted && 'bg-primary text-white',
                      isCurrent &&
                        'bg-white text-primary border-2 border-primary shadow-sm',
                      !isCompleted &&
                        !isCurrent &&
                        'bg-white text-daikin-gray-300 border-2 border-daikin-gray-200',
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

                  <div className="flex-1">
                    <p
                      className={cn(
                        'text-base font-semibold leading-tight',
                        isCurrent && 'text-primary',
                        isCompleted && 'text-daikin-gray-700',
                        !isCurrent && !isCompleted && 'text-daikin-gray-500'
                      )}
                    >
                      {step}
                    </p>
                    <p className="text-sm text-daikin-gray-500">{statusText}</p>
                  </div>

                  <ChevronDown
                    className="w-5 h-5 text-daikin-gray-400 transition-transform duration-200 group-open:-rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="px-5 pb-5 space-y-6">
                  {content ? (
                    content
                  ) : (
                    <>
                      <p className="text-sm text-daikin-gray-600 leading-relaxed">
                        {description}
                      </p>
                      {isClickable && (
                        <button
                          type="button"
                          onClick={handleClick}
                          className="text-sm text-primary font-semibold hover:underline transition-colors"
                        >
                          Go to this step
                        </button>
                      )}
                    </>
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
