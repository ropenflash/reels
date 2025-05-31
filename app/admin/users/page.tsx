'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: 'ADMIN' | 'UPLOADER' | 'VIEWER';
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: User['role']) => {
    setUpdating(id);
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role } : user))
    );
    setUpdating(null);
  };

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage User Roles</h1>
      <table className="w-full border text-left bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.name || 'No Name'}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <select
                  value={user.role}
                  disabled={updating === user.id}
                  onChange={(e) =>
                    updateRole(user.id, e.target.value as User['role'])
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="UPLOADER">Uploader</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
