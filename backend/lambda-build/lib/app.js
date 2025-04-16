const express = require("express");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const AWS = require("aws-sdk");
const app = express();

app.use(express.json());

AWS.config.update({ region: "us-east-1" });
const ssm = new AWS.SSM();

// Function to fetch a parameter from AWS Parameter Store
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

// Load configuration from AWS Parameter Store
async function loadConfig() {
  process.env.JWT_SECRET = await getParameter("/my-backend/jwt-secret");
}

// Set up JWKS client
const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const COGNITO_ISSUER = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;

// Middleware to authenticate tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.COGNITO_CLIENT_ID, // Your Cognito App Client ID
      issuer: COGNITO_ISSUER,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) {
        console.error("JWT Token validation failed:", err);
        return res.status(401).send("Unauthorized");
      }
      req.user = decoded;
      next();
    }
  );
}

// Public endpoint
app.get("/public", (req, res) => {
  res.send("Public Data");
});

// Private endpoint that requires authentication
app.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
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

module.exports = app;
