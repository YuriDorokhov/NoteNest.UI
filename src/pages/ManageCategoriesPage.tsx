import { useEffect, useState } from "react";
import { createCategory, updateCategory, deleteCategory, getCategories } from "../services/CategoryService";
import type { Category as CategoryType } from "../types/Category";

const languages = [
  { code: "en", label: "English" },
  { code: "ru", label: "Russian" },
  { code: "es", label: "Spanish" },
];

const ManageCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create state
  const [newCategory, setNewCategory] = useState<CategoryType>({
    id: "",
    name: "",
    sourceLanguage: "",
    targetLanguage: "",
  });

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryType>({
    id: "",
    name: "",
    sourceLanguage: "",
    targetLanguage: "",
  });

  // 🔹 Load
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // 🔹 Create
  const handleCreate = async () => {
    if (
      !newCategory.name.trim() ||
      !newCategory.sourceLanguage ||
      !newCategory.targetLanguage
    )
      return;

    try {
      const created = await createCategory(newCategory);
      setCategories((prev) => [...prev, created]);

      setNewCategory({
        id: "",
        name: "",
        sourceLanguage: "",
        targetLanguage: "",
      });
    } catch {
      setError("Failed to create category");
    }
  };

  // 🔹 Update
  const handleUpdate = async (id: string) => {
    try {
      await updateCategory(editingCategory);

      setCategories((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ...editingCategory } : c
        )
      );

      setEditingId(null);
    } catch {
      setError("Failed to update category");
    }
  };

  // 🔹 Delete
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
    "Are you sure you want to delete this category? All related NoteCards will also be deleted."
  );
  if (!confirmed) return;
  
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete category");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      )}

      {/* Create Section */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <input
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          className="border rounded px-3 py-2"
        />

        <select
          value={newCategory.sourceLanguage}
          onChange={(e) =>
            setNewCategory({
              ...newCategory,
              sourceLanguage: e.target.value,
            })
          }
          className="border rounded px-3 py-2"
        >
          <option value="">Source Language</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>

        <select
          value={newCategory.targetLanguage}
          onChange={(e) =>
            setNewCategory({
              ...newCategory,
              targetLanguage: e.target.value,
            })
          }
          className="border rounded px-3 py-2"
        >
          <option value="">Target Language</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleCreate}
        className="mb-8 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition"
      >
        Add Category
      </button>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li
              key={category.id}
              className="border p-4 rounded shadow-sm"
            >
              {editingId === category.id ? (
                <div className="grid grid-cols-3 gap-2">
                  <input
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    className="border rounded px-2 py-1"
                  />

                  <select
                    value={editingCategory.sourceLanguage}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        sourceLanguage: e.target.value,
                      })
                    }
                    className="border rounded px-2 py-1"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={editingCategory.targetLanguage}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        targetLanguage: e.target.value,
                      })
                    }
                    className="border rounded px-2 py-1"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>

                  <div className="col-span-3 flex gap-4 mt-2">
                    <button
                      onClick={() => handleUpdate(category.id)}
                      className="text-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-gray-600">
                      {category.sourceLanguage} → {category.targetLanguage}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingCategory({ ...category });
                      }}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageCategoriesPage;