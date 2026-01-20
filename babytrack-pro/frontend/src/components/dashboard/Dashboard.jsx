import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBaby } from '../../hooks/useBaby';
import DailyStatusCard from './DailyStatusCard';
import QuickActionsGrid from './QuickActionsGrid';
import TodayMedicationsCard from './TodayMedicationsCard';
import Loader from '../common/Loader';
import { formatAge } from '../../utils/dateHelpers';

const Dashboard = () => {
  const { t } = useTranslation();
  const { currentBaby, stats, refreshStats, loading } = useBaby();

  useEffect(() => {
    if (currentBaby) {
      refreshStats('today');
    }
  }, [currentBaby]);

  const handleActionComplete = () => {
    refreshStats('today');
  };

  if (loading) {
    return <Loader fullScreen text={t('common.loading') || 'Loading...'} />;
  }

  if (!currentBaby) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            {t('dashboard.noBaby') || 'No baby profile found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6">
        <h1 className="text-2xl font-bold">{currentBaby.name}</h1>
        <p className="mt-1 text-primary-100">
          {formatAge(currentBaby.birthDate)}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto p-4 space-y-4">
        <DailyStatusCard stats={stats} />
        <QuickActionsGrid onActionComplete={handleActionComplete} />
        <TodayMedicationsCard />
      </div>
    </div>
  );
};

export default Dashboard;
