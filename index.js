require('dotenv').config();
const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const base64 = require('base64topdf');


const {cronograma,cronograma_info} = require('./intents/cronograma');
const welcome = require('./intents/bienvenida');
const {handleIntentIdentificacion,handleIntentIdentificacionValid} = require('./intents/identificacion');
const {handleIntentBoletaPago,handleIntentBoletaPagoDownload} = require('./intents/boleta');
const {sedes_horarios,sedes_horarios_info} = require('./intents/sedes');
const {handleIntentPResolucion,handleIntentPResolucionDetalle,handleIntentPResolucionDownload} = require('./intents/pensionista-resolucion');

const {handleIntentClaveVirtual,handleIntentClaveVirtualCrear,handleIntentClaveVirtualRecuperar,handleIntentClaveVirtualValidUser} = require('./intents/clave-virtual');
const handleIntentUpdateDatos = require('./intents/update-datos');

const {getTokenLoginValid,getValidDni}= require('./controllers/clave-virtual');

const handleIntentConstanciaAfiliacion = require('./intents/constancia-afiliacion');

//mesa de ayuda


const {mesa_menu,mesa_appens_menu,mesa_appens_respuesta}= require('./intents/mesa-aplicativo');


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
function sleep(time){
  return new Promise(resolve => setTimeout(resolve.time));
}

function resolveAfter2Seconds(x) {
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 200);
  });


}

async function add1(agent) {
  console.log('demo esperar')

  const a = await resolveAfter2Seconds('demo');
  console.log(a)
agent.add('webhook- time out');
agent.setFollowupEvent('identificacion');



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

 app.get('/download-consulta-afiliado/:nudoc', (req, res) => {

  let nudoc = req.params.nudoc;
  const namePdf=`consulta_de_afiliacion_${nudoc}.pdf`;  
  const file =`${__dirname}/${namePdf}`; 
  console.log(file);
  res.download(file);   
   })


app.get('/', (req, res) => {
res.send("servidor funcionando..212.xx-01")
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
  let texto = `Estimado(a) asegurado(a), estos son los servicios disponibles mediante este canal.🤝\nSelecciona el servicio que desees consultar:`;  
  const payload = {
        "telegram": {
            "text": texto,
            "reply_markup": {
              "inline_keyboard": [
                [{"text": "Consultar información de mi cuenta","callback_data": "identificacion"}],
                [{"text": "Solicitar o recuperar mi Clave virtual", "callback_data": "clave_virtual"}],
                [{"text": "Consultar el cronograma de pagos","callback_data": "cronograma"}],
                [{"text": "Conocer las Sedes y los horarios de atención","callback_data": "sedes_horarios"}],
                [{"text": "Soy un servidor de ONP","callback_data": "usuario_interno"}],                 
                [{"text": "Finalizar conversación","callback_data": "finalizar"}]   
              ]
            },"parse_mode": "HTML"
          }
        }
  agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));
}

/*
    let parametros = {
      'per_num_doc': per_num_doc,
      'per_tipo_doc': per_tipo_doc,
      'token': tokenJwt.data,
      'id_user': datDec.UserId,
      'type_user': datDec.TypeUser,
      'name_user': datDec.Name,
      'fullname_user': datDec.FullName
    };
*/
function menu_asegurado(agent) {
  //let parametros = {};
  const identificacion = agent.context.get("set_menu_asegurado").parameters;
  //const identificacion = dataRes.identificacion;
  //let parametros = identificacion;

  if (identificacion.type_user == 'P') {
    inline_keyboard = [
      [{ "text": "Obtener Constancia de Pago", "callback_data": "boleta" }],
      [{ "text": "Consultar Resolucion", "callback_data": "resolucion" }],
      [{ "text": "Actualizar correo y/o teléfono", "callback_data": "actualizacion_ficha_asegurado" }],
      [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
      [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
    ];
  } else if (datDec.type_user == 'A' || datDec.type_user == 'NA') {
    inline_keyboard = [
      [{ "text": "Constancia de afiliación", "callback_data": "constancia_afiliacion" }],
      [{ "text": "Actualizar correo y/o teléfono", "callback_data": "actualizacion_ficha_asegurado" }],
      
      [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
      [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
    ];
  }

  const texto = `${identificacion.name_user}, selecciona el servicio que desees consultar:`;  
  //const texto = `Pensionista selecciona el servicio que desees consultar:`; 
  const payload = {
        "telegram": {
            "text": texto,
            "reply_markup": {
            "inline_keyboard": inline_keyboard
            },"parse_mode": "HTML"
          }
        }
  agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));
  agent.context.set({ name: 'set_boleta', lifespan: 1, parameters: identificacion });
  agent.context.set({ name: 'set_resolucion', lifespan: 1, parameters: identificacion });
  agent.context.set({ name: 'set_actualizacion', lifespan: 1, parameters: identificacion });

  agent.context.set({ name: 'set_constancia_afiliacion', lifespan: 1, parameters: identificacion });

  agent.context.set({ name: 'set_menu', lifespan: 1, parameters: {} });
  agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {} });
}
/*
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
*/

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
  intentMap.set('2.1.1 Boletas de Pago Descargar', handleIntentBoletaPagoDownload);

  intentMap.set('2.2 Resolucion Pensionista', handleIntentPResolucion);
  intentMap.set('2.2.1 Resolucion Pensionista Detalle', handleIntentPResolucionDetalle);
  intentMap.set('2.2.1.1 Resolucion Pensionista Download', handleIntentPResolucionDownload);
  intentMap.set('2.3 Actualizacion datos', handleIntentUpdateDatos);
  //intentMap.set('2.5 Ultimo Aporte', handleIntentUltimoAporte);
  intentMap.set('2.4 Constancia Afiliacion', handleIntentConstanciaAfiliacion);

  

  intentMap.set('4 Cronograma de pagos', cronograma);
  intentMap.set('4.1 Cronograma de pagos - info', cronograma_info);
  intentMap.set('5 Sedes y horarios', sedes_horarios);
  intentMap.set('5.1 Sedes y horarios - info', sedes_horarios_info);

  intentMap.set('3 Clave virtual', handleIntentClaveVirtual);
  intentMap.set('3.1 Clave virtual - crear', handleIntentClaveVirtualCrear);
  intentMap.set('3.2 Clave virtual - recuperar', handleIntentClaveVirtualRecuperar);
  intentMap.set('3.2.1 Clave virtual - recuperar - valid', handleIntentClaveVirtualValidUser);


  intentMap.set('timeout', add1);

  //intentMap.set('3.1 Clave virtual - crear', handleIntentClaveVirtualRecuperar);

  intentMap.set('Cierra sesion', cierra_sesion);
  intentMap.set('Menu principal', menu_principal);
  intentMap.set('Menu asegurado', menu_asegurado);

//Mesa de ayuda
  intentMap.set('Mesa menu', mesa_menu);
  //intentMap.set('Appens menu', appens_menu);
 // intentMap.set('Mesa aplicativo', mesa_aplicativo);

  
  intentMap.set('Mesa Appens menu', mesa_appens_menu);
  intentMap.set('Mesa Appens respuesta', mesa_appens_respuesta);
  
  
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT)
