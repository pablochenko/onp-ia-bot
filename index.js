require ('dotenv').config();
const express = require('express')
const {WebhookClient} = require('dialogflow-fulfillment')
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const request = require("request");
const exphbs = require("express-handlebars");
const http = require('https')

const app = express()
app.use(express.json())
//app.engine("handlebars",exphbs());
//app.set("view engine","handlebars");

app.get('/', (req, res) => {
   res.send("servidor 5......")

})


app.post('/webhook', (req, res) => {
    let agent = new WebhookClient({request: req, response: res})
    let intentMap = new Map();
    intentMap.set('Identificacion',handleWebHookIntent)
    agent.handleRequest(intentMap)
})

/*
function handleWebHookIntent(agent){
    agent.add("funcionando desde el webhook")
}
*/
async function handleWebHookIntent(agent){
    // let result = await p;
     agent.add("funcionando desde el webhook 19/08")
  
    // const answer = agent.parameters.number;
    // answers.push(answer);
  
     const payload = {
         "telegram": {
             "text": "hola:",
             "reply_markup": {
               "inline_keyboard": [
                 [
                   {
                     "callback_data": "si",
                     "text": "SI"
                   }
                 ],
                 [
                   {
                     "callback_data": "no",
                     "text": "NO"
                   }
                 ]
               ]
             }
           }
     }
  
     agent.add(
         new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})
     );
  
  
  
 }
 






app.listen(process.env.PORT)