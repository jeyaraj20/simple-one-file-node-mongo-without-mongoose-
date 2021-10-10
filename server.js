
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

// add your db name in databaseName
MongoClient.connect('mongodb://localhost/databaseName', (err, database) => {
  if (err) return console.log(err)
  db = database.db('star-wars-quotes')
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//for get all data 
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.json( {quotes: result})
  })
})
//for get single data 

app.post('/getSingleData', (req, res) => {
    db.collection('quotes').findOne({_id:req.body.id}).toArray((err, result) => {
      if (err) return console.log(err)
      res.json( {quotes: result})
    })
  })
// for post data
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.json( {message: "data saved in db"})
  })
})
// for update data
app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({_id: req.body.id}, req.body, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

//for delete data
app.post('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({_id: req.body._id}, (err, result) => {
    if (err) return res.send(500, err)
    res.json( {message: "data got deleted from db"})
  })
})
