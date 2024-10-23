const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//user login functions
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: "username not exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance,
        role: user.role,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

//register
const registerUser = async (req, res) => {
  const { username, password, btc_address } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      res.status(400).json({ msg: "user already exists" });
    }
    user = new User({
      username,
      password,
      btc_address,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance,
        role: user.role,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
