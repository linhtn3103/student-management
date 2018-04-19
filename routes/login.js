var router = require("express").Router();
const passport = require("passport");

/* GET home page. */
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard"); 
  }
  else res.render("login");
});

router.post("/", 
  passport.authenticate("local-login", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureFlash: true
  })
);

module.exports = router;
