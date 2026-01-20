import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useBaby } from '../../hooks/useBaby';
import { useNotifications } from '../../hooks/useNotifications';
import * as recordsService from '../../services/recordsService';
import { validateUrineVolume } from '../../utils/validators';

const DiaperForm = ({ onComplete }) => {
  const { t } = useTranslation();
  const { currentBaby, refreshStats } = useBaby();
  const { showSuccess, showError } = useNotifications();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'wet',
    urineVolume: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if ((formData.type === 'wet' || formData.type === 'both') && formData.urineVolume) {
      const volumeValidation = validateUrineVolume(formData.urineVolume);
      if (!volumeValidation.isValid) {
        newErrors.urineVolume = volumeValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const diaperData = {
        type: formData.type,
        timestamp: new Date(),
        notes: formData.notes || undefined
      };

      if ((formData.type === 'wet' || formData.type === 'both') && formData.urineVolume) {
        diaperData.urineVolume = Number(formData.urineVolume);
      }

      await recordsService.createDiaper(currentBaby._id, diaperData);

      showSuccess(t('diaper.addSuccess') || 'Diaper change recorded successfully');
      refreshStats();
      onComplete();
    } catch (error) {
      showError(error.message || t('diaper.addError') || 'Failed to record diaper change');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Diaper Type */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t('diaper.type') || 'Diaper Type'} <span className="text-danger-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['wet', 'dirty', 'both'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type }))}
              className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                formData.type === type
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {t(`diaper.${type}`) || type}
            </button>
          ))}
        </div>
      </div>

      {/* Urine Volume (if wet) */}
      {(formData.type === 'wet' || formData.type === 'both') && (
        <Input
          label={t('diaper.urineVolume') || 'Urine Volume (ml) - Optional'}
          type="number"
          name="urineVolume"
          value={formData.urineVolume}
          onChange={handleChange}
          placeholder="30"
          icon={Droplets}
          error={errors.urineVolume}
          min="0"
          max="500"
          helperText={t('diaper.urineVolumeHint') || 'Estimated volume if known'}
        />
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-700">
          {t('common.notes') || 'Notes'}
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="block w-full px-4 py-2.5 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
          placeholder={t('diaper.notesPlaceholder') || 'Color, consistency, etc...'}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {t('diaper.save') || 'Save Diaper Change'}
      </Button>
    </form>
  );
};

export default DiaperForm;
