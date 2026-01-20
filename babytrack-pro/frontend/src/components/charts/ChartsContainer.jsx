import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBaby } from '../../hooks/useBaby';
import * as recordsService from '../../services/recordsService';
import WeightChart from './WeightChart';
import FeedingChart from './FeedingChart';
import Loader from '../common/Loader';

const ChartsContainer = () => {
  const { t } = useTranslation();
  const { currentBaby } = useBaby();
  const [activeTab, setActiveTab] = useState('weight');
  const [weightData, setWeightData] = useState([]);
  const [feedingData, setFeedingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentBaby) {
      loadChartData();
    }
  }, [currentBaby]);

  const loadChartData = async () => {
    try {
      setLoading(true);

      const [weightResponse, feedingResponse] = await Promise.all([
        recordsService.getGrowthChart(currentBaby._id, 'weight'),
        recordsService.getFeedingStats(currentBaby._id, {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        })
      ]);

      setWeightData(weightResponse.chartData || []);
      setFeedingData(feedingResponse.dailyData || []);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'weight', label: t('charts.weight') || 'Weight' },
    { id: 'feeding', label: t('charts.feeding') || 'Feeding' }
  ];

  if (loading) {
    return <Loader fullScreen text={t('common.loading') || 'Loading...'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-primary-600 text-white p-6">
        <h1 className="text-2xl font-bold">{t('charts.title') || 'Growth Charts'}</h1>
      </div>

      <div className="max-w-screen-xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Charts */}
        {activeTab === 'weight' && <WeightChart data={weightData} />}
        {activeTab === 'feeding' && <FeedingChart data={feedingData} />}
      </div>
    </div>
  );
};

export default ChartsContainer;
