import { useTranslation } from 'react-i18next';
import MedicationList from '../components/health/MedicationList';
import SymptomTracker from '../components/health/SymptomTracker';
import BottomNav from '../components/common/BottomNav';

const HealthPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-primary-600 text-white p-6">
          <h1 className="text-2xl font-bold">{t('health.title') || 'Health'}</h1>
        </div>

        <div className="max-w-screen-xl mx-auto p-4 space-y-4">
          <MedicationList />
          <SymptomTracker />
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default HealthPage;
