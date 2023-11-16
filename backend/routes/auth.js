const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser=require("../middleware/fetchuser")
const router = express.Router();

jwt_secret = "kdjifknifhi";
// ROUTE:1 craete  a user using :POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "Enter valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    try {
      // check the user already exists or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success, error: "User already Exist" });
      }

      var salt = await bcrypt.genSaltSync(10);
      const secPassword = await bcrypt.hashSync(req.body.password, salt);

      // create a user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });

      data = {
        user: {
          id: user.id,
        },
      };
     
      var authtoken = jwt.sign(data, jwt_secret);
      res.json({success:true, authtoken });

      // catch the error
    } catch (err) {
      console.error(err.message);
      res.send(500).send("error occured");
    }
  }
);

// ROUTE:2  Authenticate the user by Using Post:"/api/auth/login"

router.post(
  "/login",
  [
    body("email", "please enter the valid email").isEmail(),
    body("password", "Please enter the correct password")
      .notEmpty()
      .isLength(5),
  ],
  async (req, res) => {
    let success=false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({success, error: error.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({success, error: "please enter the correct creadential" });
      }
      let comparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!comparePassword) {
        return res
          .status(400)
          .json({success, error: "please enter the correct creadential" });
      }

      data = {
        user: {
          id: user.id,
        },
      };

      var authtoken = jwt.sign(data, jwt_secret);
      res.json({success:true, authtoken });
    } catch (err) {
      console.log(err);
      res.send("some internal error in the database");
    }
  }
);


// ROUTE:3  getuser  by Using Post:"/api/auth/getuser"

router.post(
    "/getuser",fetchuser,async (req, res) => {
  
     
  
      try {
       let userId=await req.user.id;
        let user = await User.findById(userId).select("-password")
       res.send(user)
      } catch (err) {
        console.log(err);
        res.send("some internal error in the database");
      }
    }
  );

module.exports = router;
