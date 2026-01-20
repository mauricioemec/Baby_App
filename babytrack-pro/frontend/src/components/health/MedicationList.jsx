import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pill, Plus } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import MedicationForm from './MedicationForm';
import { useBaby } from '../../hooks/useBaby';
import * as medicationService from '../../services/medicationService';

const MedicationList = () => {
  const { t } = useTranslation();
  const { currentBaby } = useBaby();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (currentBaby) {
      loadMedications();
    }
  }, [currentBaby]);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await medicationService.getMedications(currentBaby._id);
      setMedications(data.medications || []);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    setShowForm(false);
    loadMedications();
  };

  if (loading) {
    return <Card title={t('health.medications') || 'Medications'}><p className="text-sm text-gray-500">{t('common.loading') || 'Loading...'}</p></Card>;
  }

  return (
    <>
      <Card
        title={t('health.medications') || 'Medications'}
        headerAction={
          <Button size="sm" icon={Plus} onClick={() => setShowForm(true)}>
            {t('common.add') || 'Add'}
          </Button>
        }
      >
        {medications.length === 0 ? (
          <div className="text-center py-6">
            <Pill className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              {t('health.noMedications') || 'No medications added'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med._id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{med.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {med.dose} {med.unit} - {med.frequency}
                </p>
                {med.schedule && (
                  <p className="text-xs text-gray-500 mt-1">
                    {med.schedule.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={t('health.addMedication') || 'Add Medication'}
      >
        <MedicationForm onComplete={handleComplete} />
      </Modal>
    </>
  );
};

export default MedicationList;
