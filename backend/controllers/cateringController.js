import Catering from "../models/catering.js";

// Fetch or Create Catering for User
export const getOrCreateCatering = async (req, res) => {
  const { userID } = req.query;

  try {
    let catering = await Catering.findOne({ userID });

    if (!catering) {
      catering = new Catering({ userID });
      await catering.save();
    }

    res.status(200).json(catering);
  } catch (error) {
    console.error("Error fetching catering data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Catering
export const updateCatering = async (req, res) => {
  const { userID } = req.body;

  try {
    const catering = await Catering.findOneAndUpdate(
      { userID },
      { ...req.body, total: undefined }, // Remove "total" to rely on the schema pre-save hook
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(catering);
  } catch (error) {
    console.error("Error updating catering data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
