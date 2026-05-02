const express = require("express");
const app = express();

app.use(express.json());
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  console.log(req.user);
  try {
    if (!validateEditProfileData(req)) {
      //console.log(req);
      throw new Error("Invalid Edit Request");
    }


    const loggedInUser = req.user;
    
     if (req.body.skills) {
      loggedInUser.skills.push(req.body.skills);
      delete req.body.skills;
    }

    
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = {profileRouter};