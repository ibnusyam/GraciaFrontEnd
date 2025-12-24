import React, { useState, useEffect } from "react";
import { useUsers } from "../Hooks/useUsers";

const UserManagement = () => {
  const { state, actions } = useUsers();
  const { users, loading, error, formOptions } = state;
  const { fetchData, createUser, updateUser, deleteUser, getNullString } =
    actions;

  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const initialForm = {
    username: "",
    password: "",
    full_name: "",
    department_id: "",
    position_id: "",
    site_id: "",
  };
  const [formData, setFormData] = useState(initialForm);

  // Load data awal
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditMode(true);
    setCurrentId(user.user_id);
    setFormData({
      username: user.username,
      password: "", // Password dikosongkan saat edit
      full_name: user.full_name,
      // Pastikan handle null value dari database
      department_id: user.department_id || "",
      position_id: user.position_id || "",
      site_id: user.site_id || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus user ini?")) {
      await deleteUser(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      department_id: formData.department_id
        ? parseInt(formData.department_id)
        : null,
      position_id: formData.position_id ? parseInt(formData.position_id) : null,
      site_id: formData.site_id ? parseInt(formData.site_id) : null,
    };
    if (isEditMode && !payload.password) {
      delete payload.password;
    }

    const result = isEditMode
      ? await updateUser(currentId, payload)
      : await createUser(payload);

    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          IT - User Management
        </h1>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          + Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* --- TABLE --- */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Username
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Dept / Pos / Site
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-5 text-gray-500">
                  Loading data...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap font-medium">
                      {user.full_name}
                    </p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {user.username}
                    </p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    <div className="text-xs text-gray-500">
                      D: {getNullString(user.department_name)} <br />
                      P: {getNullString(user.position_name)} <br />
                      S: {getNullString(user.site_name)}
                    </div>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm text-center">
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {isEditMode ? "Edit User" : "Create New User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isEditMode}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password{" "}
                  {isEditMode && (
                    <span className="text-xs text-gray-400 font-normal">
                      (Biarkan kosong jika tidak diganti)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  required={!isEditMode}
                  minLength={6}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">-- Select Department --</option>
                  {formOptions.departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>

                <select
                  name="position_id"
                  value={formData.position_id}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">-- Select Position --</option>
                  {formOptions.positions.map((p) => (
                    <option key={p.position_id} value={p.position_id}>
                      {p.position_name}
                    </option>
                  ))}
                </select>

                <select
                  name="site_id"
                  value={formData.site_id}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">-- Select Site --</option>
                  {formOptions.sites.map((s) => (
                    <option key={s.site_id} value={s.site_id}>
                      {s.site_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
