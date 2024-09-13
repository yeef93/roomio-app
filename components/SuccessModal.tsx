import React from "react";

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

function SuccessModal ({ message, onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
        <p className="text-sm text-gray-700 mb-6">{message}</p>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
