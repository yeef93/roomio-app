"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signOut, useSession } from "next-auth/react";
import SuccessModal from "./SuccessModal";

const ChangePassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Formik setup
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), undefined], "New passwords must match")
        .required("Confirm new password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMessage("");
      try {
        if (session) {
          console.log(apiUrl);
          const response = await fetch(`${apiUrl}/users/me/change-password`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`, // Assuming you have session token
            },
            body: JSON.stringify({
              oldPassword: values.currentPassword,
              newPassword: values.newPassword,
              confirmPassword: values.confirmPassword,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            // Show success modal
            setShowSuccessModal(true);

            // Delay logout by 2 seconds to display the success message
            setTimeout(async () => {
              await signOut({ callbackUrl: "/" });
            }, 2000);
          } else {
            setErrorMessage(data.message || "Failed to change password");
          }
        }
      } catch (error) {
        setErrorMessage("Something went wrong. Please try again.");
        console.log(error);
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <p className="text-sm text-gray-500 mb-6">
        For your security, changing your password will require you to log in
        again with your new password on all devices.
      </p>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Render Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message="Your password has been changed successfully!"
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      <form onSubmit={formik.handleSubmit}>
        {/* Current Password */}
        <div className="mb-4">
          <label
            htmlFor="currentPassword"
            className="block font-medium text-sm"
          >
            Enter current password
          </label>
          <input
            type="password"
            id="currentPassword"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            {...formik.getFieldProps("currentPassword")}
          />
          {formik.touched.currentPassword && formik.errors.currentPassword ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.currentPassword}
            </p>
          ) : null}
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label htmlFor="newPassword" className="block font-medium text-sm">
            Create New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            {...formik.getFieldProps("newPassword")}
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.newPassword}
            </p>
          ) : null}
          <p className="text-xs text-gray-500">
            Use a combination of letters, numbers, and symbols. Make sure you
            never use this password before.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block font-medium text-sm"
          >
            Confirm new password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            {...formik.getFieldProps("confirmPassword")}
          />
          {formik.touched.confirmPassword &&
          formik.errors.confirmPassword ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.confirmPassword}
            </p>
          ) : null}
        </div>

        {/* Buttons */}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-gray-600 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-4"
            onClick={() => formik.resetForm()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded ${
              formik.isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
            disabled={formik.isSubmitting}
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;