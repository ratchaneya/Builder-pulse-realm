import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getTravelDataHandler,
  awardGreenMilesHandler,
  getUserProfileHandler,
  getForecastHandler,
  getLeaderboardHandler,
  getRewardsHandler,
  redeemRewardHandler,
  getPartnerLocationsHandler,
  getUserRedemptionsHandler,
} from "./routes/tourism";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Tourism API endpoints
  app.post("/api/travel-data", getTravelDataHandler);
  app.post("/api/green-miles", awardGreenMilesHandler);
  app.get("/api/user/:userId", getUserProfileHandler);
  app.get("/api/forecast", getForecastHandler);
  app.get("/api/leaderboard", getLeaderboardHandler);

  // Redemption API endpoints
  app.get("/api/rewards", getRewardsHandler);
  app.post("/api/redeem", redeemRewardHandler);
  app.get("/api/rewards/:rewardId/locations", getPartnerLocationsHandler);
  app.get("/api/user/:userId/redemptions", getUserRedemptionsHandler);

  return app;
}
