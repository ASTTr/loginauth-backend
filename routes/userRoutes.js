const userManager = require("../managers/userManager.js");
const router = require("express").Router();

router.post("/SignInUser", userManager.SignInUser);
router.get("/logoutUser", userManager.logoutUser);
router.get("/loginedUser", userManager.loginedUser);
router.post("/signUp", userManager.signUp);
router.post("/verifyEmail", userManager.verifyEmail);

module.exports = router;
