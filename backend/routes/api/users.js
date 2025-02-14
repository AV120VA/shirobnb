const express = require("express");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

// address, city, state, country, lat, lng, name, description, price

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("Please provide a last name."),
  handleValidationErrors,
];

//signup user
router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  const checkEmail = await User.findOne({ where: { email } });

  if (checkEmail) {
    return res.status(500).json({
      message: "User already exists",
      errors: {
        email: "User with that email already exists",
      },
    });
  }

  const checkUsername = await User.findOne({ where: { username } });

  if (checkUsername) {
    return res.status(500).json({
      message: "User already exists",
      errors: {
        email: "User with that username already exists",
      },
    });
  }

  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
