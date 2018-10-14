var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const Project=require('../models/projects');

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

var usersend="";
// Register User
router.post('/register', function(req, res){
    usersend = req.body.username;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;

		var newUser = new User({
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

        res.status(201).json({
            status: true,
			email: req.body.email,
			username: req.body.username,
            message: 'user registered successfull'

        })

});

passport.use(new LocalStrategy(
  function(username, password, done) {
  	usersend=username;
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
	  console.log(usersend);
	  console.log("came inside login");
      res.status(201).json({
          status: true,
		  username: usersend,
          message: 'user authentication successfull'

      })
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});


router.post('/postProject', function(req, res){
	console.log("inside post");
    console.log(usersend);
	var username = "ashwin17893";
    var title = req.body.title;
    var description = req.body.desc;
    var skills = req.body.skills;
    var budget = req.body.budget;

    var Proj = new Project({
		username:username,
        title:title,
        description: description,
        skills: skills,
		budget: budget
    });

    console.log(Proj);
    Proj.save(function (err, results){

        if(err)
        {
            res.json({msg: "Failed to post Project"});
        }

        else
		{
            res.status(201).json({
                status: true,
                message: 'Project Post successfull'

            })

		}

    });


});

module.exports = router;