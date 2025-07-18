const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// Mongo setup
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return { client: cachedClient, db: cachedDb };

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.atq4j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  const db = client.db("Footprints");
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

// GET api for packages
app.get("/packages", async (req, res) => {
  const { db } = await connectToDatabase();
  const packages = await db.collection("package_collection").find({}).toArray();
  res.json(packages);
});
// GET api for specific package
app.get("/packages/:id", async (req, res) => {
  const { db } = await connectToDatabase();
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const package = await db.collection("package_collection").findOne(query);
  res.json(package);
});

// GET api for blog
app.get("/blogs", async (req, res) => {
  const { db } = await connectToDatabase();
  const blogs = await db.collection("blog_collection").find({}).toArray();
  res.json(blogs);
});
// GET api for reviews
app.get("/reviews", async (req, res) => {
  const { db } = await connectToDatabase();
  const reviews = await db.collection("review_collection").find({}).toArray();
  res.json(reviews);
});
// GET api for orders
app.get("/orders", async (req, res) => {
  const { db } = await connectToDatabase();
  const orders = await db.collection("order_collection").find({}).toArray();
  res.json(orders);
});

// POST: Add a new package
app.post("/add-a-package", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const data = req.body;
    const result = await db.collection("package_collection").insertOne(data);
    res.status(201).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add package", details: err.message });
  }
});

// POST: Add a new blog
app.post("/blogs", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const data = req.body;
    const result = await db.collection("blog_collection").insertOne(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to add blog", details: err.message });
  }
});

// POST: Add a new review
app.post("/reviews", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const data = req.body;
    const result = await db.collection("review_collection").insertOne(data);
    res.status(201).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add review", details: err.message });
  }
});

// POST: Place a new order
app.post("/placeorder", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const data = req.body;
    const result = await db.collection("order_collection").insertOne(data);
    res.status(201).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to place order", details: err.message });
  }
});

// DELETE: Delete an order by ID
app.delete("/orders/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await db.collection("order_collection").deleteOne(query);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete order", details: err.message });
  }
});

// PUT: Update order status to 'Approved'
app.put("/orders/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: { orderStatus: "Approved" },
    };
    const options = { upsert: true };
    const result = await db
      .collection("order_collection")
      .updateOne(filter, updateDoc, options);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update order", details: err.message });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
}
// Export the handler
const serverless = require("serverless-http");
module.exports = serverless(app);
