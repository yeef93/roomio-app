import React from "react";

interface NotificationModalProps {
  message: string;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-semibold">Notification</h3>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 text-white bg-green-500 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
