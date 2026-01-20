import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, StopCircle, Milk } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useBaby } from '../../hooks/useBaby';
import { useNotifications } from '../../hooks/useNotifications';
import * as recordsService from '../../services/recordsService';
import { formatSeconds } from '../../utils/dateHelpers';
import { validateMilkVolume, validateFeedingDuration } from '../../utils/validators';

const FeedingForm = ({ onComplete }) => {
  const { t } = useTranslation();
  const { currentBaby, refreshStats } = useBaby();
  const { showSuccess, showError } = useNotifications();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    feedingType: 'breast',
    breastSide: 'left',
    duration: '',
    volume: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setIsTimerRunning(true);
    intervalRef.current = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const stopTimer = () => {
    pauseTimer();
    const minutes = Math.floor(timerSeconds / 60);
    setFormData(prev => ({ ...prev, duration: minutes.toString() }));
    setTimerSeconds(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.feedingType === 'bottle' || formData.feedingType === 'both') {
      const volumeValidation = validateMilkVolume(formData.volume);
      if (!volumeValidation.isValid) {
        newErrors.volume = volumeValidation.error;
      }
    }

    if (formData.feedingType === 'breast' || formData.feedingType === 'both') {
      if (formData.duration) {
        const durationValidation = validateFeedingDuration(formData.duration);
        if (!durationValidation.isValid) {
          newErrors.duration = durationValidation.error;
        }
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

      const feedingData = {
        feedingType: formData.feedingType,
        timestamp: new Date(),
        notes: formData.notes || undefined
      };

      if (formData.feedingType === 'breast' || formData.feedingType === 'both') {
        feedingData.breastSide = formData.breastSide;
        if (formData.duration) {
          feedingData.duration = Number(formData.duration);
        }
      }

      if (formData.feedingType === 'bottle' || formData.feedingType === 'both') {
        feedingData.volume = Number(formData.volume);
      }

      await recordsService.createFeeding(currentBaby._id, feedingData);

      showSuccess(t('feeding.addSuccess') || 'Feeding recorded successfully');
      refreshStats();
      onComplete();
    } catch (error) {
      showError(error.message || t('feeding.addError') || 'Failed to record feeding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Feeding Type */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t('feeding.type') || 'Feeding Type'} <span className="text-danger-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['breast', 'bottle', 'both'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, feedingType: type }))}
              className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                formData.feedingType === type
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {t(`feeding.${type}`) || type}
            </button>
          ))}
        </div>
      </div>

      {/* Breast Side (if breast feeding) */}
      {(formData.feedingType === 'breast' || formData.feedingType === 'both') && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t('feeding.breastSide') || 'Breast Side'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['left', 'right'].map((side) => (
              <button
                key={side}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, breastSide: side }))}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                  formData.breastSide === side
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {t(`feeding.${side}`) || side}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timer (if breast feeding) */}
      {(formData.feedingType === 'breast' || formData.feedingType === 'both') && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t('feeding.timer') || 'Timer'}
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1 p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-3xl font-mono font-bold text-gray-900">
                {formatSeconds(timerSeconds)}
              </p>
            </div>
            <div className="flex gap-2">
              {!isTimerRunning ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon={Play}
                  onClick={startTimer}
                >
                  {t('feeding.start') || 'Start'}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={Pause}
                  onClick={pauseTimer}
                >
                  {t('feeding.pause') || 'Pause'}
                </Button>
              )}
              {timerSeconds > 0 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  icon={StopCircle}
                  onClick={stopTimer}
                >
                  {t('feeding.stop') || 'Stop'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Duration (manual input) */}
      {(formData.feedingType === 'breast' || formData.feedingType === 'both') && (
        <Input
          label={t('feeding.duration') || 'Duration (minutes)'}
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="15"
          error={errors.duration}
          min="0"
          max="120"
          helperText={t('feeding.durationHint') || 'Or use timer above'}
        />
      )}

      {/* Volume (if bottle feeding) */}
      {(formData.feedingType === 'bottle' || formData.feedingType === 'both') && (
        <Input
          label={t('feeding.volume') || 'Volume (ml)'}
          type="number"
          name="volume"
          value={formData.volume}
          onChange={handleChange}
          placeholder="90"
          icon={Milk}
          error={errors.volume}
          required
          min="0"
          max="300"
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
          placeholder={t('feeding.notesPlaceholder') || 'Any observations...'}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {t('feeding.save') || 'Save Feeding'}
      </Button>
    </form>
  );
};

export default FeedingForm;
