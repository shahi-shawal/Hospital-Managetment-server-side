const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middeleware
app.use(express.json())
app.use(cors())

// shahishawal
// rKoC313vM9lCtafh




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jhvdrnw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
      client.connect()
      console.log('DB Connected Successfully✅')
  } catch (error) {
      console.log(error.name, error.message)
  }
}
dbConnect()



const database = client.db("Health-lab");
const recomenedCollection = database.collection("recomenedCollection");
const testsCollection = database.collection("testsCollection");
const userCollection = database.collection("userCollection")
const bannerCollection= database.collection("bannerCollection")
const bookCollection = database.collection("bookCollection")  
const reportCollection = database.collection("reportCollection")  


app.get("/banner", async(req, res)=>{
  const result = await bannerCollection.find().toArray()
  res.send(result)
})

app.post("/banner", async(req, res)=>{
  const banner= req.body
  const result = await bannerCollection.insertOne(banner)
  res.send(result)
})

app.delete("/banner/:id", async(req, res)=>{
  const id = req.params.id
  const query={_id: new ObjectId(id)}
  const result = await bannerCollection.deleteOne(query)
  res.send(result) 
})

app.patch("/banner/:id", async(req, res)=>{
  const id =req.params.id
  const filter ={}
  // const filter = {_id: new ObjectId(id)}
  const updatedDoc ={
    $set:{
      isActive:"true"
    }
  }
   await bannerCollection.updateMany({}, {$set:{isActive:"false"}})
  if (id) {
    filter._id= new ObjectId(id)
    const result = await bannerCollection.updateOne(filter, updatedDoc)
    res.send(result)
  }
 
  
})


app.get("/recomanded", async(req, res)=>{
      const result =await recomenedCollection
      .find().toArray()
      console.log(result.length);
      res.send(result)
  })

// users 

app.post("/users", async(req, res)=>{
  const user= req.body;
  const result = await userCollection.insertOne(user)
  console.log(result)
  res.send(result) 
})

app.get("/users", async(req, res)=>{
  const result = await userCollection.find().toArray()
  res.send(result)
})
app.get("/users/:email", async(req, res)=>{
  const email = req.params.email
  const query ={email: email}
  const result = await userCollection.findOne(query)
  res.send(result)
})


app.get("/users/admin/:email", async(req, res)=>{
  const email= req.params.email
  const filter = {email : email}
  const user = await userCollection.findOne(filter)
  let admin = false
  if (user) {
    admin = user?.role === "admin"
  }
  res.send({admin}) 
})


app.delete("/users/:id", async(req, res)=>{
  const id = req.params.id
  const query={_id: new ObjectId(id)}
  const result= await userCollection.deleteOne(query)
  res.send(result)
})


app.patch("/users/admin/:id", async(req, res)=>{
  const id = req.params.id
  const filter = {_id: new ObjectId(id)}
  const updatedDoc={
    $set:{
      role :"admin"
    }
  }
  const result = await userCollection.updateOne(filter, updatedDoc)
  res.send(result)
})
app.patch("/users/block/:id", async(req, res)=>{
  const id = req.params.id
  const filter = {_id: new ObjectId(id)}
  const updatedDoc={
    $set:{
      status :"block"
    }
  }
  const result = await userCollection.updateOne(filter, updatedDoc)
  res.send(result)
})
app.patch("/users/active/:id", async(req, res)=>{
  const id = req.params.id
  const filter = {_id: new ObjectId(id)}
  const updatedDoc={
    $set:{
      status :"active"
    }
  }
  const result = await userCollection.updateOne(filter, updatedDoc)
  res.send(result)
})


  app.get("/tests", async(req, res)=>{
     const filter=req.query
     console.log(filter);
     let query ={}
     if (filter.search) {
      query = {date
        : {
        $regex:`${filter.search}`, $options:"i"
      }}
     } 
      const result =await testsCollection
      .find(query).toArray()
      console.log(result.length);
      res.send(result)
  })

app.post("/tests", async(req, res)=>{
  const test=req.body
  const result = await testsCollection.insertOne(test)
  res.send(result)
})


app.get("/tests/:id", async(req, res)=>{
  const id = req.params.id
  const query= {_id: new ObjectId(id)}
  const result= await testsCollection.findOne(query)
  res.send(result)
})
app.delete("/tests/:id", async(req, res)=>{
  const id = req.params.id
  const query= {_id: new ObjectId(id)}
  const result= await testsCollection.deleteOne(query)
  res.send(result)
})

app.put("/tests/:id", async(req, res)=>{
  const id = req.params.id
  const test= req.body
  const filter= {_id: new ObjectId(id)}
  const updatedDoc ={
    $set:{
      name:test.name,
      price:test.price,
      date:test.date,
      slots:test.slots,
      timeslots: test.timeslots,
      description:test.description,
      image:test.image
    }
  }
  const result = await testsCollection.updateOne(filter,updatedDoc)
  res.send(result)
})

app.patch("/test/:id", async(req, res)=>{
  const id = req.params.id
  const filter = {_id: new ObjectId(id)}
  const updatedDoc={
    $inc:{
      slots:-1,
      book: 1
    }
  }
  const result = await testsCollection.updateOne(filter,updatedDoc)
  res.send(result)
})


// booked api
app.post("/testbook", async(req, res)=>{
  const test = req.body
  const result = await bookCollection.insertOne(test)
  res.send(result)
})
app.get("/testbook", async(req, res)=>{
  const filter=req.query
     console.log(filter);
     let query ={}
     if (filter.search) {
      query = {'patientemail'
        : {
        $regex:`${filter.search}`, $options:"i"
      }}
      
     } 
     console.log(query)
  const result = await bookCollection.find(query).toArray()
  res.send(result)
})
app.get("/testbook/:patientemail", async(req, res)=>{
  const patientemail= req.params.patientemail
  const query={patientemail:patientemail}
  const result = await bookCollection.find(query).toArray()
  res.send(result)
})
app.delete("/testbook/:id", async(req, res)=>{
  const id= req.params.id
  const query={_id:new ObjectId(id)}
  const result = await bookCollection.deleteOne(query)
  res.send(result)
})

app.patch("/testbook/re/:id", async(req,res)=>{
  const id = req.params.id
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const updatedDoc={
    $set:{
      reportStatus:"delivered"
    }

  }
  console.log(updatedDoc);
  const result = await bookCollection.updateOne(filter, updatedDoc, options)
  res.send(result)
})

app.post("/report", async(req, res)=>{
  const report = req.body
  const result = await reportCollection.insertOne(report)
  res.send(result)
})

app.get("/report", async(req, res)=>{
  const result = await reportCollection.find().toArray()
  res.send(result)
})


app.get("/", (req, res) => {
    res.send("Health Lab is Runing");
  });



  app.listen(port, () => {
    console.log(`Health Lab is Running on port ${port}`);
  });
  