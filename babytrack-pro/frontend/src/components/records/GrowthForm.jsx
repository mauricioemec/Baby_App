import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Weight, Ruler, Calendar } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { useBaby } from '../../hooks/useBaby';
import { useCalculations } from '../../hooks/useCalculations';
import { useNotifications } from '../../hooks/useNotifications';
import * as recordsService from '../../services/recordsService';
import { formatPercentile, formatZScore } from '../../utils/formatters';
import {
  validateWeight,
  validateHeight,
  validateHeadCircumference
} from '../../utils/validators';

const GrowthForm = ({ onComplete }) => {
  const { t } = useTranslation();
  const { currentBaby, refreshBaby } = useBaby();
  const { getPercentile } = useCalculations();
  const { showSuccess, showError } = useNotifications();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    measurementDate: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCircumference: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [percentiles, setPercentiles] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    // Calculate percentiles in real-time
    if ((name === 'weight' || name === 'height' || name === 'headCircumference') && value) {
      calculatePercentiles({ ...formData, [name]: value });
    }
  };

  const calculatePercentiles = (data) => {
    const measurementDate = new Date(data.measurementDate);
    const results = {};

    if (data.weight) {
      results.weight = getPercentile('weight', Number(data.weight), measurementDate);
    }

    if (data.height) {
      results.height = getPercentile('height', Number(data.height), measurementDate);
    }

    if (data.headCircumference) {
      results.headCircumference = getPercentile(
        'headCircumference',
        Number(data.headCircumference),
        measurementDate
      );
    }

    setPercentiles(results);
  };

  const validate = () => {
    const newErrors = {};

    const weightValidation = validateWeight(formData.weight);
    if (!weightValidation.isValid) {
      newErrors.weight = weightValidation.error;
    }

    const heightValidation = validateHeight(formData.height);
    if (!heightValidation.isValid) {
      newErrors.height = heightValidation.error;
    }

    if (formData.headCircumference) {
      const hcValidation = validateHeadCircumference(formData.headCircumference);
      if (!hcValidation.isValid) {
        newErrors.headCircumference = hcValidation.error;
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

      const growthData = {
        measurementDate: new Date(formData.measurementDate),
        weight: Number(formData.weight),
        height: Number(formData.height),
        headCircumference: formData.headCircumference
          ? Number(formData.headCircumference)
          : undefined,
        notes: formData.notes || undefined
      };

      await recordsService.createGrowth(currentBaby._id, growthData);

      showSuccess(t('growth.addSuccess') || 'Growth record saved successfully');
      refreshBaby();
      onComplete();
    } catch (error) {
      showError(error.message || t('growth.addError') || 'Failed to save growth record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('growth.measurementDate') || 'Measurement Date'}
        type="date"
        name="measurementDate"
        value={formData.measurementDate}
        onChange={handleChange}
        icon={Calendar}
        required
        max={new Date().toISOString().split('T')[0]}
      />

      <Input
        label={t('growth.weight') || 'Weight (g)'}
        type="number"
        name="weight"
        value={formData.weight}
        onChange={handleChange}
        placeholder="3500"
        icon={Weight}
        error={errors.weight}
        required
        min="500"
        max="10000"
        step="1"
      />

      {percentiles?.weight && (
        <Alert
          type="info"
          message={`${t('growth.percentile') || 'Percentile'}: ${formatPercentile(percentiles.weight.percentile)} (${formatZScore(percentiles.weight.zscore)})`}
        />
      )}

      <Input
        label={t('growth.height') || 'Height (cm)'}
        type="number"
        name="height"
        value={formData.height}
        onChange={handleChange}
        placeholder="50"
        icon={Ruler}
        error={errors.height}
        required
        min="30"
        max="100"
        step="0.1"
      />

      {percentiles?.height && (
        <Alert
          type="info"
          message={`${t('growth.percentile') || 'Percentile'}: ${formatPercentile(percentiles.height.percentile)} (${formatZScore(percentiles.height.zscore)})`}
        />
      )}

      <Input
        label={t('growth.headCircumference') || 'Head Circumference (cm) - Optional'}
        type="number"
        name="headCircumference"
        value={formData.headCircumference}
        onChange={handleChange}
        placeholder="35"
        error={errors.headCircumference}
        min="25"
        max="60"
        step="0.1"
      />

      {percentiles?.headCircumference && (
        <Alert
          type="info"
          message={`${t('growth.percentile') || 'Percentile'}: ${formatPercentile(percentiles.headCircumference.percentile)} (${formatZScore(percentiles.headCircumference.zscore)})`}
        />
      )}

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
          placeholder={t('growth.notesPlaceholder') || 'Any observations...'}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {t('growth.save') || 'Save Growth Record'}
      </Button>
    </form>
  );
};

export default GrowthForm;
