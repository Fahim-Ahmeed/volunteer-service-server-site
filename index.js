const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
console.log(process.env.DB_PASS)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const pass = 'VolunteerNetworks79';

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9obvp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection("volunteerWorks");
  const memberCollection = client.db(`${process.env.DB_NAME}`).collection("membersCollection")
  // perform actions on the collection object
  console.log('database connected')
  //   client.close();
  app.get('/allWorks', (req, res) => {
    collection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    console.log(err)
    console.log('data loaded successfully')
  })


  app.post('/addMember', (req, res) => {
    const newMember = req.body;
    console.log(newMember)
    memberCollection.insertOne(newMember)
      .then(result => {
        if (result.insertedCount > 0) {
          res.send(result)
        }
        console.log('data updated successfully')
      })

  })

  app.get('/reviewWork', (req, res) => {
      memberCollection.find({email: req.query.email})
      .toArray((err, documents)=> {
        res.send(documents)
    })
  })
  app.delete(`/deleteWork/:id`, (req, res) => {
    memberCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount>0)
        console.log('delete successfully')
      })
  })
  app.get('/allMembers', (req, res) => {
    memberCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    console.log(err)
    console.log('all member loaded successfully')
  })

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log(newEvent)
    collection.insertOne(newEvent)
      .then(result => {
        if (result.insertedCount > 0) {
          res.send(result)
        }
        console.log('event added successfully')
      })

  })
});
app.get('/',(req, res)=>{
  res.send('all is ok')
})
app.listen(process.env.PORT || 4000);