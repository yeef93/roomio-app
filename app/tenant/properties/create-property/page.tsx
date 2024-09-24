'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSession } from 'next-auth/react';

interface Category {
  id: number;
  name: string;
}

const CreatePropertyPage = () => {
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Property name is required'),
    description: Yup.string().required('Description is required'),
    categoryId: Yup.number().required('Category is required'),
    location: Yup.string().required('Location is required'),
    city: Yup.string().required('City is required'),
    map: Yup.string().url('Must be a valid URL').required('Map link is required'),
  });

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/property`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create property');
      }

      const data = await response.json();
      console.log('Property created:', data);
      setNotificationMessage('Property created successfully!');
    } catch (error) {
      console.error(error);
      setNotificationMessage('Failed to create property');
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <h1 className="text-xl font-bold mb-4">Create Property</h1>
      {notificationMessage && <div className="text-green-500 mb-4">{notificationMessage}</div>}
      <Formik
        initialValues={{
          name: '',
          description: '',
          categoryId: '',
          location: '',
          city: '',
          map: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
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
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Property Category</label>
              <Field
                as="select"
                name="categoryId"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Field>
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
              <button type="reset" className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePropertyPage;