import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import { formatDate } from '../../utils/dateHelpers';

const FeedingChart = ({ data = [] }) => {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <Card title={t('charts.feeding') || 'Feeding Chart (7 Days)'}>
        <p className="text-center text-gray-500 py-6">
          {t('charts.noData') || 'No data available'}
        </p>
      </Card>
    );
  }

  return (
    <Card title={t('charts.feeding') || 'Feeding Chart (7 Days)'}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => formatDate(date, 'dd/MM')}
          />
          <YAxis label={{ value: 'Volume (ml)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            labelFormatter={(date) => formatDate(date)}
            formatter={(value) => [`${value} ml`, 'Volume']}
          />
          <Legend />
          <Bar dataKey="volume" fill="#3B82F6" name="Milk Volume" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default FeedingChart;
