import React from "react";

const artThemes = {
  Education: "education",
  Employment: "employment",
  Marriage: "marriage",
  Business: "business",
  Pregnancy: "pregnancy",
  Retirement: "retirement"
};

const formatEligibilityLabel = (label) =>
  label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase())
    .trim();

const SchemeCard = ({ scheme, onSave, ctaLabel = "Save Scheme", isTopMatch = false }) => (
  <article className={`scheme-card${isTopMatch ? " top-match-card" : ""}`}>
    <div className={`scheme-visual ${artThemes[scheme.lifeEvent] || "education"}`}>
      <span className="scheme-visual-badge">{scheme.lifeEvent}</span>
      <span className="scheme-visual-orb large" aria-hidden="true" />
      <span className="scheme-visual-orb small" aria-hidden="true" />
      <span className="scheme-visual-wave" aria-hidden="true" />
    </div>
    <div className="scheme-topline">
      <span>{scheme.ministry}</span>
      <span>{scheme.benefitType}</span>
    </div>
    <div className="scheme-heading-row">
      <h3>{scheme.schemeName}</h3>
      {scheme.matchScore ? <span className="match-score-badge">{scheme.matchScore}% Match</span> : null}
    </div>
    {isTopMatch ? <span className="top-match-label">Top match</span> : null}
    <p>{scheme.benefitDetails}</p>
    {scheme.matchHighlights?.length ? (
      <ul className="match-highlights">
        {scheme.matchHighlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : null}
    <ul className="eligibility-list">
      {scheme.eligibility?.map((item, index) => (
        <li key={`${item.label}-${index}`}>
          {formatEligibilityLabel(item.label)}: {item.value}
        </li>
      ))}
    </ul>
    <div className="scheme-actions">
      <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="official-link-button">
        Official Link
      </a>
      {onSave ? (
        <button className="primary-button" onClick={() => onSave(scheme._id)}>
          {ctaLabel}
        </button>
      ) : null}
    </div>
  </article>
);

export default SchemeCard;
