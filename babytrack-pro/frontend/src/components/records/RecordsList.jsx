import { Trash2, Edit } from 'lucide-react';
import { formatDateTime } from '../../utils/dateHelpers';
import Card from '../common/Card';
import Button from '../common/Button';

const RecordsList = ({ records = [], type, onEdit, onDelete, emptyMessage }) => {
  if (records.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-6">
          {emptyMessage || 'No records found'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <Card key={record._id} padding="normal" hover>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(record.timestamp || record.measurementDate)}
              </p>

              {type === 'feeding' && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Type: {record.feedingType}
                  </p>
                  {record.volume && (
                    <p className="text-sm text-gray-600">
                      Volume: {record.volume} ml
                    </p>
                  )}
                  {record.duration && (
                    <p className="text-sm text-gray-600">
                      Duration: {record.duration} min
                    </p>
                  )}
                </div>
              )}

              {type === 'diaper' && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Type: {record.type}
                  </p>
                  {record.urineVolume && (
                    <p className="text-sm text-gray-600">
                      Volume: {record.urineVolume} ml
                    </p>
                  )}
                </div>
              )}

              {type === 'growth' && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Weight: {record.weight} g
                  </p>
                  <p className="text-sm text-gray-600">
                    Height: {record.height} cm
                  </p>
                  {record.headCircumference && (
                    <p className="text-sm text-gray-600">
                      HC: {record.headCircumference} cm
                    </p>
                  )}
                </div>
              )}

              {record.notes && (
                <p className="mt-2 text-xs text-gray-500">{record.notes}</p>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(record)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  aria-label="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(record)}
                  className="p-2 text-gray-400 hover:text-danger-600 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecordsList;
