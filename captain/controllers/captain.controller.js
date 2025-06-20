const captainModel = require("../models/captain.model");
const blacklisttokenModel = require("../models/blacklisttoken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Subscribe to the ride service to listen for new rides
const {subscribeToQueue}=require('../service/rabbit')

const pendingRequests = []

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const captain = await captainModel.findOne({ email });

    if (captain) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newCaptain = new captainModel({ name, email, password: hash });

    await newCaptain.save();

    const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    // Remove password from response
    const captainObj = newCaptain.toObject();
    delete captainObj.password;

    res.send({ token, captain: captainObj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, captain.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    // Remove password from response
    const captainObj = captain.toObject();
    delete captainObj.password;

    res.send({ token, captain: captainObj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    await blacklisttokenModel.create({ token });
    res.clearCookie("token");
    res.send({ message: "Captain logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.profile = async (req, res) => {
    try {
        if (!req.captain) {
            return res.status(401).json({ message: 'Unauthorized: No captain found' });
        }
        const captain = req.captain.toObject ? req.captain.toObject() : { ...req.captain };
        delete captain.password;
        res.send(captain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports.toggleAvailability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    res.send(captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// We're using long polling to reduce server load and keep the implementation simple. It works well for scenarios like drivers waiting for new rides. If we needed high-frequency real-time interaction (e.g., live tracking), we’d switch to WebSockets like socket.io.

module.exports.waitForNewRide = async (req, res) => {
    // Set timeout for long polling (e.g., 30 seconds)
    req.setTimeout(30000, () => {
        res.status(204).end(); // No Content
    });

    // Add the response object to the pendingRequests array
    pendingRequests.push(res);
};

subscribeToQueue("new-ride", (data) => {
    const rideData = JSON.parse(data);

    // Send the new ride data to all pending requests
    pendingRequests.forEach(res => {
        res.json(rideData);
    });

    // Clear the pending requests
    pendingRequests.length = 0;
});
