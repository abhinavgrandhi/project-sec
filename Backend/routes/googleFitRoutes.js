const express = require("express");
const { google } = require("googleapis");
const router = express.Router();

// Google Fit API requires this scope to read activity data
const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read", // Read activity data (e.g., steps, calories)
];

// Endpoint to handle Google Fit data fetch
router.post("/googlefit/steps", async (req, res) => {
  const { token } = req.body; // Get the token sent by frontend

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // OAuth2 client to verify token and get user data
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    // Initialize the Google Fitness API
    const fitness = google.fitness({ version: "v1", auth: oauth2Client });

    // Example to get daily step count for the user
    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          {
            dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
          },
        ],
        startTimeMillis: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
        endTimeMillis: Date.now(),
      },
    });

    // Get step count data
    const stepData = response.data.bucket[0].dataset[0].point[0].value[0].intVal;

    res.status(200).json({
      steps: stepData, // Send the step count to the frontend
    });
  } catch (error) {
    console.error("Error retrieving Google Fit data:", error);
    res.status(500).json({ message: "Failed to retrieve Google Fit data", error: error.message });
  }
});

module.exports = router;
