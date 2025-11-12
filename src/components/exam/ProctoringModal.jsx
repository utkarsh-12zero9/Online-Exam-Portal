import React from 'react';
import Button from '@/shared/components/ui/Button';
import { 
  HiOutlineShieldCheck, 
  HiOutlineXCircle, 
  HiOutlineExclamation 
} from 'react-icons/hi';

const ProctoringModal = ({ onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Modal Panel */}
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Proctoring Rules</h2>
          <p className="text-gray-600">Please read and accept these rules before starting the exam.</p>
        </div>

        {/* Rules List */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">During the exam, you must not:</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <HiOutlineXCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Exit <strong>fullscreen mode</strong> (the exam will start in fullscreen).</span>
            </li>
            <li className="flex items-start gap-3">
              <HiOutlineXCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Switch tabs or minimize the browser window.</span>
            </li>
            <li className="flex items-start gap-3">
              <HiOutlineXCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Use copy (Ctrl+C) or paste (Ctrl+V).</span>
            </li>
            <li className="flex items-start gap-3">
              <HiOutlineXCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Right-click or open developer tools.</span>
            </li>
          </ul>
        </div>

        {/* Consequence Callout */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiOutlineExclamation className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Maximum 3 Violations:</strong> Any attempt to violate these rules will be recorded. After 3 violations, your exam will be <strong>automatically submitted</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          <Button variant="outline" fullWidth onClick={onReject}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth onClick={onAccept}>
            I Accept - Start Exam
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ProctoringModal;