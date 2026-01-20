import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useBaby } from '../../hooks/useBaby';
import { useNotifications } from '../../hooks/useNotifications';

const ConstantsEditor = () => {
  const { t } = useTranslation();
  const { currentBaby, updateBaby } = useBaby();
  const { showSuccess, showError } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [constants, setConstants] = useState({
    mlPerKgPerDay: 150,
    minBreastfeedingDurationMin: 7,
    urineOutputMlPerKgPerDay: 80,
    containerTareGrams: 8
  });

  useEffect(() => {
    if (currentBaby?.constants) {
      setConstants(prev => ({ ...prev, ...currentBaby.constants }));
    }
  }, [currentBaby]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConstants(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateBaby(currentBaby._id, { constants });
      showSuccess(t('settings.constantsSaved') || 'Constants updated successfully');
    } catch (error) {
      showError(error.message || t('settings.constantsError') || 'Failed to update constants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={t('settings.constants') || 'Calculation Constants'}>
      <div className="space-y-4">
        <Input
          label={t('settings.mlPerKgPerDay') || 'Milk per kg per day (ml)'}
          type="number"
          name="mlPerKgPerDay"
          value={constants.mlPerKgPerDay}
          onChange={handleChange}
          min="100"
          max="200"
        />

        <Input
          label={t('settings.minBreastfeedingDuration') || 'Min breastfeeding duration (min)'}
          type="number"
          name="minBreastfeedingDurationMin"
          value={constants.minBreastfeedingDurationMin}
          onChange={handleChange}
          min="1"
          max="30"
        />

        <Input
          label={t('settings.urineOutputPerKg') || 'Urine output per kg per day (ml)'}
          type="number"
          name="urineOutputMlPerKgPerDay"
          value={constants.urineOutputMlPerKgPerDay}
          onChange={handleChange}
          min="50"
          max="150"
        />

        <Input
          label={t('settings.containerTare') || 'Container tare (g)'}
          type="number"
          name="containerTareGrams"
          value={constants.containerTareGrams}
          onChange={handleChange}
          min="0"
          max="50"
        />

        <Button
          variant="primary"
          fullWidth
          icon={Save}
          onClick={handleSave}
          loading={loading}
        >
          {t('common.save') || 'Save'}
        </Button>
      </div>
    </Card>
  );
};

export default ConstantsEditor;
