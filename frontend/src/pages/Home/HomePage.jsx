import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import SchemeCard from "../../components/scheme/SchemeCard";
import SkeletonCard from "../../components/common/SkeletonCard";
import "./HomePage.css";

const lifeEvents = ["Education", "Employment", "Marriage", "Business", "Pregnancy", "Retirement"];
const categoryCards = [
  {
    title: "Education & Learning",
    event: "Education",
    description: "Scholarships, merit support, and student-focused benefits for school and higher education.",
    accent: "education"
  },
  {
    title: "Jobs & Skills",
    event: "Employment",
    description: "Training, certification, and employment-linked schemes designed to improve employability.",
    accent: "employment"
  },
  {
    title: "Women & Family Support",
    event: "Marriage",
    description: "Financial assistance and welfare support aligned with family milestones and social security.",
    accent: "marriage"
  },
  {
    title: "Business & Self-Employment",
    event: "Business",
    description: "Loans, guarantees, and entrepreneurship support for micro and small businesses.",
    accent: "business"
  },
  {
    title: "Health & Motherhood",
    event: "Pregnancy",
    description: "Maternal healthcare, cash assistance, and public health support for safer pregnancies.",
    accent: "pregnancy"
  },
  {
    title: "Pension & Retirement",
    event: "Retirement",
    description: "Savings and pension schemes for long-term financial security after retirement.",
    accent: "retirement"
  }
];

const authorityContent = {
  central: {
    title: "Central Government Schemes",
    description: "National ministries and departments offering broad-coverage programmes across India.",
    items: [
      "Ministry of Education",
      "Ministry of Finance",
      "Ministry of MSME",
      "Ministry of Rural Development",
      "Ministry of Health and Family Welfare",
      "Ministry of Women and Child Development"
    ]
  },
  state: {
    title: "States and UT Support",
    description: "State-led welfare schemes, local eligibility rules, and region-specific citizen services.",
    items: [
      "Scholarship and fee support portals",
      "Women and family benefit programmes",
      "State entrepreneurship assistance",
      "Health protection schemes",
      "Senior citizen welfare programmes",
      "Local marriage and social justice support"
    ]
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ age: "", income: "", occupation: "" });
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorityView, setAuthorityView] = useState("central");

  useEffect(() => {
    api
      .get("/schemes")
      .then(({ data }) => setSchemes(data))
      .finally(() => setLoading(false));
  }, []);

  const featuredSchemes = schemes.slice(0, 6);
  const authorityPanel = authorityContent[authorityView];
  const quickStats = [
    { label: "Schemes surfaced", value: schemes.length || "50+" },
    { label: "Life-event tracks", value: lifeEvents.length },
    { label: "Ministry touchpoints", value: new Set(schemes.map((scheme) => scheme.ministry)).size || "10+" }
  ];

  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Govt. Schemes Directory</span>
          <h1>Find government schemes matched to your life stage</h1>
          <p>
            Explore welfare, scholarship, business, health, and pension support through a
            simpler citizen-friendly portal built around your age, income, and occupation.
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
          <div className="hero-stats">
            {quickStats.map((item) => (
              <div key={item.label} className="hero-stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-showcase">
          <div className="showcase-card spotlight-card">
            <span className="showcase-label">Find the best schemes for you</span>
            <h2>Start with the life event that fits your situation</h2>
            <p>
              Choose a category below to move directly into a focused recommendation flow.
            </p>
          </div>
          <div className="life-event-grid">
            {lifeEvents.map((event) => (
              <button
                key={event}
                className="event-tile"
                onClick={() => navigate("/recommender", { state: { lifeEvent: event } })}
              >
                <span className={`event-illustration ${event.toLowerCase()}`} aria-hidden="true" />
                <span>{event}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="category-section">
        <div className="section-heading">
          <div>
            <h2>Schemes by category</h2>
            <p>Borrowing the strongest part of the official portal: clearer browsing before search.</p>
          </div>
          <button className="ghost-button" onClick={() => navigate("/recommender")}>
            Explore all
          </button>
        </div>
        <div className="category-grid">
          {categoryCards.map((category) => (
            <article key={category.title} className="category-card">
              <div className={`category-visual ${category.accent}`} aria-hidden="true">
                <span className="visual-sun" />
                <span className="visual-arch" />
                <span className="visual-figure" />
              </div>
              <div className="category-body">
                <span className="category-kicker">{category.event}</span>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <button
                  className="text-button"
                  onClick={() => navigate("/recommender", { state: { lifeEvent: category.event } })}
                >
                  Open category
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="authority-section">
        <div className="section-heading">
          <div>
            <h2>Central and state discovery</h2>
            <p>A lightweight version of the official central and state scheme split.</p>
          </div>
          <div className="authority-toggle">
            <button
              className={authorityView === "central" ? "authority-chip active" : "authority-chip"}
              onClick={() => setAuthorityView("central")}
            >
              Central
            </button>
            <button
              className={authorityView === "state" ? "authority-chip active" : "authority-chip"}
              onClick={() => setAuthorityView("state")}
            >
              States / UTs
            </button>
          </div>
        </div>
        <div className="authority-panel">
          <div className="authority-copy">
            <span className="eyebrow">{authorityPanel.title}</span>
            <h3>{authorityPanel.description}</h3>
            <p>
              Use this as a guided entry point, then continue into the recommender to narrow
              results by your personal profile.
            </p>
            <button className="primary-button" onClick={() => navigate("/recommender")}>
              Continue to recommender
            </button>
          </div>
          <ul className="authority-list">
            {authorityPanel.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <h2>Featured schemes</h2>
            <p>Quick starting points with clearer visuals, ministry labels, and eligibility details.</p>
          </div>
        </div>
        <div className="featured-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : featuredSchemes.map((scheme) => <SchemeCard key={scheme._id} scheme={scheme} />)}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
