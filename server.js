const amqp = require("amqplib");
// 

async function consumeMessages() {
  // Connect to the rabbitmq server
  const connection = await amqp.connect("amqp://localhost");

  // Create a new channel
  const channel = await connection.createChannel();

  // Create the exchange
  await channel.assertExchange("logExchange", "direct");

  // Create the queue
  const q = await channel.assertQueue("InfoQueue");

  // Bind the queue to the exchange
  await channel.bindQueue(q.queue, "logExchange", "Info");

  // Consume messages from the queue
  channel.consume(q.queue, (msg) => { 
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
}

consumeMessages();