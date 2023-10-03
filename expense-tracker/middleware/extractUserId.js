const jwt = require("jsonwebtoken");
const user = require("../model/user");

async function generateAccessToken(id, name) {
    return jwt.sign(
      { userId: id, name: name },
      "aff135734abed1bf492684a890eb7d59081b5f44b23ded12a7339451b9bc2048"
    );
  }

async function extractUserId(req, res, next) {
    const token = req.header("Authorization");
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing Authorization header" });
    }
  
    try {
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        "aff135734abed1bf492684a890eb7d59081b5f44b23ded12a7339451b9bc2048"
      );
      const userId = decoded.userId;
  
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized - Missing userId" });
      }
  
      // Set userId in the request object for later use
      req.userId = userId;
      next();
    } catch (error) {
      console.log("Error decoding token", error);
      res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  }

module.exports = { extractUserId };