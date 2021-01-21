/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const subscriptionName = 'projects/putti-ktb-inno-bootcamp/subscriptions/inno-sub-1';
const timeout = 600000;

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

function listenForMessages() {
  // References an existing subscription

  const subscriberOptions = {
    flowControl: {
      maxMessages: 50,
    },
  };

  //const subscription = pubSubClient.subscription(subscriptionName, subscriberOptions);
  const subscription = pubSubClient.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}


listenForMessages();