import { WizardLayout } from '@/components/wizard/WizardLayout';
import { ProjectInfo } from '@/components/wizard/ProjectInfo';

export default function WizardProjectPage() {
  return (
    <WizardLayout currentStep={1}>
      <ProjectInfo />
    </WizardLayout>
  );
}
