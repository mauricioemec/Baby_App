import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const ConsentModal = ({ isOpen, onAccept, loading = false }) => {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Cannot close without accepting
      title={t('consent.title') || 'Terms of Use and Consent'}
      size="lg"
      closeOnOverlayClick={false}
      showCloseButton={false}
      footer={
        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              {t('consent.accept') || 'I have read and accept the terms of use, privacy policy, and consent to data processing for professional healthcare purposes.'}
            </span>
          </label>

          <Button
            variant="primary"
            fullWidth
            onClick={handleAccept}
            loading={loading}
            disabled={!accepted}
          >
            {t('consent.continue') || 'Continue'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
          <FileText className="w-6 h-6 text-primary-600" />
          <p className="text-sm text-primary-900">
            {t('consent.intro') || 'Please read and accept our terms to continue using BabyTrack Pro.'}
          </p>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('consent.termsTitle') || '1. Terms of Use'}
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                {t('consent.terms1') || 'BabyTrack Pro is a professional tool designed for healthcare professionals to track and monitor neonatal health metrics.'}
              </p>
              <p>
                {t('consent.terms2') || 'This application is intended for professional use only and should not replace medical consultation or diagnosis.'}
              </p>
              <p>
                {t('consent.terms3') || 'All data entered must be accurate and used in accordance with medical best practices.'}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('consent.privacyTitle') || '2. Privacy Policy'}
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                {t('consent.privacy1') || 'We collect and store patient data to provide healthcare tracking services.'}
              </p>
              <p>
                {t('consent.privacy2') || 'All data is encrypted and stored securely in compliance with healthcare data protection regulations.'}
              </p>
              <p>
                {t('consent.privacy3') || 'Data will only be accessed by authorized healthcare professionals involved in patient care.'}
              </p>
              <p>
                {t('consent.privacy4') || 'We do not share patient data with third parties without explicit consent, except as required by law.'}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('consent.dataTitle') || '3. Data Processing Consent'}
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                {t('consent.data1') || 'By using this application, you consent to the processing of patient health data for:'}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('consent.data2') || 'Health monitoring and tracking'}</li>
                <li>{t('consent.data3') || 'Growth analysis and percentile calculations'}</li>
                <li>{t('consent.data4') || 'Medication management and reminders'}</li>
                <li>{t('consent.data5') || 'Healthcare reports and analytics'}</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('consent.rightsTitle') || '4. Your Rights'}
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                {t('consent.rights1') || 'You have the right to:'}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('consent.rights2') || 'Access your data at any time'}</li>
                <li>{t('consent.rights3') || 'Request data correction or deletion'}</li>
                <li>{t('consent.rights4') || 'Export your data'}</li>
                <li>{t('consent.rights5') || 'Withdraw consent (account deletion)'}</li>
              </ul>
            </div>
          </section>

          <section className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <h3 className="text-sm font-semibold text-warning-900 mb-2">
              {t('consent.disclaimerTitle') || 'Important Disclaimer'}
            </h3>
            <p className="text-sm text-warning-800">
              {t('consent.disclaimer') || 'This application is a support tool and does not replace professional medical judgment. Always consult with qualified healthcare professionals for medical decisions.'}
            </p>
          </section>
        </div>
      </div>
    </Modal>
  );
};

export default ConsentModal;
