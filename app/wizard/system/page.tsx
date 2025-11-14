'use client';

import { Suspense } from 'react';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { ProjectInfo } from '@/components/wizard/ProjectInfo';
import { SystemSetup } from '@/components/wizard/SystemSetup';
import { ResultsDashboard } from '@/components/wizard/ResultsDashboard';
import { ProjectInfoLoader } from '@/components/wizard/ProjectInfoLoader';
import { useProjectData } from '@/hooks/useProjectData';

export default function WizardSystemPage() {
  const project = useProjectData();

  return (
    <WizardLayout
      currentStep={2}
      sections={[
        <Suspense fallback={<ProjectInfoLoader />} key="project">
          <ProjectInfo />
        </Suspense>,
        <div key="system" className="space-y-6">
          <SystemSetup />
        </div>,
        <div key="results" className="space-y-6">
          <ResultsDashboard project={project} results={project.results} />
        </div>,
      ]}
    />
  );
}
