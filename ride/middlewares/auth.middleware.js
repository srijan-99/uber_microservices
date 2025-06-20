const jwt = require("jsonwebtoken");
const axios = require("axios");

//Middleware to authenticate user
module.exports.userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Ride service se user Service ka data lene ke liye axios ka use kiya hai
    //ye hota h synchronous communication
    //Advantage:Immediately response miljaata hai

    //Disadvantage:Ride service ka response user service ke response par depend karega

    const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Middleware to authenticate captain
module.exports.captainAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const response = await axios.get(
      `${process.env.BASE_URL}/captain/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const captain = response.data;

    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.captain = captain;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
