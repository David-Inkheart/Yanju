import amqplib, { Connection } from 'amqplib';
import { sendEmail } from '../../services/email/email';

const queue = 'email';

let connection: Connection | undefined;
let channel: any;

const connect = async () => {
  try {
    if (!connection) {
      connection = await amqplib.connect(process.env.RABBITMQ_URL!);
    }
    channel = await connection.createChannel();
  } catch (error) {
    throw new Error('Could not connect to RabbitMQ');
  }
};

const startConsumer = async () => {
  await connect();
  channel.consume(queue, async (msg: amqplib.ConsumeMessage | null) => {
    try {
      if (msg) {
        const stringMessage = msg.content.toString();
        const msgJSON = JSON.parse(stringMessage);
        await sendEmail(msgJSON);
        channel.ack(msg);
      }
    } catch (error) {
      channel.nack(msg);
    }
  });
};

startConsumer().catch(console.error);
