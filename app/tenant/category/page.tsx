"use client";
import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/16/solid";
import CreateCategoryModal from "@/components/Tenant/CreateCategoryModal";
import Pagination from "@/components/Pagination";
import { useSession } from "next-auth/react";
import NotificationModal from "@/components/NotificationModal";

interface CategoryImage {
  id: number;
  imageUrl: string;
}

interface CategoryTenant {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  avatar: string;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image?: CategoryImage;
  tenant?: CategoryTenant;
}

function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // State for editing
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          `${apiUrl}/categories?page=${currentPage - 1}&limit=${itemsPerPage}` // Adjust page index for API
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setCategories(data.data.categories);
          setTotalPages(data.data.totalPages);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (err) {
        setError("Failed to fetch categories");
        setNotificationMessage("Failed to fetch categories");
        setShowNotificationModal(true); // Show the notification modal
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [apiUrl, currentPage]); // Depend on currentPage to refetch when it changes

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true); // Open modal for editing
  };

  const handleDeleteClick = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setShowDeleteConfirmation(true); // Show delete confirmation
  };

  const confirmDelete = async () => {
    if (categoryToDelete !== null) {
      try {
        const response = await fetch(
          `${apiUrl}/categories/${categoryToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete category");
        }
        setCategories((prev) =>
          prev.filter((category) => category.id !== categoryToDelete)
        );
        setShowDeleteConfirmation(false);
        setNotificationMessage(`Category deleted successfully!`); // Set the success message
        setShowNotificationModal(true); // Show notification modal
      } catch (err) {
        setError("Failed to delete category");
        setNotificationMessage("Failed to delete category.");
        setShowNotificationModal(true); // Show notification modal
      }
    }
  };

  const handleCreateClick = () => {
    setEditingCategory(null); // Reset for creating a new category
    setShowModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl tracking-widest font-semibold">Categories</h2>
        <button
          onClick={handleCreateClick}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          <PlusIcon className="mr-2 w-5 h-5" />
          Create
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                Loading categories...
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.image ? (
                    <img
                      src={category.image.imageUrl}
                      alt={category.name}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id)}
                    className="text-red-500 hover:underline ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <CreateCategoryModal
          onClose={() => setShowModal(false)}
          category={editingCategory}
          onSave={async (category: Category) => {
            try {
              if (session) {
                const requestBody = {
                  name: category.name,
                  description: category.description,
                  imageId: category.image?.id || null,
                };

                const method = category.id ? "PUT" : "POST"; // Use PUT for editing
                const response = await fetch(
                  `${apiUrl}/categories${category.id ? `/${category.id}` : ""}`,
                  {
                    method,
                    headers: {
                      Authorization: `Bearer ${session.user.token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                  }
                );

                if (!response.ok) {
                  throw new Error("Failed to save category");
                }

                const updatedCategory = await response.json();
                setCategories((prev) =>
                  category.id
                    ? prev.map((cat) =>
                        cat.id === updatedCategory.id ? updatedCategory : cat
                      )
                    : [...prev, updatedCategory]
                );

                setShowModal(false);
                setNotificationMessage(
                  `Category ${
                    category.id ? "updated" : "created"
                  } successfully!`
                ); // Set the success message
                setShowNotificationModal(true); // Show notification modal
              }
            } catch (err) {
              setError("Failed to save category");
            }
          }}
        />
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 mr-2 text-gray-500 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotificationModal && (
        <NotificationModal
          message={notificationMessage!}
          onClose={() => {
            setShowNotificationModal(false);
            setNotificationMessage(null); // Clear message on close
          }}
        />
      )}

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default CategoryPage;
