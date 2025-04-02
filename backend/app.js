const express = require("express");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const app = express();

app.use(express.json());

AWS.config.update({ region: "us-west-2" });
const ssm = new AWS.SSM();

// Function to fetch a parameter
async function getParameter(paramName) {
  const params = {
    Name: paramName,
    WithDecryption: true,
  };

  try {
    const { Parameter } = await ssm.getParameter(params).promise();
    return Parameter.Value;
  } catch (err) {
    console.error("Error fetching parameter:", err);
    return null;
  }
}

// Load configuration from Parameter Store
async function loadConfig() {
  process.env.JWT_SECRET = await getParameter("/my-backend/jwt-secret");
}

// Middleware to authenticate tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Public endpoint
app.get("/public", (req, res) => {
  res.send("Public Data");
});

// Private endpoint that requires authentication
app.get("/private", authenticateToken, (req, res) => {
  res.send("Private Data");
});

// Start the server only after configuration is loaded
loadConfig()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Failed to load configuration:", error);
  });
