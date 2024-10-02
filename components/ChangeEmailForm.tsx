import React, { useState } from "react";
import Modal from "./Modal"; // Importing your Modal component

interface ChangeEmailFormProps {
  onSubmit: (currentPassword: string, newEmail: string) => void;
  onClose: () => void; // New prop for closing the modal
}

const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newEmail) {
      alert("Please fill in both fields.");
      return;
    }
    setIsSubmitting(true);
    await onSubmit(currentPassword, newEmail);
    setIsSubmitting(false);
  };

  return (
    <Modal>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto  z-50 ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Change Email</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &#x2715;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="new-email"
              className="block text-sm font-medium text-gray-700"
            >
              New Email
            </label>
            <input
              type="email"
              id="new-email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white rounded-md ${
              isSubmitting ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ChangeEmailForm;
