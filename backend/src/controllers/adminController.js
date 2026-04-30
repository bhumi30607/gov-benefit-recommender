import Scheme from "../models/Scheme.js";
import User from "../models/User.js";
import SearchHistory from "../models/SearchHistory.js";

export const getAdminStats = async (_req, res) => {
  const [totalSchemes, totalUsers, searchAggregation] = await Promise.all([
    Scheme.countDocuments(),
    User.countDocuments(),
    SearchHistory.aggregate([
      { $group: { _id: "$lifeEvent", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ])
  ]);

  res.json({
    totalSchemes,
    totalUsers,
    mostSearchedLifeEvent: searchAggregation[0]?._id || "No searches yet"
  });
};
