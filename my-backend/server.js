const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/LoginDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model("User", userSchema);

// Registration Route
app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
        res.status(400).json({ error: "Email already exists" });
    }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid Password" });

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, userName: user.name });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
const axios = require("axios");

app.get("/api/news", async (req, res) => {
  try {
    const {
      category = "general",
      query = "",
      location = "Chennai",
    } = req.query;

    const city = location.trim();

    let searchQuery;

    // Search bar / voice search
    if (query.trim()) {
      searchQuery = query.trim();
    } 
    // Location news
    else {
      searchQuery = `"${city}"`;
    }

    console.log("=================================");
    console.log("LOCATION:", city);
    console.log("CATEGORY:", category);
    console.log("SEARCH:", searchQuery);
    console.log("=================================");

    const apiURL =
      `https://newsapi.org/v2/everything` +
      `?q=${encodeURIComponent(searchQuery)}` +
      `&searchIn=title,description` +
      `&language=en` +
      `&sortBy=publishedAt` +
      `&pageSize=100` +
      `&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await axios.get(apiURL);

    let articles = response.data.articles || [];

    // ------------------------------------
    // STRICT CITY FILTER
    // ------------------------------------
    if (!query.trim()) {

      const cityLower = city.toLowerCase();

      articles = articles.filter((article) => {

        const title =
          (article.title || "").toLowerCase();

        const description =
          (article.description || "").toLowerCase();

        const content =
          (article.content || "").toLowerCase();

        return (
          title.includes(cityLower) ||
          description.includes(cityLower) ||
          content.includes(cityLower)
        );
      });
    }

    // ------------------------------------
    // CATEGORY FILTER
    // ------------------------------------
    if (
      category &&
      category !== "general" &&
      !query.trim()
    ) {

      const categoryWords = {
        business: [
          "business",
          "company",
          "market",
          "economy",
          "startup",
          "industry",
        ],

        sports: [
          "sports",
          "cricket",
          "football",
          "tennis",
          "match",
          "player",
        ],

        technology: [
          "technology",
          "tech",
          "software",
          "ai",
          "artificial intelligence",
          "startup",
        ],

        entertainment: [
          "movie",
          "film",
          "actor",
          "actress",
          "cinema",
          "entertainment",
        ],

        health: [
          "health",
          "hospital",
          "medical",
          "doctor",
          "disease",
        ],

        science: [
          "science",
          "research",
          "space",
          "scientist",
        ],
      };

      const words = categoryWords[category] || [];

      articles = articles.filter((article) => {

        const text = `
          ${article.title || ""}
          ${article.description || ""}
          ${article.content || ""}
        `.toLowerCase();

        return words.some((word) =>
          text.includes(word)
        );
      });
    }

    console.log(
      `FINAL ARTICLES FOR ${city}:`,
      articles.length
    );

    res.json({
      status: "ok",
      location: city,
      category,
      totalResults: articles.length,
      articles,
    });

  } catch (error) {

    console.error(
      "NEWS ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      status: "error",
      error: "Failed to fetch news",
    });
  }
});