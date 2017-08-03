const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/records')


const recordSchema = new mongoose.Schema ({
	albumName : {type: String, required: true, uniquie: true},
	bandName: {type:String, required: true},
	releaseDate: {type: Date},
	recordLabel: [{
		labelName: {type: String}, 
		address: {type:String},
	}],
	topHits: {type:String, default:1,}
})

const Record = mongoose.model('Records', recordSchema)

function addNewrecord(recordJSON){
	let record = new Record(recordJSON)
	record.save()
	.then (function(){
		console.log("success")
	})
	.catch(function(){
		console.log("oh poop")
	})
}

//let record = new Record({albumName:"exodus", bandName:"Bob Marley & The Wailers", releaseDate:1977-06-03, topHits: "One Love"}



module.exports = {
	Record : Record,
	addNewrecord: addNewrecord
}
