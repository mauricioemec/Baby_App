import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Input from '../common/Input';
import { useBaby } from '../../hooks/useBaby';
import { useNotifications } from '../../hooks/useNotifications';
import * as medicationService from '../../services/medicationService';

const MedicationForm = ({ onComplete }) => {
  const { t } = useTranslation();
  const { currentBaby } = useBaby();
  const { showSuccess, showError } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    unit: 'ml',
    frequency: '',
    schedule: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const medicationData = {
        ...formData,
        dose: Number(formData.dose),
        schedule: formData.schedule ? formData.schedule.split(',').map(t => t.trim()) : []
      };

      await medicationService.createMedication(currentBaby._id, medicationData);
      showSuccess(t('health.medicationAdded') || 'Medication added successfully');
      onComplete();
    } catch (error) {
      showError(error.message || t('health.medicationError') || 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('health.medicationName') || 'Medication Name'}
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('health.dose') || 'Dose'}
          type="number"
          name="dose"
          value={formData.dose}
          onChange={handleChange}
          required
          step="0.1"
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t('health.unit') || 'Unit'}
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200"
          >
            <option value="ml">ml</option>
            <option value="mg">mg</option>
            <option value="drops">Drops</option>
          </select>
        </div>
      </div>

      <Input
        label={t('health.frequency') || 'Frequency'}
        type="text"
        name="frequency"
        value={formData.frequency}
        onChange={handleChange}
        placeholder="Every 8 hours"
        required
      />

      <Input
        label={t('health.schedule') || 'Schedule (comma-separated times)'}
        type="text"
        name="schedule"
        value={formData.schedule}
        onChange={handleChange}
        placeholder="08:00, 16:00, 00:00"
      />

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t('common.notes') || 'Notes'}
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {t('common.save') || 'Save'}
      </Button>
    </form>
  );
};

export default MedicationForm;
