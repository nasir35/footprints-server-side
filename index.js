const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.atq4j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('Database connected!');
        const database = client.db('Footprints');
        const packageCollection = database.collection('package_collection');
        const blogCollection = database.collection('blog_collection');
        const reviewCollection = database.collection('review_collection');
        const orderCollection = database.collection('order_collection');

        // GET api for packages
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });
        // GET api for specific package
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const package = await packageCollection.findOne(query)
            res.send(package);
        });

        // GET api for blog
        app.get('/blogs', async(req, res) => {
            const cursor = blogCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        });
        // GET api for reviews
        app.get('/reviews', async(req, res) => {
            const cursor = reviewCollection.find({}).limit(8);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        // GET api for orders
        app.get('/orders', async(req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });


        // POST api for adding package
        app.post('/add-a-package', async(req, res) => {
            const data = req.body;
            const result = await packageCollection.insertOne(data);
            res.send(result);
        });
        // POST api for adding blogs
        app.post('/blogs', async(req, res) => {
            const data = req.body;
            const result = await blogCollection.insertOne(data);
            res.send(result);
        });
        // POST api for adding reviews
        app.post('/reviews', async(req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.send(result);
        });
        // POST api for adding order
        app.post('/placeorder', async(req, res) => {
            const data = req.body;
            const result = await orderCollection.insertOne(data);
            res.send(result);
        });

        //DELETE api for order
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });

        //UPDATE api for order status
        app.put('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id : ObjectId(id)};
            const options = { upsert : true};
            const updateDoc = {
                $set: {
                    orderStatus : 'Approved'
                },
            };
            const result = await orderCollection.updateOne(filter,updateDoc,options);
            res.send(result);
        });

    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to the server of Footprints!')
})

app.listen(port, () => {
    console.log('server running on port: ', port);
})