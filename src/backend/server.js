// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/quiz")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const submissionSchema = new mongoose.Schema({
  userAnswers: Object,
  timestamp: { type: Date, default: Date.now },
});

const Submission = mongoose.model("Submission", submissionSchema);

app.post("/api/submissions", async (req, res) => {
  const newSubmission = new Submission(req.body);
  try {
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(400).json({ error: "Failed to save submission" });
  }
});

app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// New DELETE endpoint
app.delete("/api/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Submission.findByIdAndDelete(id);
    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ error: "Failed to delete submission" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
