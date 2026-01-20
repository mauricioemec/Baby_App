import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import Card from '../common/Card';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Card title={t('settings.language') || 'Language'}>
      <div className="grid grid-cols-3 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
              i18n.language === lang.code
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Globe className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{lang.name}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default LanguageSelector;
