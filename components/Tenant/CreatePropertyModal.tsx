'use client';

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NotificationModal from "../NotificationModal";

interface CreatePropertyModalProps {
  onClose: () => void;
  onSave: (property: any) => Promise<void>; // Adjust the type as needed
}

const CreatePropertyModal = ({ onClose, onSave }: CreatePropertyModalProps) => {
  const [uploading, setUploading] = useState(false);
  const { data: session } = useSession();
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Property name is required"),
    description: Yup.string().required("Description is required"),
    categoryId: Yup.number().required("Category is required"),
    location: Yup.string().required("Location is required"),
    city: Yup.string().required("City is required"),
    map: Yup.string().url("Must be a valid URL").required("Map link is required"),
  });

  const handleSubmit = async (values: any) => {
    setUploading(true);
    try {
      await onSave(values);
      setNotificationMessage("Property created successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting property:", error);
      alert("Failed to create property");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Create Property</h2>
        <Formik
          initialValues={{
            name: "",
            description: "",
            categoryId: 0,
            location: "",
            city: "",
            map: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Property Name</label>
                <Field name="name" type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <Field name="description" as="textarea" className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category ID</label>
                <Field name="categoryId" type="number" className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="categoryId" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <Field name="location" type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <Field name="city" type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="map" className="block text-sm font-medium text-gray-700">Map Link</label>
                <Field name="map" type="url" className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="map" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-full">Cancel</button>
                <button type="submit" disabled={uploading} className="bg-blue-500 text-white px-4 py-2 rounded-full">
                  {uploading ? "Processing..." : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreatePropertyModal;
