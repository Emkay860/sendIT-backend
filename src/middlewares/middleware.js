import User from "../models/user.model";

// Verify Token
// Token Comes in the Form
// Authorization: "Bearer <access_token>""

function verifyToken(req, res, next) {
  // Get the auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split bearer token at the space in between
    const bearer = bearerHeader.split(" ");
    // Get token from split bearer array
    const bearerToken = bearer[1];
    // Set token
    req.token = bearerToken;
    // Go to next middleware
    next();
  } else {
    // Access Denied
    res.sendStatus(403);
  }
}

// Verify user role
// User role is sent in the request body as a string
function verifyRole(req, res, next) {
  // Get user_id from request body
  const user_id = req.body.user_id;
  //   Check if user_id is not equal undefined
  if (typeof user_id !== "undefined") {
    //   Fetch user role from database with the given user_id
    User.findById(user_id)
      .then((user) => {
        // Check if user role is not admin
        if (user.role !== "admin") {
          // Access denied
          res.sendStatus(401);
        } else {
          next();
        }
      })
      .catch((err) => res.sendStatus(403));
  } else {
    res.sendStatus(401);
  }
}

export default { verifyToken, verifyRole };
