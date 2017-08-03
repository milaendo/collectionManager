const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const recordsModel = require("./models/records")

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: false }))

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


app.listen(3000, function(){
  console.log("App running on port 3000")
})