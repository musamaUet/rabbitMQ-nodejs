const express = require("express");
const amqp = require('amqplib');

var channel, connection;

const app = express();
app.use(express.json());

connectQueue();
async function connectQueue() {
    try{
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel();

        await channel.assertQueue('test-queue');
    } catch(err) {
        console.log('connectQueue error', err);
    }
}

async function sendData(data) {
    // send data to Queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
    await channel.close();
    await connection.close();
}

app.get("/send-msg", (req, res) => {
    
    const data = {
        title  : "Six of Crows",
        author : "Leigh Burdugo"
    }
    sendData(data);
    
    res.send("Message Sent!")
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log("Server running at port " + PORT));