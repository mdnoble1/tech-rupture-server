const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crviidq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // database collection
    const productCollection = client.db("techRuptureDB").collection("products");
    const reviewCollection = client.db("techRuptureDB").collection("reviews");
    const userCollection = client.db("techRuptureDB").collection("users");




    // get all products from database and all the queries should be performed here 
    app.get("/products", async (req, res) => {
      const productOwner = req.query.product_owner;
      const tag = req.query.tag;


      // Creating an empty query object
      let query = {};

      // Checking for "product_owner"
      if (productOwner) {
          query.product_owner = productOwner;
       }

      // Checking for "tag"
      if (tag) {
        query.tag = tag;
      }


      
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });


    // get all users from database 
    app.get("/users" , async (req, res ) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    

    // query for product details
    app.get("/products/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { "_id": new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });


    // get reviews data from database using query based on product name 
    app.get("/reviews", async (req, res) => {
      const productName = req.query.product_name;
      const query = {product_name: productName}
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });


    // get product data from database using query in this way is so wrong way , I have to do it all together like in the top

    // app.get("/products", async (req, res) => {
    //   const productOwner = req.query.product_owner;
    //   const query = {product_owner: productOwner}
    //   const result = await productCollection.find(query).toArray();
    //   res.send(result);
    // });


   

    // adding a review in database 
    app.post("/reviews", async (req, res ) => {
      const reviewItem = req.body;
      const result = await reviewCollection.insertOne(reviewItem);
      res.send(result);
    })  


    // adding a new product in database 
    app.post("/products", async (req, res ) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    })


    // adding a new user in database 
    app.post("/users", async (req, res ) => {
      const user = req.body;
      const query = {email: user.email};

      // check if user already exist 

      const existingUser = await userCollection.findOne(query);

      if(existingUser){
        return res.send({message : 'user already exist' ,insertedId: null})
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    // make admin api using patch method 
    app.patch('/users/admin/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      
      const updateDoc = {
        $set: {
          role: "admin"
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // make moderator api using patch method 
    app.patch('/users/moderator/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      
      const updateDoc = {
        $set: {
          role: "moderator"
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tech Rupture Server Is Running");
});

app.listen(port, () => {
  console.log(`Tech Rupture Is Running On Port: ${port}`);
});
