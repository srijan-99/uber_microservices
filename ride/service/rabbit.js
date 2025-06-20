const amqp = require('amqplib'); // Import RabbitMQ library

const RABBITMQ_URL = process.env.RABBITMQ_URL; // RabbitMQ server URL from environment
console.log('RABBITMQ_URL:', process.env.RABBITMQ_URL);

let connection, channel; // Will hold the connection and channel objects

// Connects to RabbitMQ and creates a channel
async function connect() {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
}

// Subscribes (listens) to a queue and runs a callback when a message arrives
async function subscribeToQueue(queueName, callback) {
    if (!channel) await connect(); // Ensure connection/channel exists
    await channel.assertQueue(queueName); // Make sure the queue exists
    channel.consume(queueName, (message) => {
        callback(message.content.toString()); // Run the callback with the message data
        channel.ack(message); // Tell RabbitMQ the message was processed
    });
}

// Publishes (sends) a message to a queue
async function publishToQueue(queueName, data) {
    if (!channel) await connect(); // Ensure connection/channel exists
    await channel.assertQueue(queueName); // Make sure the queue exists
   channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
}

// Export the functions so other files can use them
module.exports = {
    subscribeToQueue,
    publishToQueue,
    connect,
};