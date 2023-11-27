const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Tech Rupture Server Is Running");
  });
  
  app.listen(port, () => {
    console.log(`Tech Rupture Is Running On Port: ${port}`);
  });