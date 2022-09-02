require('dotenv').config();
//const token = process.env.WHATSAPP_TOKEN;

const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()); // creates express http server


const { createBot } =require ('whatsapp-cloud-api');

const token = process.env.WHATSAPP_TOKEN;
const from = '103713755779208';
const to = '51948363889';
const webhookVerifyToken = process.env.VERIFY_TOKEN;;
//const bot = createBot(from, token);

//app.listen(process.env.PORT || 3000, () => console.log("webhook is listening"));


// (async () => {
//   try {
//     console.log('wsp');
//     // replace the values below

//     // Create a bot that can send messages

//     // Send text message
 //const result = await bot.sendText(to, 'Hello world pablo chenko 2022');

//     // Start express server to listen for incoming messages
//     // NOTE: See below under `Documentation/Tutorial` to learn how
//     // you can verify the webhook URL and make the server publicly available
//    /*
//     await bot.startExpressServer({
//       webhookVerifyToken,
//     });

//     // Listen to ALL incoming messages
//     // NOTE: remember to always run: await bot.startExpressServer() first
//     bot.on('message', async (msg) => {
//       console.log(msg);

//       if (msg.type === 'text') {
//         await bot.sendText(msg.from, 'Received your text message!');
//       } else if (msg.type === 'image') {
//         await bot.sendText(msg.from, 'Received your image!');
//       }
//     });
// */

//   } catch (err) {
//     console.log(err);
//   }
// })();

app.post("/webhook", (req, res) => {

  const bot = createBot(from, token);

  // Parse the request body from the POST
/*
  bot.on('message', async (msg) => {
    console.log(msg);

    if (msg.type === 'text') {
      await bot.sendText(msg.from, 'Received your text message!');
    } else if (msg.type === 'image') {
      await bot.sendText(msg.from, 'Received your image!');
    }
  });
*/
  let body = req.body;

  // Check the Incoming webhook message
  //console.log(JSON.stringify(req.body, null, 2));

  //const msjWsp=JSON.stringify(req.body, null, 2);

  //console.log(msjWsp.entry[0].changes)
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {

    //let phone_number_id =req.body.entry[0].changes[0].value.metadata.phone_number_id;
    let dataMsj=req.body.entry[0].changes[0].value.messages[0];
    let from = dataMsj.from; // extract the phone number from the webhook payload
    let msg_body =dataMsj.text.body; // extract the message text from the webhook payload
    //console.log(phone_number_id)
    console.log(from)
    console.log(msg_body)
 // Send text message
    const result = bot.sendText(from,`¡Bienvenida/o a la ONP! 
    🌟 Mi nombre es Olivia, la asistente virtual de la ONP. 🤖 
    ¿En que te puedo ayudar?`);


    }
  }

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  /*
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Ack: " + msg_body },
        },
        headers: { "Content-Type": "application/json" },
      });
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
*/

});



app.get("/webhook", (req, res) => {
  console.log('web-1');
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === webhookVerifyToken) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.listen(process.env.PORT)
