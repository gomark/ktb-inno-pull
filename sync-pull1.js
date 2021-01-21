/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = 'putti-ktb-inno-bootcamp';
const subscriptionName = 'inno-sub-2';

// Imports the Google Cloud client library. v1 is for the lower level
// proto access.
const {v1} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use.
const subClient = new v1.SubscriberClient();

async function synchronousPullWithLeaseManagement() {
  const formattedSubscription = subClient.subscriptionPath(
    projectId,
    subscriptionName
  );

  // The maximum number of messages returned for this request.
  // Pub/Sub may return fewer than the number specified.
  const maxMessages = 1;
  const newAckDeadlineSeconds = 30;
  const request = {
    subscription: formattedSubscription,
    maxMessages: maxMessages,
  };

  let isProcessed = false;

  // The worker function is meant to be non-blocking. It starts a long-
  // running process, such as writing the message to a table, which may
  // take longer than the default 10-sec acknowledge deadline.
  function worker(message) {
    console.log(`Processing "${message.message.data}"...`);

    /*
    setTimeout(() => {
      console.log(`Finished procesing "${message.message.data}".`);
      isProcessed = true;
    }, 30000);
    */
  }

  while (true) {
    console.log("waiting for message..");

    try {
        // The subscriber pulls a specified number of messages.
        const [response] = await subClient.pull(request);

        // Obtain the first message.  

        const message = response.receivedMessages[0];

        // Send the message to the worker function.
        worker(message);
        console.log("done1");
        const ackRequest = {
            subscription: formattedSubscription,
            ackIds: [message.ackId],
        };
        await subClient.acknowledge(ackRequest);
        console.log(`Acknowledged: "${message.message.data}".`);
    } catch (error) {
        console.error(error);
    }


  }

  /*
  let waiting = true;
  while (waiting) {
    await new Promise(r => setTimeout(r, 10000));
    // If the message has been processed..
    if (isProcessed) {
      const ackRequest = {
        subscription: formattedSubscription,
        ackIds: [message.ackId],
      };

      //..acknowledges the message.
      await subClient.acknowledge(ackRequest);
      console.log(`Acknowledged: "${message.message.data}".`);
      // Exit after the message is acknowledged.
      waiting = false;
      console.log('Done.');
    } else {
      // If the message is not yet processed..
      const modifyAckRequest = {
        subscription: formattedSubscription,
        ackIds: [message.ackId],
        ackDeadlineSeconds: newAckDeadlineSeconds,
      };

      //..reset its ack deadline.
      await subClient.modifyAckDeadline(modifyAckRequest);

      console.log(
        `Reset ack deadline for "${message.message.data}" for ${newAckDeadlineSeconds}s.`
      );
    }
  }
  */
}

synchronousPullWithLeaseManagement().catch(console.error);