"use client";

import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../../components/sidebar";

const activeStatus = () => {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
      Active
    </span>
  );
};

const inactiveStatus = () => {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">
      Inactive
    </span>
  );
};

const adminRole = () => {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
      Admin
    </span>
  );
};

const userRole = () => {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs">
      User
    </span>
  );
};

const UserModal = ({ setShowModal, onUserCreated, mode, user }) => {
  const [form, setForm] = React.useState({
    username: user?.username || "",
    name: user?.name || "",
    role: user?.role || "admin",
  });
  const [formError, setFormError] = React.useState(null);
  const [formLoading, setFormLoading] = React.useState(false);

  React.useEffect(() => {
    if (mode === "edit" && user) {
      setForm({
        username: user.username || "",
        name: user.name || "",
        role: user.role || "admin",
      });
    } else if (mode === "create") {
      setForm({ username: "", name: "", role: "admin" });
    }
  }, [mode, user]);

  const closeModal = () => {
    setShowModal(false);
    setForm({ username: "", name: "", role: "admin" });
    setFormError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      let payload = { ...form };
      if (mode === "edit" && user) {
        payload.originalUsername = user.username;
      }
      const res = await fetch("/api/admin/users", {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create user");
      }

      // Refresh users list
      if (onUserCreated) await onUserCreated();
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-8 relative animate-fade-in">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">
          {mode === "create" ? "Create New User" : `Edit User`}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Username
            </label>
            <input
              name="username"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.username}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Name</label>
            <input
              name="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Role</label>
            <select
              name="role"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.role}
              onChange={handleFormChange}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg text-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
            disabled={formLoading}
          >
            {formLoading ? (mode === "create" ? "Creating..." : "Saving...") : (mode === "create" ? "Create User" : "Save Changes")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function AdminManagement() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const openModal = () => setShowModal(true);
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
    setSelectedUser(null);
  };

  // Extract fetchUsers so it can be passed to modal
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (username) => {
    try {
      await fetch(`/api/admin/users?username=${username}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (e) {
      console.error("Error deleting user:", e);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 z-10">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 font-medium">
                  Admin Management
                </span>
                <span className="text-gray-400">Manage Users</span>
              </div>
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <span className="text-gray-900 text-2xl font-medium">
                Admin Management
              </span>
            </div>
          </div>
          <div className="border w-full h-full rounded-xl p-4 overflow-y-auto">
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-medium">Admin Directory</h1>
                <p className="text-gray-500">
                  Manage your organization's admin users, roles, and access.
                </p>
              </div>
              <div>
                <button
                  onClick={openModal}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700 transition-colors"
                >
                  <span className="flex items-center space-x-2 gap-2">
                    <Plus /> Create New User
                  </span>
                </button>
                {/* Overlay Modal for Create User */}
                {showModal && (
                  <UserModal
                    setShowModal={setShowModal}
                    onUserCreated={fetchUsers}
                    mode="create"
                  />
                )}
                {editModal && (
                  <UserModal
                    setShowModal={closeEditModal}
                    onUserCreated={fetchUsers}
                    mode="edit"
                    user={selectedUser}
                  />
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white rounded-xl shadow-md ">
                  <thead className="text-center">
                    <tr className=" border-b">
                      <th className="px-6 py-4 font-medium text-gray-500">
                        Username
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-500">
                        Name
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-500">
                        Role
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-gray-400"
                        >
                          Loading users...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-red-500"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-gray-400"
                        >
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.username}
                          className="hover:bg-purple-50 transition-colors border-b text-center"
                        >
                          <td className="px-6 py-4 font-mono">
                            {user.username}
                          </td>
                          <td className="px-6 py-4">{user.name}</td>
                          <td className="px-6 py-4">
                            {user.role === "admin" ? adminRole() : userRole()}
                          </td>
                          <td className="px-6 py-4">{activeStatus()}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors"
                                title="Edit"
                                onClick={() => openEditModal(user)}
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                title="Delete"
                                onClick={() => handleUserDelete(user.username)}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
