import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Milk, Baby as BabyIcon, TrendingUp, Pill } from 'lucide-react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import FeedingForm from '../records/FeedingForm';
import DiaperForm from '../records/DiaperForm';
import GrowthForm from '../records/GrowthForm';

const QuickActionsGrid = ({ onActionComplete }) => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState(null);

  const handleComplete = () => {
    setActiveModal(null);
    if (onActionComplete) onActionComplete();
  };

  const actions = [
    {
      id: 'feeding',
      icon: Milk,
      label: t('actions.feeding') || 'Feeding',
      color: 'bg-blue-500',
      modalTitle: t('actions.addFeeding') || 'Add Feeding'
    },
    {
      id: 'diaper',
      icon: BabyIcon,
      label: t('actions.diaper') || 'Diaper',
      color: 'bg-green-500',
      modalTitle: t('actions.addDiaper') || 'Add Diaper Change'
    },
    {
      id: 'growth',
      icon: TrendingUp,
      label: t('actions.growth') || 'Growth',
      color: 'bg-purple-500',
      modalTitle: t('actions.addGrowth') || 'Add Growth Record'
    },
    {
      id: 'medication',
      icon: Pill,
      label: t('actions.medication') || 'Medication',
      color: 'bg-red-500',
      modalTitle: t('actions.addMedication') || 'Log Medication'
    }
  ];

  return (
    <>
      <Card title={t('dashboard.quickActions') || 'Quick Actions'}>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setActiveModal(action.id)}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors min-h-touch"
              >
                <div className={`flex items-center justify-center w-12 h-12 ${action.color} rounded-full mb-2`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'feeding'}
        onClose={() => setActiveModal(null)}
        title={t('actions.addFeeding') || 'Add Feeding'}
      >
        <FeedingForm onComplete={handleComplete} />
      </Modal>

      <Modal
        isOpen={activeModal === 'diaper'}
        onClose={() => setActiveModal(null)}
        title={t('actions.addDiaper') || 'Add Diaper Change'}
      >
        <DiaperForm onComplete={handleComplete} />
      </Modal>

      <Modal
        isOpen={activeModal === 'growth'}
        onClose={() => setActiveModal(null)}
        title={t('actions.addGrowth') || 'Add Growth Record'}
      >
        <GrowthForm onComplete={handleComplete} />
      </Modal>
    </>
  );
};

export default QuickActionsGrid;
