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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendEmail = () => {
    const templateParams = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      username: form.username,
    };

    return emailjs.send(
      "service_t2yw3kf",
      "service_t2yw3kf", // Replace with your actual template ID!
      templateParams,
      "8GNPEgxB20oSY8Dd_"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/users", form);
      await sendEmail();
      alert("User registered and confirmation email sent!");

      setForm({ firstname: "", lastname: "", email: "", username: "" });
      fetchUsers();
      setCurrentPage(1); // Reset to first page on new user add
    } catch (error) {
      console.error("Error submitting form or sending email:", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  // Calculate displayed users for current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Handlers for pagination buttons
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }} className="flex flex-col items-center">
      <div className="form-container">
        <h1 className="form-title">User Form</h1>
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
          <div className="form-group">
            <button type="submit" className="form-button">
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="user-list" style={{ marginTop: "2rem", width: "100%", maxWidth: "600px" }}>
        <h2 className="user-list-title">Users</h2>
        <ul>
          {currentUsers.map((u) => (
            <li key={u.id} className="user-list-item">
              <span className="font-medium">{u.firstname} {u.lastname}</span>
              <span> ({u.username}) - {u.email}</span>
            </li>
          ))}
        </ul>

        <div className="pagination-controls" style={{ marginTop: "1rem", textAlign: "center" }}>
          <button onClick={goToPrevPage} disabled={currentPage === 1} style={{ marginRight: "1rem" }}>
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages} style={{ marginLeft: "1rem" }}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
