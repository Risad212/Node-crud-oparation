const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

//====================
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 


// const password = 'admin123'



app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html')
})



//=========================================
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin123@cluster0.uppua.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("database").collection("productItems");

  app.get('/products', (req, res) =>{
    collection.find({})
    .toArray((error, documents) => {
       res.send(documents)
    })
  })

  // add product
  //================================
  app.post('/addProduct', (req, res) =>{
    const product = req.body
    collection.insertOne(product)
    .then(result => {
      console.log('data added succesfully')
      res.redirect('/')
     })
 })

 //===================================
 // delate method
app.delete('/delate/:id', (req, res) =>{
  collection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result =>{
    res.send(result.deletedCount > 0)
  })
})

 //===================================
 // update product
app.patch('/update/:id',(req, res) =>{
  collection.updateOne({_id: ObjectId(req.params.id)},
    {
     $set: {price: req.body.price, quantity: req.body.quantity}
    }
  )
  .then(result => {
     res.send(result.modifiedCount > 0)
  })
})


 //===================================
 // load product
app.get('/product/:id', (req, res) =>{
  collection.find({_id: ObjectId(req.params.id)})
  .toArray((error, document) =>{
    res.send(document[0])
  })
})



});

 
  
//============================================
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})