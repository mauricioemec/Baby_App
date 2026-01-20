import { useTranslation } from 'react-i18next';
import { Milk, Droplets } from 'lucide-react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import { useCalculations } from '../../hooks/useCalculations';
import { formatVolume } from '../../utils/formatters';

const DailyStatusCard = ({ stats }) => {
  const { t } = useTranslation();
  const { expectedMilkVolume, urineThreshold } = useCalculations();

  const milkPercentage = stats?.totalMilk && expectedMilkVolume
    ? (stats.totalMilk / expectedMilkVolume) * 100
    : 0;

  const urinePercentage = stats?.totalUrine && urineThreshold
    ? (stats.totalUrine / urineThreshold) * 100
    : 0;

  const getMilkColor = () => {
    if (milkPercentage >= 90) return 'success';
    if (milkPercentage >= 70) return 'warning';
    return 'danger';
  };

  const getUrineColor = () => {
    if (urinePercentage >= 90) return 'success';
    if (urinePercentage >= 70) return 'warning';
    return 'danger';
  };

  return (
    <Card title={t('dashboard.dailyStatus') || 'Daily Status'}>
      <div className="space-y-6">
        {/* Milk Intake */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Milk className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">
                {t('dashboard.milkIntake') || 'Milk Intake'}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatVolume(stats?.totalMilk || 0)} / {formatVolume(expectedMilkVolume)}
            </span>
          </div>
          <ProgressBar
            value={stats?.totalMilk || 0}
            max={expectedMilkVolume}
            color={getMilkColor()}
            showLabel
          />
          <p className="mt-1 text-xs text-gray-500">
            {stats?.feedingCount || 0} {t('dashboard.feedings') || 'feedings today'}
          </p>
        </div>

        {/* Urine Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">
                {t('dashboard.urineOutput') || 'Urine Output'}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatVolume(stats?.totalUrine || 0)} / {formatVolume(urineThreshold)}
            </span>
          </div>
          <ProgressBar
            value={stats?.totalUrine || 0}
            max={urineThreshold}
            color={getUrineColor()}
            showLabel
          />
          <p className="mt-1 text-xs text-gray-500">
            {stats?.wetDiaperCount || 0} {t('dashboard.wetDiapers') || 'wet diapers today'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DailyStatusCard;
