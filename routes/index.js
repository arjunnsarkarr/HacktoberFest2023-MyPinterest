var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel = require("./users");
const localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/home', function(req, res, next) {
  res.render('home');
});

router.get('/create', function(req, res, next) {
  res.render('create');
});

router.post('/created', function(req, res, next) {
  var data = new userModel({
    username : req.body.username,
    email:req.body.email
  })
  userModel.register(data , req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/profile")
    })
  })

});

router.get("/profile", isLoggedIn , function (req,res){
  userModel.findOne({ username : req.session.passport.user })
  .then(function(user){
    res.render("profile", {user})
  })
})



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/login');
  }
}


module.exports = router;
