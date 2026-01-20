import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pill, Clock, CheckCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useBaby } from '../../hooks/useBaby';
import { useNotifications } from '../../hooks/useNotifications';
import * as medicationService from '../../services/medicationService';
import { formatTime } from '../../utils/dateHelpers';
import { formatDosage } from '../../utils/formatters';

const TodayMedicationsCard = () => {
  const { t } = useTranslation();
  const { currentBaby, refreshStats } = useBaby();
  const { showSuccess, showError } = useNotifications();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentBaby) {
      loadTodayMedications();
    }
  }, [currentBaby]);

  const loadTodayMedications = async () => {
    try {
      setLoading(true);
      const data = await medicationService.getTodaySchedule(currentBaby._id);
      setMedications(data.medications || []);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogMedication = async (medication) => {
    try {
      await medicationService.createMedicationLog(
        currentBaby._id,
        medication._id,
        {
          timestamp: new Date(),
          dose: medication.dose,
          notes: 'Logged from dashboard'
        }
      );

      showSuccess(t('medication.logSuccess') || 'Medication logged successfully');
      loadTodayMedications();
      refreshStats();
    } catch (error) {
      showError(error.message || t('medication.logError') || 'Failed to log medication');
    }
  };

  if (loading) {
    return (
      <Card title={t('dashboard.todayMedications') || 'Today\'s Medications'}>
        <p className="text-sm text-gray-500">{t('common.loading') || 'Loading...'}</p>
      </Card>
    );
  }

  if (medications.length === 0) {
    return (
      <Card title={t('dashboard.todayMedications') || 'Today\'s Medications'}>
        <div className="text-center py-6">
          <Pill className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">
            {t('medication.noMedications') || 'No medications scheduled for today'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={t('dashboard.todayMedications') || 'Today\'s Medications'}>
      <div className="space-y-3">
        {medications.map((med) => (
          <div
            key={med._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900">{med.name}</h4>
                {med.lastGiven && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">
                  {med.schedule?.map(time => time).join(', ')}
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {formatDosage(med.dose, med.unit)}
              </p>
            </div>

            {!med.lastGiven && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleLogMedication(med)}
              >
                {t('medication.log') || 'Log'}
              </Button>
            )}

            {med.lastGiven && (
              <span className="text-xs text-gray-500">
                {formatTime(med.lastGiven)}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TodayMedicationsCard;
