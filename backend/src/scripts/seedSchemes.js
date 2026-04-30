import dotenv from "dotenv";
import mongoose from "mongoose";
import Scheme from "../models/Scheme.js";
import defaultSchemes from "../utils/defaultSchemes.js";

dotenv.config();

const seedSchemes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    let insertedCount = 0;
    let updatedCount = 0;

    for (const scheme of defaultSchemes) {
      const result = await Scheme.updateOne(
        { schemeName: scheme.schemeName },
        { $set: scheme },
        { upsert: true }
      );

      if (result.upsertedCount) {
        insertedCount += 1;
      } else if (result.modifiedCount) {
        updatedCount += 1;
      }
    }

    console.log(
      `Scheme seeding complete. Added ${insertedCount} new schemes and updated ${updatedCount} existing schemes.`
    );
    await mongoose.disconnect();
  } catch (error) {
    console.error(`Scheme seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedSchemes();
