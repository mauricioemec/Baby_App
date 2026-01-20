import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Thermometer } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useBaby } from '../../hooks/useBaby';
import { useNotifications } from '../../hooks/useNotifications';
import * as symptomService from '../../services/symptomService';

const SymptomTracker = () => {
  const { t } = useTranslation();
  const { currentBaby } = useBaby();
  const { showSuccess, showError } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'fever',
    severity: 'mild',
    temperature: '',
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
      const symptomData = {
        ...formData,
        temperature: formData.temperature ? Number(formData.temperature) : undefined,
        timestamp: new Date()
      };

      await symptomService.createSymptom(currentBaby._id, symptomData);
      showSuccess(t('health.symptomAdded') || 'Symptom recorded successfully');
      setFormData({ type: 'fever', severity: 'mild', temperature: '', notes: '' });
    } catch (error) {
      showError(error.message || t('health.symptomError') || 'Failed to record symptom');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={t('health.symptoms') || 'Symptom Tracker'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t('health.symptomType') || 'Symptom Type'}
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg"
          >
            <option value="fever">Fever</option>
            <option value="cough">Cough</option>
            <option value="rash">Rash</option>
            <option value="vomiting">Vomiting</option>
            <option value="diarrhea">Diarrhea</option>
            <option value="other">Other</option>
          </select>
        </div>

        {formData.type === 'fever' && (
          <Input
            label={t('health.temperature') || 'Temperature (°C)'}
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            icon={Thermometer}
            step="0.1"
            placeholder="37.5"
          />
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t('health.severity') || 'Severity'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['mild', 'moderate', 'severe'].map((severity) => (
              <button
                key={severity}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, severity }))}
                className={`p-3 text-sm rounded-lg border-2 ${
                  formData.severity === severity
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200'
                }`}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t('common.notes') || 'Notes'}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg"
          />
        </div>

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          {t('common.save') || 'Save Symptom'}
        </Button>
      </form>
    </Card>
  );
};

export default SymptomTracker;
