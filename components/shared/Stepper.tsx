'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav
      className={cn('flex items-center justify-between', className)}
      aria-label="Progress"
    >
      <ol className="flex w-full items-center" role="list">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li key={step} className="flex-1 flex items-center">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                      isCompleted && 'bg-primary border-primary text-white',
                      isCurrent && 'border-primary bg-white text-primary',
                      !isCompleted &&
                        !isCurrent &&
                        'border-daikin-gray-100 bg-white text-daikin-gray-500'
                    )}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <span className="text-sm font-medium">{stepNumber}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-sm font-medium text-center',
                      isCurrent && 'text-primary',
                      !isCurrent && 'text-daikin-gray-500'
                    )}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-2',
                      isCompleted ? 'bg-primary' : 'bg-daikin-gray-100'
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
