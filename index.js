const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


require('dotenv').config()
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vb0ze04.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        const tasksCollection = client.db('taskoo').collection('allTasks');
        const usersCollection = client.db('taskoo').collection('users');
        const completedCollection = client.db('taskoo').collection('completedTasks');




         // post tasks
         app.post('/tasks', async(req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task)
            res.send(result)
        })

        // post users
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

         // get tasks by email
         app.get('/tasks', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const tasks = await tasksCollection.find(query).toArray();
            res.send(tasks)
        })

        // post completed tasks
        app.post('/completed', async(req, res) => {
            const task = req.body;
            const result = await completedCollection.insertOne(task)
            res.send(result)
        })

        // get completed tasks by email
        app.get('/completed', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const tasks = await completedCollection.find(query).toArray();
            res.send(tasks)
        })

        app.delete('/completed/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await completedCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/completed', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await completedCollection.findOne(query)
            res.send(result)
        })


    }
    finally{

    }
}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('taskoo server running')
})

app.listen(port, () => {
    console.log(`taskoo server running on port${port}`)
})