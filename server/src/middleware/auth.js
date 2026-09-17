import jwt from "jsonwebtoken";

// Protects any route it's attached to. Expects:
// Authorization: Bearer <token>
export default function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // attach user id to the request for later routes
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
