require ('dotenv').config();
const express = require('express')
const {WebhookClient} = require('dialogflow-fulfillment')

const app = express()
app.use(express.json())


app.get('/', (req, res) => {
    res.send("Server Is Working 2......")
})
/**
* on this route dialogflow send the webhook request
* For the dialogflow we need POST Route.
* */

app.post('/webhook', (req, res) => {
    // get agent from request
    let agent = new WebhookClient({request: req, response: res})
    // create intentMap for handle intent
    let intentMap = new Map();
    // add intent map 2nd parameter pass function
    intentMap.set('Identificacion',handleWebHookIntent)
    // now agent is handle request and pass intent map
    agent.handleRequest(intentMap)
})


function handleWebHookIntent(agent){
    agent.add("Hello I am Webhook demo How are you...")
}


app.listen(process.env.PORT)

