require('dotenv').config();
const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const base64 = require('base64topdf');


const {cronograma,cronograma_info} = require('./intents/cronograma');
const welcome = require('./intents/bienvenida');
const {handleIntentIdentificacion,handleIntentIdentificacionValid} = require('./intents/identificacion');
const handleIntentBoletaPago = require('./intents/boleta');
const sedes_horarios_info = require('./intents/sedes');
const {handleIntentPResolucion,handleIntentPResolucionDetalle,handleIntentPResolucionDownload} = require('./intents/pensionista-resolucion');

const {handleIntentClaveVirtual,handleIntentClaveVirtualRecuperar,handleIntentClaveVirtualValidUser} = require('./intents/clave-virtual');
const handleIntentUpdateDatos = require('./intents/update-datos');

const {getTokenLoginValid,getValidDni}= require('./controllers/clave-virtual');


const app = express()
app.use(express.json())

//getTokenLoginValid(23,'15584790','111111');
async function getDemo() {
  //const tokenLoginValid = await getTokenLoginValid(23,'15584790','111111');
   // const tokenLoginValid = await getValidDni(23,'19209886','14/11/2017',1,'anibal');

  //console.log(tokenLoginValid);*/
  //const datax='';
//  const datax=[{'d':1},{'d':2}];

//console.log(tokenLoginValid)


}

//getDemo();

function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 4000);
  });
}

async function add1(agent) {
  const a = await resolveAfter2Seconds('demo');
  console.log(a)
  agent.add('webhook- time out');
  //return x + a + b;
}

//add1('demo');



app.get('/download-resolucion-pensionista/:id', (req, res) => {

let idres = req.params.id;
//const namePdf='PdfFileNameToWrite.pdf';
const namePdf=`${idres}`;
//const namePdf=`${idres}.pdf`;

const file =`${__dirname}/${namePdf}`; 
console.log(file);
res.download(file);
 
 })

app.get('/', (req, res) => {
res.send("servidor funcionando..2.")
/*
  res.set({
    'Content-Disposition' : 'attachment; filename=demo.pdf',
    'Content-Type': 'application/pdf',
});
*/

//let urlbase64

//let decodedBase64 = base64.base64Decode(urlbase64, 'aaaa.pdf');
//res.send(decodedBase64)
//res.send(Buffer.from(urlbase64, 'base64'));

})

function cierra_sesion(agent){

}
function menu_principal(agent) {
  let texto = `
            <b>Menú principal </b>
Selecciona el servicio que desees consultar:`;  
  const payload = {
        "telegram": {
            "text": texto,
            "reply_markup": {
              "inline_keyboard": [
                [{"text": "Consultar información de mi cuenta","callback_data": "identificacion"}],
                [{"text": "Solicitar o recuperar mi Clave virtual", "callback_data": "clave_virtual"}],
                [{"text": "Consultar el cronograma de pagos","callback_data": "cronograma"}],
                [{"text": "Conocer las Sedes y los horarios de atención","callback_data": "sedes_horarios"}]
              ]
            },"parse_mode": "HTML"
          }
        }
  agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));
}

app.post("/webhookx", (request, response) => {

  console.log('webhookx')

  let tag = request.body.fulfillmentInfo.tag;
  let jsonResponse = {};
  if (tag == "inicio") {
    //fulfillment response to be sent to the agent if the request tag is equal to "welcome tag"
    jsonResponse = {
      fulfillment_response: {
        messages: [
          {
            text: {
              //fulfillment text response to be sent to the agent
              text: ["Hi! This is a webhook response"]
            }
          }
        ]
      }
    };
  } else {
    jsonResponse = {
      //fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
      fulfillment_response: {
        messages: [
          {
            text: {
              ////fulfillment text response to be sent to the agent
              text: [
                `There are no fulfillment responses defined for "${tag}"" tag`
              ]
            }
          }
        ]
      }
    };
  }
  response.json(jsonResponse);
});

app.post('/webhook', (req, res) => {
  let agent = new WebhookClient({ request: req, response: res })

  //console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  //console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

  let intentMap = new Map();
  intentMap.set('1 Inicio Bienvenida', welcome);
  intentMap.set('Default Welcome Intent', welcome);

  intentMap.set('2 Identificacion', handleIntentIdentificacion);
  intentMap.set('2 Identificacion - valid', handleIntentIdentificacionValid);

  intentMap.set('2.1 Boletas de Pago', handleIntentBoletaPago);
  intentMap.set('2.2 Resolucion Pensionista', handleIntentPResolucion);
  intentMap.set('2.2.1 Resolucion Pensionista Detalle', handleIntentPResolucionDetalle);
  intentMap.set('2.2.1.1 Resolucion Pensionista Download', handleIntentPResolucionDownload);
  intentMap.set('2.3 Actualizacion datos', handleIntentUpdateDatos);

  intentMap.set('4 Cronograma de pagos', cronograma);
  intentMap.set('4.1 Cronograma de pagos - info', cronograma_info);
  intentMap.set('5.1 Sedes y horarios - info', sedes_horarios_info);

  intentMap.set('3 Clave virtual', handleIntentClaveVirtual);
  intentMap.set('3.2 Clave virtual - recuperar', handleIntentClaveVirtualRecuperar);
  intentMap.set('3.2.1 Clave virtual - recuperar - valid', handleIntentClaveVirtualValidUser);


  intentMap.set('timeout', add1);

  //intentMap.set('3.1 Clave virtual - crear', handleIntentClaveVirtualRecuperar);

  intentMap.set('Cierra sesion', cierra_sesion);
  intentMap.set('Menu principal', menu_principal);
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT)