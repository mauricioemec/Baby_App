import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import { formatDate } from '../../utils/dateHelpers';

const WeightChart = ({ data = [], omsData = [] }) => {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <Card title={t('charts.weight') || 'Weight Chart'}>
        <p className="text-center text-gray-500 py-6">
          {t('charts.noData') || 'No data available'}
        </p>
      </Card>
    );
  }

  return (
    <Card title={t('charts.weight') || 'Weight Chart'}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => formatDate(date, 'dd/MM')}
          />
          <YAxis label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            labelFormatter={(date) => formatDate(date)}
            formatter={(value) => [`${value} g`, 'Weight']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Baby Weight"
          />
          {omsData.map((curve, index) => (
            <Line
              key={curve.name}
              type="monotone"
              dataKey={curve.dataKey}
              stroke={curve.color}
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name={curve.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default WeightChart;
