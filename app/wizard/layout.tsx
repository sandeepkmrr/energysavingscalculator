'use client';

import { type ReactNode } from 'react';
import { WizardProvider } from '@/contexts/WizardContext';

export default function WizardLayout({ children }: { children: ReactNode }) {
  return <WizardProvider>{children}</WizardProvider>;
}
