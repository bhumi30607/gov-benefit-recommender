import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosInstance";
import "./AdminDashboardPage.css";

const emptyScheme = {
  schemeName: "",
  ministry: "",
  lifeEvent: "Education",
  benefitDetails: "",
  benefitType: "",
  officialUrl: "",
  status: "Active",
  eligibility: [
    { label: "minAge", value: "" },
    { label: "maxIncome", value: "" }
  ]
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [form, setForm] = useState(emptyScheme);
  const [editingId, setEditingId] = useState("");

  const loadData = async () => {
    const [statsResponse, schemesResponse] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/schemes")
    ]);
    setStats(statsResponse.data);
    setSchemes(schemesResponse.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      eligibility: form.eligibility.filter((item) => item.label && item.value)
    };

    if (editingId) {
      await api.put(`/schemes/${editingId}`, payload);
      toast.success("Scheme updated");
    } else {
      await api.post("/schemes", payload);
      toast.success("Scheme added");
    }

    setForm(emptyScheme);
    setEditingId("");
    loadData();
  };

  const handleEdit = (scheme) => {
    setForm({
      ...scheme,
      eligibility: scheme.eligibility?.length ? scheme.eligibility : emptyScheme.eligibility
    });
    setEditingId(scheme._id);
  };

  const handleDelete = async (schemeId) => {
    await api.delete(`/schemes/${schemeId}`);
    toast.success("Scheme deleted");
    loadData();
  };

  const updateEligibility = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      eligibility: prev.eligibility.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <div className="admin-page">
      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Schemes</span>
          <strong>{stats?.totalSchemes || 0}</strong>
        </div>
        <div className="stat-card">
          <span>Total Users</span>
          <strong>{stats?.totalUsers || 0}</strong>
        </div>
        <div className="stat-card">
          <span>Most Searched Life Event</span>
          <strong>{stats?.mostSearchedLifeEvent || "N/A"}</strong>
        </div>
      </section>

      <section className="admin-layout">
        <div className="scheme-table-panel">
          <h1>Manage schemes</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Ministry</th>
                <th>Life Event</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((scheme) => (
                <tr key={scheme._id}>
                  <td>{scheme.schemeName}</td>
                  <td>{scheme.ministry}</td>
                  <td>{scheme.lifeEvent}</td>
                  <td>{scheme.status}</td>
                  <td className="table-actions">
                    <button className="ghost-button" onClick={() => handleEdit(scheme)}>
                      Edit
                    </button>
                    <button className="danger-button" onClick={() => handleDelete(scheme._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Scheme" : "Add Scheme"}</h2>
          <input
            placeholder="Scheme Name"
            value={form.schemeName}
            onChange={(e) => setForm((p) => ({ ...p, schemeName: e.target.value }))}
          />
          <input
            placeholder="Ministry"
            value={form.ministry}
            onChange={(e) => setForm((p) => ({ ...p, ministry: e.target.value }))}
          />
          <select value={form.lifeEvent} onChange={(e) => setForm((p) => ({ ...p, lifeEvent: e.target.value }))}>
            {["Education", "Employment", "Marriage", "Business", "Pregnancy", "Retirement"].map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
          <input
            placeholder="Benefit Type"
            value={form.benefitType}
            onChange={(e) => setForm((p) => ({ ...p, benefitType: e.target.value }))}
          />
          <textarea
            placeholder="Benefit details"
            value={form.benefitDetails}
            onChange={(e) => setForm((p) => ({ ...p, benefitDetails: e.target.value }))}
          />
          <input
            placeholder="Official URL"
            value={form.officialUrl}
            onChange={(e) => setForm((p) => ({ ...p, officialUrl: e.target.value }))}
          />
          {form.eligibility.map((item, index) => (
            <div className="eligibility-row" key={index}>
              <input
                placeholder="Eligibility label"
                value={item.label}
                onChange={(e) => updateEligibility(index, "label", e.target.value)}
              />
              <input
                placeholder="Eligibility value"
                value={item.value}
                onChange={(e) => updateEligibility(index, "value", e.target.value)}
              />
            </div>
          ))}
          <button type="submit" className="primary-button">
            {editingId ? "Update Scheme" : "Add Scheme"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
