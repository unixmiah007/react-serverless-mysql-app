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
    <div style={{ padding: 20 }}>
      <h1>User Form</h1>
      <form onSubmit={handleSubmit}>
        <input name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} required />
        <input name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
      <h2>Users:</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.firstname} {u.lastname} ({u.username}) - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
