import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", username: "" });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/users", form);
    setForm({ firstname: "", lastname: "", email: "", username: "" });
    fetchUsers();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="form-container">
        <h1 className="form-title">User Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="form-field"
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            required
          />
          <input
            className="form-field"
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            required
          />
          <input
            className="form-field"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="form-field"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>

      <div className="user-list">
        <h2 className="user-list-title">Users</h2>
        <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {users.map((u) => (
            <li key={u.id} className="user-list-item">
              <span className="font-medium">{u.firstname} {u.lastname}</span>
              <span className="text-gray-500"> ({u.username}) - {u.email}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
