import { WizardLayout } from '@/components/wizard/WizardLayout';
import { SystemSetup } from '@/components/wizard/SystemSetup';

export default function WizardSystemPage() {
  return (
    <WizardLayout currentStep={2}>
      <SystemSetup />
    </WizardLayout>
  );
}
