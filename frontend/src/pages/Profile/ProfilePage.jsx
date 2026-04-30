import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState("saved");
  const [profile, setProfile] = useState(user);
  const [file, setFile] = useState(null);

  useEffect(() => {
    api.get("/profile").then(({ data }) => {
      setProfile(data);
      setUser(data);
      localStorage.setItem("gb_user", JSON.stringify(data));
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    ["gender", "dateOfBirth", "phone", "state", "income", "occupation", "name"].forEach((key) => {
      payload.append(key, profile[key] || "");
    });
    if (file) payload.append("profilePicture", file);

    const { data } = await api.put("/profile/update", payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setProfile(data.user);
    setUser(data.user);
    localStorage.setItem("gb_user", JSON.stringify(data.user));
    toast.success(data.message);
  };

  if (!profile) return null;

  return (
    <div className="profile-page">
      <section className="profile-header-card">
        <img
          src={profile.profilePicture || "https://placehold.co/120x120"}
          alt={profile.name}
          className="profile-avatar"
        />
        <div>
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
          <span className="user-pill">{profile.accountType}</span>
        </div>
      </section>

      <section className="profile-grid">
        <form className="profile-form" onSubmit={handleUpdate}>
          <h2>Edit profile</h2>
          <div className="form-grid">
            <input name="name" value={profile.name || ""} onChange={handleChange} placeholder="Full Name" />
            <input name="gender" value={profile.gender || ""} onChange={handleChange} placeholder="Gender" />
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth?.slice?.(0, 10) || ""}
              onChange={handleChange}
            />
            <input name="phone" value={profile.phone || ""} onChange={handleChange} placeholder="Phone" />
            <input name="state" value={profile.state || ""} onChange={handleChange} placeholder="State" />
            <input name="income" value={profile.income || ""} onChange={handleChange} placeholder="Income" />
            <input
              name="occupation"
              value={profile.occupation || ""}
              onChange={handleChange}
              placeholder="Occupation"
            />
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <button className="primary-button" type="submit">
            Save Changes
          </button>
        </form>

        <div className="profile-tabs">
          <div className="tab-strip">
            <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>
              Saved Schemes
            </button>
            <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
              Search History
            </button>
          </div>
          {tab === "saved" ? (
            <div className="panel-list">
              {profile.savedSchemes?.length ? (
                profile.savedSchemes.map((scheme) => (
                  <div key={scheme._id} className="history-item">
                    <strong>{scheme.schemeName}</strong>
                    <span>{scheme.ministry}</span>
                  </div>
                ))
              ) : (
                <p>No saved schemes yet.</p>
              )}
            </div>
          ) : (
            <div className="panel-list">
              {profile.searchHistory?.length ? (
                profile.searchHistory.map((entry) => (
                  <div key={entry._id} className="history-item">
                    <strong>{entry.lifeEvent}</strong>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p>No searches recorded yet.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
