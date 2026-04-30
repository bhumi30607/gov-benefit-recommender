import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosInstance";
import SchemeCard from "../../components/scheme/SchemeCard";
import SkeletonCard from "../../components/common/SkeletonCard";
import "./RecommenderPage.css";

const lifeEvents = ["Education", "Employment", "Marriage", "Business", "Pregnancy", "Retirement"];
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const RecommenderPage = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [filters, setFilters] = useState({ ministry: "", benefitType: "", incomeSlab: "" });
  const [form, setForm] = useState({
    lifeEvent: location.state?.lifeEvent || "Education",
    age: "",
    income: "",
    state: "",
    occupation: ""
  });

  useEffect(() => {
    if (location.state?.lifeEvent) {
      setForm((prev) => ({ ...prev, lifeEvent: location.state.lifeEvent }));
    }
  }, [location.state]);

  const handleSubmit = async () => {
    setLoading(true);
    setStep(3);
    try {
      const { data } = await api.post("/schemes/recommend", form);
      setSchemes(data);
      if (!data.length) toast.info("No schemes matched the current filters");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (schemeId) => {
    const { data } = await api.post("/profile/save-scheme", { schemeId });
    toast.success(data.message);
  };

  const visibleSchemes = schemes.filter((scheme) => {
    if (filters.ministry && scheme.ministry !== filters.ministry) return false;
    if (filters.benefitType && scheme.benefitType !== filters.benefitType) return false;
    if (filters.incomeSlab) {
      const matchedIncomeRule = scheme.eligibility.find((item) => item.label === "maxIncome");
      const maxIncome = Number(matchedIncomeRule?.value || 999999999);
      if (filters.incomeSlab === "low" && maxIncome > 300000) return false;
      if (filters.incomeSlab === "middle" && (maxIncome <= 300000 || maxIncome > 800000)) return false;
    }
    return true;
  });
  const topMatch = visibleSchemes[0] || null;
  const showingApproximateMatches =
    visibleSchemes.length > 0 && visibleSchemes.every((scheme) => scheme.isApproximateMatch);

  return (
    <div className="recommender-page">
      <section className="wizard-panel">
        <div className="stepper">
          {[1, 2, 3].map((item) => (
            <button key={item} className={step === item ? "step active" : "step"} onClick={() => setStep(item)}>
              Step {item}
            </button>
          ))}
        </div>

        {step === 1 ? (
          <div className="step-section">
            <h1>Select a life event</h1>
            <div className="event-choice-grid">
              {lifeEvents.map((event) => (
                <button
                  key={event}
                  type="button"
                  className={form.lifeEvent === event ? "event-tile active" : "event-tile"}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, lifeEvent: event }));
                    setStep(2);
                  }}
                >
                  <span>{event}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="step-section">
            <h1>Tell us about your situation</h1>
            <div className="form-grid">
              <input placeholder="Age" value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} />
              <input
                placeholder="Annual Income"
                value={form.income}
                onChange={(e) => setForm((p) => ({ ...p, income: e.target.value }))}
              />
              <select value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}>
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <input
                placeholder="Occupation"
                value={form.occupation}
                onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
              />
            </div>
            <button className="primary-button" onClick={handleSubmit}>
              Show Matches
            </button>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="results-layout">
            <aside className="filter-panel">
              <h2>Filter Results</h2>
              <select onChange={(e) => setFilters((p) => ({ ...p, ministry: e.target.value }))}>
                <option value="">All Ministries</option>
                {[...new Set(schemes.map((item) => item.ministry))].map((ministry) => (
                  <option key={ministry} value={ministry}>
                    {ministry}
                  </option>
                ))}
              </select>
              <select onChange={(e) => setFilters((p) => ({ ...p, benefitType: e.target.value }))}>
                <option value="">All Benefit Types</option>
                {[...new Set(schemes.map((item) => item.benefitType))].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select onChange={(e) => setFilters((p) => ({ ...p, incomeSlab: e.target.value }))}>
                <option value="">Any Income Slab</option>
                <option value="low">Up to 3 lakh</option>
                <option value="middle">3 to 8 lakh</option>
              </select>
            </aside>
            <div className="results-panel">
              <h1>Matched schemes</h1>
              {showingApproximateMatches ? (
                <div className="results-note">
                  No exact matches were found for your details, so these are the closest suitable schemes.
                </div>
              ) : null}
              {topMatch ? (
                <section className="top-match-panel">
                  <div>
                    <span className="eyebrow">
                      {topMatch.isApproximateMatch ? "Closest match" : "Top match"}
                    </span>
                    <h2>{topMatch.schemeName}</h2>
                    <p>{topMatch.benefitDetails}</p>
                  </div>
                  <div className="top-match-score">
                    <strong>{topMatch.matchScore}%</strong>
                    <span>
                      {topMatch.isApproximateMatch
                        ? "Closest fit for your current profile"
                        : "Best fit for your current profile"}
                    </span>
                  </div>
                </section>
              ) : !loading ? (
                <div className="results-note">No schemes are available for the selected life event yet.</div>
              ) : null}
              <div className="featured-grid">
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
                  : visibleSchemes.map((scheme) => (
                      <SchemeCard
                        key={scheme._id}
                        scheme={scheme}
                        onSave={handleSave}
                        isTopMatch={topMatch?._id === scheme._id}
                      />
                    ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default RecommenderPage;
