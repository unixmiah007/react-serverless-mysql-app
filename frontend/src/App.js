import React, { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
  });

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState(null);
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendEmail = () => {
    const templateParams = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      username: form.username,
    };

    return emailjs.send(
      "service_t2yw3kf",    // your EmailJS service ID
      "template_5wqogy6",   // your EmailJS template ID
      templateParams,
      "8GNPEgxB20oSY8Dd_"   // your EmailJS public key
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUserId) {
        await axios.put(`http://localhost:5000/users/${editingUserId}`, form);
        alert("User updated successfully!");
      } else {
        await axios.post("http://localhost:5000/users", form);
        await sendEmail();
        alert("User registered and confirmation email sent!");
      }

      setForm({ firstname: "", lastname: "", email: "", username: "" });
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error submitting form or sending email:", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
    });
    setEditingUserId(user.id);
  };

  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", padding: "2rem" }}
      className="flex flex-col items-center"
    >
      <div className="form-container">
        <h1 className="form-title">{editingUserId ? "Edit User" : "User Form"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-field"
              name="firstname"
              placeholder="First Name"
              value={form.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-field"
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-field"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
            />
          </div>
          <div className="form-group">
            <input
              className="form-field"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group flex gap-2">
            <button type="submit" className="form-button">
              {editingUserId ? "Update" : "Submit"}
            </button>
            {editingUserId && (
              <button
                type="button"
                className="form-button bg-gray-400"
                onClick={() => {
                  setEditingUserId(null);
                  setForm({ firstname: "", lastname: "", email: "", username: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="user-list">
        <h2 className="user-list-title">Users</h2>
        <ul>
          {currentUsers.map((u) => (
            <li key={u.id} className="user-list-item">
              <span className="font-medium">
                {u.firstname} {u.lastname}
              </span>
              <span> ({u.username}) - {u.email}</span>
              <button
                className="ml-2 text-blue-600 hover:underline"
                onClick={() => handleEdit(u)}
              >
                Edit
              </button>
              <button
                className="ml-2 text-red-600 hover:underline"
                onClick={() => handleDelete(u.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
