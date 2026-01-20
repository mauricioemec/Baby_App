import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import LanguageSelector from './LanguageSelector';
import ConstantsEditor from './ConstantsEditor';
import BabyProfile from '../baby/BabyProfile';
import Button from '../common/Button';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-primary-600 text-white p-6">
        <h1 className="text-2xl font-bold">{t('settings.title') || 'Settings'}</h1>
      </div>

      <div className="max-w-screen-xl mx-auto p-4 space-y-4">
        {/* User Info */}
        <Card title={t('settings.account') || 'Account'}>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t('settings.name') || 'Name'}:</span> {user?.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t('settings.email') || 'Email'}:</span> {user?.email}
            </p>
          </div>
        </Card>

        {/* Baby Profile */}
        <BabyProfile />

        {/* Language */}
        <LanguageSelector />

        {/* Constants */}
        <ConstantsEditor />

        {/* Logout */}
        <Button
          variant="danger"
          fullWidth
          icon={LogOut}
          onClick={handleLogout}
        >
          {t('settings.logout') || 'Logout'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
