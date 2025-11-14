import { Suspense } from 'react';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { ProjectInfo } from '@/components/wizard/ProjectInfo';

function ProjectInfoLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-sm text-daikin-gray-600">
          Loading project information...
        </p>
      </div>
    </div>
  );
}

export default function WizardProjectPage() {
  return (
    <WizardLayout currentStep={1}>
      <Suspense fallback={<ProjectInfoLoader />}>
        <ProjectInfo />
      </Suspense>
    </WizardLayout>
  );
}
