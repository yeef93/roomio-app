'use client';

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NotificationModal from "../NotificationModal";

interface CategoryImage {
  id: number;
  imageUrl: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image?: CategoryImage;
}

interface CreateCategoryModalProps {
  onClose: () => void;
  category?: Category | null;
  onSave: (category: Category) => Promise<void>;
}

interface ImageUploadResponse {
  success: boolean;
  data: { id: number; imageUrl: string };
}

const CreateCategoryModal = ({ onClose, category, onSave }: CreateCategoryModalProps) => {
  const [imageId, setImageId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.mixed()
      .test('fileSize', 'File is too large', function (value) {
        if (!value) return true; // Allow empty files
        if (value instanceof File) {
          return value.size <= 1000000; // 1MB
        }
        return true; // If it's not a File object, skip this validation
      })
      .nullable(),
  });

  const handleImageUpload = async (file: File): Promise<ImageUploadResponse['data'] | null> => {
    const formData = new FormData();
    formData.append("fileName", file.name);
    formData.append("file", file);

    if (session) {
      try {
        const response = await fetch(
          `${apiUrl}/categories/image/upload`,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data: ImageUploadResponse = await response.json();
        return data.data;
      } catch (error) {
        console.error("Image upload error:", error);
        return null;
      }
    } else {
      console.error("No session available");
      return null;
    }
  };

  const handleSubmit = async (values: any) => {
    setUploading(true);

    let newImageId = imageId;
    let newImageUrl = imageUrl;

    if (values.image instanceof File) {
      const uploadResult = await handleImageUpload(values.image);
      if (uploadResult) {
        newImageId = uploadResult.id;
        newImageUrl = uploadResult.imageUrl;
      } else {
        setUploading(false);
        setNotificationMessage("Image upload failed.");
        return;
      }
    }

    try {
      const categoryData: Category = {
        id: category?.id ?? 0,
        name: values.name,
        description: values.description,
        image: newImageId ? { id: newImageId, imageUrl: newImageUrl! } : undefined,
      };

      await onSave(categoryData);
      setNotificationMessage(category ? "Category updated successfully!" : "Category created successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting category:", error);
      alert(category ? "Failed to update category" : "Failed to create category");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (category?.image) {
      setImageId(category.image.id);
      setImageUrl(category.image.imageUrl);
    }
  }, [category]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">{category ? "Edit Category" : "Create Category"}</h2>
        <Formik
          initialValues={{
            name: category?.name || "",
            description: category?.description || "",
            image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                <Field name="name" type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <Field name="description" as="textarea" className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  className="mt-1 block w-full p-2"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) {
                      setFieldValue("image", file);
                    }
                  }}
                />
                <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
                {imageUrl && (
                  <img src={imageUrl} alt="Current category image" className="mt-2 w-14 h-14 object-cover" />
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-full">Cancel</button>
                <button type="submit" disabled={uploading} className="bg-blue-500 text-white px-4 py-2 rounded-full">
                  {uploading ? "Processing..." : category ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateCategoryModal;