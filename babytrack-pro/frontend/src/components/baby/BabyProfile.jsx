import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Baby, Calendar, Weight, Ruler, Edit2, Save, X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import { useBaby } from '../../hooks/useBaby';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDate, formatAge } from '../../utils/dateHelpers';
import { formatWeight, formatHeight } from '../../utils/formatters';
import {
  validateName,
  validateBirthDate,
  validateWeight,
  validateHeight
} from '../../utils/validators';

const BabyProfile = () => {
  const { t } = useTranslation();
  const { currentBaby, updateBaby } = useBaby();
  const { showSuccess, showError } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    sex: 'M',
    weight: '',
    height: '',
    headCircumference: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentBaby) {
      setFormData({
        name: currentBaby.name || '',
        birthDate: currentBaby.birthDate?.split('T')[0] || '',
        sex: currentBaby.sex || 'M',
        weight: currentBaby.weight || '',
        height: currentBaby.height || '',
        headCircumference: currentBaby.headCircumference || ''
      });
    }
  }, [currentBaby]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }

    const birthDateValidation = validateBirthDate(formData.birthDate);
    if (!birthDateValidation.isValid) {
      newErrors.birthDate = birthDateValidation.error;
    }

    const weightValidation = validateWeight(formData.weight);
    if (!weightValidation.isValid) {
      newErrors.weight = weightValidation.error;
    }

    const heightValidation = validateHeight(formData.height);
    if (!heightValidation.isValid) {
      newErrors.height = heightValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await updateBaby(currentBaby._id, {
        ...formData,
        weight: Number(formData.weight),
        height: Number(formData.height),
        headCircumference: formData.headCircumference ? Number(formData.headCircumference) : undefined
      });

      showSuccess(t('baby.updateSuccess') || 'Baby profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      showError(error.message || t('baby.updateError') || 'Failed to update baby profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentBaby) {
      setFormData({
        name: currentBaby.name || '',
        birthDate: currentBaby.birthDate?.split('T')[0] || '',
        sex: currentBaby.sex || 'M',
        weight: currentBaby.weight || '',
        height: currentBaby.height || '',
        headCircumference: currentBaby.headCircumference || ''
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (!currentBaby) {
    return (
      <Card>
        <p className="text-center text-gray-500">
          {t('baby.noBaby') || 'No baby selected'}
        </p>
      </Card>
    );
  }

  return (
    <Card
      title={isEditing ? (t('baby.editProfile') || 'Edit Profile') : (t('baby.profile') || 'Baby Profile')}
      headerAction={
        !isEditing && (
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={() => setIsEditing(true)}
          >
            {t('common.edit') || 'Edit'}
          </Button>
        )
      }
    >
      {isEditing ? (
        <div className="space-y-4">
          <Input
            label={t('baby.name') || 'Baby Name'}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
              {t('baby.sex') || 'Sex'}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center flex-1 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input
                  type="radio"
                  name="sex"
                  value="M"
                  checked={formData.sex === 'M'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="ml-2 text-sm">{t('baby.male') || 'Male'}</span>
              </label>
              <label className="flex items-center flex-1 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input
                  type="radio"
                  name="sex"
                  value="F"
                  checked={formData.sex === 'F'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="ml-2 text-sm">{t('baby.female') || 'Female'}</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('baby.weight') || 'Weight (g)'}
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              icon={Weight}
              error={errors.weight}
              required
              min="500"
              max="10000"
            />

            <Input
              label={t('baby.height') || 'Height (cm)'}
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              icon={Ruler}
              error={errors.height}
              required
              min="30"
              max="100"
            />
          </div>

          <Input
            label={t('baby.headCircumference') || 'Head Circumference (cm)'}
            type="number"
            name="headCircumference"
            value={formData.headCircumference}
            onChange={handleChange}
            min="25"
            max="60"
          />

          <div className="flex gap-3">
            <Button
              variant="primary"
              icon={Save}
              onClick={handleSave}
              loading={loading}
              fullWidth
            >
              {t('common.save') || 'Save'}
            </Button>
            <Button
              variant="outline"
              icon={X}
              onClick={handleCancel}
              disabled={loading}
              fullWidth
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t('baby.name') || 'Name'}</p>
              <p className="mt-1 text-base font-medium text-gray-900">{currentBaby.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t('baby.age') || 'Age'}</p>
              <p className="mt-1 text-base font-medium text-gray-900">
                {formatAge(currentBaby.birthDate)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t('baby.birthDate') || 'Birth Date'}</p>
              <p className="mt-1 text-base font-medium text-gray-900">
                {formatDate(currentBaby.birthDate)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t('baby.sex') || 'Sex'}</p>
              <p className="mt-1 text-base font-medium text-gray-900">
                {currentBaby.sex === 'M' ? (t('baby.male') || 'Male') : (t('baby.female') || 'Female')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t('baby.weight') || 'Birth Weight'}</p>
              <p className="mt-1 text-base font-medium text-gray-900">
                {formatWeight(currentBaby.weight)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t('baby.height') || 'Birth Height'}</p>
              <p className="mt-1 text-base font-medium text-gray-900">
                {formatHeight(currentBaby.height)}
              </p>
            </div>

            {currentBaby.headCircumference && (
              <div>
                <p className="text-sm text-gray-500">{t('baby.headCircumference') || 'Head Circumference'}</p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {formatHeight(currentBaby.headCircumference)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default BabyProfile;
