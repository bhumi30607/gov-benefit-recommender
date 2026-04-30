import Scheme from "../models/Scheme.js";
import SearchHistory from "../models/SearchHistory.js";
import { evaluateSchemeMatch } from "../services/recommendationService.js";

export const getSchemes = async (req, res) => {
  const { ministry, benefitType, lifeEvent, status } = req.query;
  const query = {};

  if (ministry) query.ministry = ministry;
  if (benefitType) query.benefitType = benefitType;
  if (lifeEvent) query.lifeEvent = lifeEvent;
  if (status) query.status = status;

  const schemes = await Scheme.find(query).sort({ createdAt: -1 });
  res.json(schemes);
};

export const getSchemeById = async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) {
    return res.status(404).json({ message: "Scheme not found" });
  }
  res.json(scheme);
};

export const recommendSchemes = async (req, res) => {
  const { age, income, occupation, state, lifeEvent } = req.body;

  if (!age || income === undefined || !occupation || !lifeEvent) {
    return res.status(400).json({ message: "Missing recommendation filters" });
  }

  const schemes = await Scheme.find({ lifeEvent, status: "Active" });
  const rankedSchemes = schemes
    .map((scheme) => {
      const evaluation = evaluateSchemeMatch(scheme, {
        age,
        income,
        occupation,
        state: state || ""
      });

      return {
        ...scheme.toObject(),
        matchScore: evaluation.matchScore,
        matchHighlights: evaluation.matchHighlights,
        isApproximateMatch: !evaluation.isMatch
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore || a.schemeName.localeCompare(b.schemeName));
  const exactMatches = rankedSchemes.filter((scheme) => !scheme.isApproximateMatch);
  const matches =
    exactMatches.length > 0 ? exactMatches : rankedSchemes.slice(0, Math.min(3, rankedSchemes.length));

  if (req.user) {
    await SearchHistory.create({
      userId: req.user._id,
      lifeEvent
    });
  }

  res.json(matches);
};

export const createScheme = async (req, res) => {
  const scheme = await Scheme.create(req.body);
  res.status(201).json(scheme);
};

export const updateScheme = async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!scheme) {
    return res.status(404).json({ message: "Scheme not found" });
  }
  res.json(scheme);
};

export const deleteScheme = async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) {
    return res.status(404).json({ message: "Scheme not found" });
  }

  await scheme.deleteOne();
  res.json({ message: "Scheme deleted" });
};
