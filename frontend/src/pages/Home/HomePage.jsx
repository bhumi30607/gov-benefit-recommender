import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import SchemeCard from "../../components/scheme/SchemeCard";
import SkeletonCard from "../../components/common/SkeletonCard";
import "./HomePage.css";

const lifeEvents = ["Education", "Employment", "Marriage", "Business", "Pregnancy", "Retirement"];

const HomePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ age: "", income: "", occupation: "" });
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/schemes")
      .then(({ data }) => setSchemes(data.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Life-event aware scheme discovery</span>
          <h1>Find Government Benefits Made for You</h1>
          <p>
            Search by life event, age, income, and occupation to surface schemes that
            actually fit your situation.
          </p>
          <div className="search-strip">
            <input
              placeholder="Age"
              value={filters.age}
              onChange={(e) => setFilters((prev) => ({ ...prev, age: e.target.value }))}
            />
            <input
              placeholder="Income"
              value={filters.income}
              onChange={(e) => setFilters((prev) => ({ ...prev, income: e.target.value }))}
            />
            <input
              placeholder="Occupation"
              value={filters.occupation}
              onChange={(e) => setFilters((prev) => ({ ...prev, occupation: e.target.value }))}
            />
            <button className="primary-button" onClick={() => navigate("/recommender")}>
              Start Matching
            </button>
          </div>
        </div>
        <div className="life-event-grid">
          {lifeEvents.map((event) => (
            <button
              key={event}
              className="event-tile"
              onClick={() => navigate("/recommender", { state: { lifeEvent: event } })}
            >
              {event}
            </button>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <h2>Featured schemes</h2>
          <p>Quick starting points with clear eligibility details.</p>
        </div>
        <div className="featured-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
            : schemes.map((scheme) => <SchemeCard key={scheme._id} scheme={scheme} />)}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
