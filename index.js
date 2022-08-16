require ('dotenv').config();

const express = require('express')
const app = express()

const {WebhookClient} = require('dialogflow-fulfillment');


app.get('/', function (req, res) {
  res.send('Hello Worldxs')
})

app.post('/webhook',express.json, function (req, res) {
 // res.send('Hello Worldx')
 const agent = new WebhookClient({ request:req, response:res });
console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

function welcomex(agent) {
  agent.add(`Welcome to my agent!`);
}

function fallback(agent) {
  agent.add(`I didn't understand`);
  agent.add(`I'm sorry, can you try again?`);
}


function validDatosDni(agent)
{

  agent.add(`URL descargalo`);

 
}

// Run the proper function handler based on the matched Dialogflow intent name
let intentMap = new Map();
intentMap.set('Default Welcome Intent', welcomex);
intentMap.set('Default Fallback Intent', fallback);
intentMap.set('Identificacion', validDatosDni);
// intentMap.set('your intent name here', googleAssistantHandler);
agent.handleRequest(intentMap);

})

app.listen(process.env.PORT)
//actions-on-google
//https://us-central1-newagent-lwhy.cloudfunctions.net/dialogflowFirebaseFulfillment



