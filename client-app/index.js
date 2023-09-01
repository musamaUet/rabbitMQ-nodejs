const express = require("express");
const amqp = require('amqplib');

const app = express();

var connection, channel;

connectQueue();

async function connectQueue() {
    try {
        connection = await amqp.connect('amqp://localhost:5672');
        channel = await connection.createChannel();

        channel.assertQueue("test-queue");

        channel.consume("test-queue", (data) => {
            console.log(`Buffer Data${Buffer.from(data.content)}`)
        channel.ack(data);
        });

    } catch(err){
        console.log('client connection err', err);
    }
}

const PORT = process.env.PORT || 4002;
app.use(express.json());
app.listen(PORT, () => console.log("Server running at port " + PORT));