import express from "express";
import userRoutes from "./routes/user";
import projectRoutes from "./routes/project";
import beatRoutes from "./routes/beat";
import tagRoutes from "./routes/tag";
import notificationRoutes from "./routes/notification";
import analyticsRoutes from "./routes/analytics";
import { authenticate } from "./middleware/auth";

const app = express();
app.use(express.json());

// Secure all APIs with authentication middleware
app.use(authenticate);

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/beats", beatRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;