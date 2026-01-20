import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Baby, Calendar, Weight, Ruler } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import {
  validateName,
  validateBirthDate,
  validateWeight,
  validateHeight
} from '../../utils/validators';

const BabySetup = ({ onComplete, loading = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    sex: 'M',
    weight: '',
    height: '',
    headCircumference: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }

    // Validate birth date
    const birthDateValidation = validateBirthDate(formData.birthDate);
    if (!birthDateValidation.isValid) {
      newErrors.birthDate = birthDateValidation.error;
    }

    // Validate weight
    const weightValidation = validateWeight(formData.weight);
    if (!weightValidation.isValid) {
      newErrors.weight = weightValidation.error;
    }

    // Validate height
    const heightValidation = validateHeight(formData.height);
    if (!heightValidation.isValid) {
      newErrors.height = heightValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onComplete({
        ...formData,
        weight: Number(formData.weight),
        height: Number(formData.height),
        headCircumference: formData.headCircumference ? Number(formData.headCircumference) : undefined
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="mb-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Baby className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('baby.setupTitle') || 'Baby Information'}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('baby.setupSubtitle') || 'Enter the baby\'s basic information to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('baby.name') || 'Baby Name'}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('baby.namePlaceholder') || 'Enter baby name'}
            icon={Baby}
            error={errors.name}
            required
          />

          <Input
            label={t('baby.birthDate') || 'Birth Date'}
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            icon={Calendar}
            error={errors.birthDate}
            required
            max={new Date().toISOString().split('T')[0]}
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t('baby.sex') || 'Sex'} <span className="text-danger-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center flex-1 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input
                  type="radio"
                  name="sex"
                  value="M"
                  checked={formData.sex === 'M'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {t('baby.male') || 'Male'}
                </span>
              </label>

              <label className="flex items-center flex-1 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input
                  type="radio"
                  name="sex"
                  value="F"
                  checked={formData.sex === 'F'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {t('baby.female') || 'Female'}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('baby.weight') || 'Birth Weight (g)'}
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

            <Input
              label={t('baby.height') || 'Birth Height (cm)'}
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
          </div>

          <Input
            label={t('baby.headCircumference') || 'Head Circumference (cm) - Optional'}
            type="number"
            name="headCircumference"
            value={formData.headCircumference}
            onChange={handleChange}
            placeholder="35"
            min="25"
            max="60"
            step="0.1"
            helperText={t('baby.headCircumferenceHint') || 'Optional, can be added later'}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            {t('baby.setupComplete') || 'Complete Setup'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BabySetup;
