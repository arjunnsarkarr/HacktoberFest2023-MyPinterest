var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel = require("./users");
const multer = require('multer')
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));



const path = require('path')
const crypto = require('crypto');
const { compile } = require('ejs');

// photo upload setup

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(13, function (err, buff) {
      const fn = buff.toString('hex') + path.extname(file.originalname)
      cb(null, fn)
    })
  }
})


function fileFilter(req, file, cb) {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/webp") {
    cb(null, true)
  }
  else {
    cb(new Error('I don\'t have a clue!'), false);
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

// photo upload
router.post('/upload', isLoggedIn, upload.single('image'), async function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedinUser) {
      console.log(typeof (loggedinUser.photo))
      loggedinUser.photo.push(req.file.filename)
      loggedinUser.save()
        .then(function () {
          res.redirect('/profile')
          // console.log("Boom");
        })
    })
})


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
})
);

router.get('/create', function (req, res, next) {
  res.render('create');
});

router.post('/created', function (req, res, next) {
  var data = new userModel({
    username: req.body.username,
    email: req.body.email
  })
  userModel.register(data, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/profile")
      })
    })

});

router.get("/profile", function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (user) {
      res.render("profile", { user })
    })
})


router.get("/explore", function (req, res) {
  userModel.find().then((all) => {
    res.render("explore", { all })
  })
})

router.get("/savedPhotos", function (req, res) {
  userModel.findOne({username: req.session.passport.user})
  .then((user) => {
    res.render("liked",{  "userLiked"  : user.savedPhotos})
  })
})

router.post("/saveuserphoto",function(req,res){
  // console.log('this is the request body',JSON.stringify(req.body));
  userModel.findOne({ username: req.session.passport.user })
    .then(function (user) {
      user.savedPhotos.push(req.body)-
      user.save()
      res.redirect("/profile")
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
