const express = require('express');
const cors = require('cors');
const app= express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

// Assignment-10-user
// JXftFADpdrv7PmYY




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cojxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const formCollection=client.db("formDB").collection("formCollection")
    const formCollection2=client.db("formDB").collection("formCollection2")

    app.post("/apply",async(req,res)=>{
        const form=req.body;
        const result = await formCollection2.insertOne(form);
        res.send(result)
        console.log(form)
    })
    
    app.get("/form",async(req,res)=>{
        const cursor = formCollection.find().sort({ _id: -1 }).limit(6);
        const result= await cursor.toArray();
        res.send(result)
    })

    app.get("/all-visa",async(req,res)=>{
        const cursor = formCollection.find().sort({ _id: -1 });
        const result= await cursor.toArray();
        res.send(result)
    })
    // delete my added visa 
    app.delete("/all-visa/:id",async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result=await formCollection.deleteOne(query)
        res.send(result)
    })
    // update my added visa 
    app.put("/all-visa/:id",async(req,res)=>{
        const id=req.params.id;
        const data=req.body;
        const query={_id: new ObjectId(id)}
        const update={
            $set:{
                CName:data?.CName,
                CImage:data?.CImage,
                selectedType:data?.selectedType2,
                PTime:data?.PTime,
                Age:data?.Age,
                Fee:data?.Fee,
                Validity:data?.Validity,
                Method:data?.Method,
            }
        }
        const result=await formCollection.updateOne(query,update)
        res.send(result)
    })
// get details data 
    app.get("/details/:id",async(req,res)=>{
        
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result=await formCollection.findOne(query)
        res.send(result)
    })
    // get added visa by a user 

    app.get("/added-visa/:email",async(req,res)=>{
        
        const email=req.params.email;
        const query={contributor: email}
        const result=await formCollection.find(query).sort({ _id: -1 }).toArray()
        res.send(result)
    })

    app.post("/form",async(req,res)=>{
        const form=req.body;
        const result = await formCollection.insertOne(form);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Visa server is running")
})

app.listen(port,()=>{
    console.log(`Visa server is running on port: ${port}`)
})