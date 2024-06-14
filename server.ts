import express from "express";
import logger from "./middleware/logger.js";
import notFound from "./middleware/notFound.js";
import plot from "./routes/plot.js";
import character from "./routes/character.js";
import story from "./routes/story.js";
import stories from "./routes/stories.js";
import authCallback from "./routes/auth-callback.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;

// cors middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger);

// Routes
app.use("/api/auth-callback", authCallback);
app.use("/api/story", story);
app.use("/api/stories", stories);
app.use("/api/plot", plot);
app.use("/api/character", character);

// Error handler
app.use(notFound);

app.listen(port, () => console.log(`Server is running on port ${port}`));
