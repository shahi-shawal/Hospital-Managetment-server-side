const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middeleware
app.use(express.json())
app.use(cors())

// shahishawal
// rKoC313vM9lCtafh




const uri = "mongodb+srv://shahishawal:rKoC313vM9lCtafh@cluster0.jhvdrnw.mongodb.net/?retryWrites=true&w=majority";

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

    app.get("/recomanded", async(req, res)=>{
      const result =await recomenedCollection
      .find().toArray()
      console.log(result.length);
      res.send(result)
  })
  app.get("/tests", async(req, res)=>{
     const filter=req.query
     console.log(filter);
     let query ={}
     if (filter.search) {
      query = {availableDates
        : {
        $regex:`${filter.search}`, $options:"i"
      }}
     } 
      const result =await testsCollection
      .find(query).toArray()
      console.log(result.length);
      res.send(result)
  })

app.get("/tests/:id", async(req, res)=>{
  const id = req.params.id
  const query= {_id: new ObjectId(id)}
  const result= await testsCollection.findOne(query)
  res.send(result)
})



app.get("/", (req, res) => {
    res.send("Health Lab is Runing");
  });



  app.listen(port, () => {
    console.log(`Health Lab is Running on port ${port}`);
  });
  