import express from "express";
import userRoutes from "./routes/user";
import projectRoutes from "./routes/project";
import beatRoutes from "./routes/beat";
import tagRoutes from "./routes/tag";
import notificationRoutes from "./routes/notification";
import analyticsRoutes from "./routes/analytics";
import collaborationRoutes from "./routes/collaboration";
import { authenticate } from "./middleware/auth";

const app = express();
app.use(express.json());

// Secure all APIs with authentication middleware
app.use(authenticate);

// v1 versioned routes
app.use("/v1/users", userRoutes);
app.use("/v1/projects", projectRoutes);
app.use("/v1/beats", beatRoutes);
app.use("/v1/tags", tagRoutes);
app.use("/v1/notifications", notificationRoutes);
app.use("/v1/analytics", analyticsRoutes);
app.use("/v1/collaborations", collaborationRoutes);

// Legacy (unversioned) routes kept for backwards compatibility
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/beats", beatRoutes);
app.use("/tags", tagRoutes);
app.use("/notifications", notificationRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/collaborations", collaborationRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;