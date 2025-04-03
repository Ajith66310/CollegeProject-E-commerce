import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const AdminManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const removeUser = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/admin/remove-user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error removing user", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">User Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Wrap the table with a div for responsive scrolling */}
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr style={{ backgroundColor: "#4CAF50" }} className="text-white">
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="px-5 py-3">{user.name}</td>
                  <td className="px-5 py-3">{user.email}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => removeUser(user._id)}
                      className="border font-bold py-1 px-3 rounded transition duration-300"
                      style={{
                        backgroundColor: "#ffebf5",
                        borderColor: "#C586A5",
                        color: "#C586A5",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = "#a0567d";
                        e.target.style.color = "#a0567d";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = "#C586A5";
                        e.target.style.color = "#C586A5";
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
