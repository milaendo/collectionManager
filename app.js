const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const recordsModel = require("./models/records")
const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy
const session = require('express-session')


app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: false }))
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.authenticate(username, password, function(err, user) {
            if (err) {
                return done(err)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: "There is no user with that username and password."
                })
            }
        })
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/login/', function(req, res) {
    res.render("login", {
    });
});
app.post('/login/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login/',
    failureFlash: true
}))
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})
const requireLogin = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login/');
  }
}
app.get('/secret/', requireLogin, function (req, res) {
  res.render("secret");
})

app.get("/", function(req, res, next){
	recordsModel.Record.find({})
	.then(function(Record){
		res.render("index")
		console.log(Record)
	})
	.catch(function(error){
		console.log("opps")
	})
})
app.post("/insert",function(req,res,next){
	let recordJSON = {
		albumName: req.body.albumName,
		bandName: req.body.bandName,
		releaseDate: req.body.releaseDate,
		topHits: req.body.topHits
	}
	recordsModel.addNewrecord(recordJSON)
	res.redirect("/records")
})
app.get("/records", function(req,res,next){
	recordsModel.Record.find()
	.then(function(Record){
		res.render("records",{records:Record})
		console.log(Record)
	})
	.catch(function(error){
		console.log(error)
		res.send("AHHH")
		console.log("done")
	})
})
app.get("/edit/record/:id", function(req, res, next){
	let id = req.params.id
	let query = {_id:id}
	recordsModel.Record.findOne(query)
	.then (function(info){
		res.render('./edit', info)
	})
	.catch (function(error){
		console.log("broken")
	})

})

app.post("/edit/record", function(req,res,next){
	let data = {}
	data._id = req.body._id
	console.log(req.body)
	data.albumName = req.body.albumName
	data.bandName = req.body.bandName
	data.topHits = req.body.topHits

	let query = {_id:data._id}
	console.log(query)
	let update = {
		"$set": {"bandName": data.bandName, "albumName": data.bandName, "topHits": data.topHits}
	}
	console.log(update)
	recordsModel.Record.update(query,update)
	.then(function(){
		res.redirect("/records")
	})
	.catch(function(error){
		console.log("error")
	})
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})


// todo add in passport 