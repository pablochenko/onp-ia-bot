require('dotenv').config();

const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');
const { getResoluciones, getResolucionesDetalle, getResolucionDonwload } = require('../controllers/pensionista/servicios');

async function handleIntentPResolucion(agent) {
  console.log('handleIntentPResolucion')

  const identificacion = agent.context.get("set_resolucion").parameters;
  const token = identificacion.token;
  const dataResoluciones = await getResoluciones(token);

  if(dataResoluciones.codigo!='0000'){//mensaje de error
    console.log('error')
    const payload = {
      "telegram": {
        "text": dataResoluciones.mensaje,
        "reply_markup": {
          "inline_keyboard": [
            [{ "text": "Regresar al menú anterior", "callback_data": "menu_asegurado" }],
            [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
          ]
        }, "parse_mode": "HTML"
      }
    };
    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
  }
  console.log(dataResoluciones)

  if (dataResoluciones.status && dataResoluciones.codigo == '0000') {
    const expedientes = dataResoluciones.data;
    let texto = '<b>¡Consulta de resoluciones!</b>\nEstimado(a) asegurado(a), selecciona el expediente 🗂️ al que deseas acceder:';
    let inline_keyboard = [];
    for (const cron of expedientes) {
      inline_keyboard.push([{ "text": `⚖️ Ley: ${cron.CodigoLey} - Expediente: ${cron.NumeroExpediente}`, "callback_data": cron.NumeroExpediente }]);
    }
    const parametros = { 'expedientes': expedientes, 
                          'identificacion': identificacion };    
    const payload = {
      "telegram": {
        "text": texto,
        "reply_markup": {
          "inline_keyboard": inline_keyboard
        }, "parse_mode": "HTML"
      }
    };
    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
    agent.context.set({ name: 'set_resolucion_det', lifespan: 1, parameters: parametros });  
  }  
  agent.context.set({ name: 'set_menu_asegurado', lifespan: 1, parameters: identificacion });  
  agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {} });  
}

async function handleIntentPResolucionDetalle(agent) {
  const data = agent.context.get("set_resolucion_det").parameters;
  const identificacion = data.identificacion;
  const expedientes = data.expedientes;

  const token = identificacion.token;
  const nuRes = agent.parameters.num_resolucion;

  const filterDataRes = expedientes.filter(x => x.NumeroExpediente == nuRes);//VALIDAR SI NO COICIDE DATOS

  const dataRes = filterDataRes[0];
  const dataResDetalle = await getResolucionesDetalle(token, dataRes.ExisteDocumentos, dataRes.CodigoLey, dataRes.NumeroExpediente, dataRes.IdExpediente);

  if (dataResDetalle.status && dataResDetalle.codigo == '0000') {
    console.log('ok-dataResDetalle');
    const dataPens = dataResDetalle.data.DatosCabecera;
    const resoluciones = dataResDetalle.data.DatosDetalle;
    console.log(dataPens);
    console.log(resoluciones);

    let mensaje = '🧾Por favor seleccione la Resolución que desea descargar:\n';
    let inline_keyboard = [];
  
    const parametros = { 'expedientes': expedientes, 
                          'resoluciones': resoluciones,
                          'identificacion': identificacion };
    let texto = mensaje;
    let opciones = payload_opciones(resoluciones);
    const payload = {
      "telegram": {
        "text": texto,
        "reply_markup": {
          "inline_keyboard":opciones
        }
      }
    };
    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));    
    agent.context.set({ name: 'set_resolucion_det', lifespan: 1, parameters: parametros });  
    agent.context.set({ name: 'set_menu_asegurado', lifespan: 1, parameters: identificacion });  
    agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {} });  
  }


}

function payload_opciones(datos){
  let opciones = [];
  let detalle = [];
  let num = 1;
  for (const x of datos) { 
    detalle.push({"text": `Res. ${x.NumeroDocumento}`,"callback_data": num++}); 
    if(detalle.length == 2){
      opciones.push(detalle);
      detalle = [];
    }       
  } 
  if(detalle.length >0) opciones.push(detalle);  
  opciones.push([{"text": "Regresar al menú anterior","callback_data": "menu_asegurado"}]);
  opciones.push([{"text": "Finalizar conversación","callback_data": "finalizar"}]);
  return opciones;
}

async function handleIntentPResolucionDownload(agent) {
  const data = agent.context.get("set_resolucion_dow").parameters;
  const identificacion = data.identificacion;
  const expedientes = data.expedientes;
  const resoluciones = data.resoluciones;
  const token = identificacion.token;
  const nuRes = agent.parameters.codnumres;
  const dataRes = resoluciones[nuRes - 1];
  const dataResDownload = await getResolucionDonwload(token, dataRes.IdDetalle);


  const parametros = { 'expedientes': expedientes, 
                          'resoluciones': resoluciones,
                          'identificacion': identificacion };

  console.log('data');
  console.log(data);

  console.log('dataRes');
  console.log(dataRes);

  console.log('resoluciones');
  console.log(resoluciones);

  console.log(dataResDownload);

  if (dataResDownload.status && dataResDownload.codigo == '0000') {

    const server_url = process.env.SERVER_URL;
    let texto = `¡Tu Resolución ha sido generada! 
    👉 ${server_url}/download-resolucion-pensionista/${dataResDownload.data}`;
    let opciones = payload_opciones(resoluciones);
    const payload = {
      "telegram": {
        "text": texto,
        "reply_markup": {
          "inline_keyboard": opciones
        }, "parse_mode": "HTML"
      }
    };
    agent.add(new Payload(agent.TELEGRAM, payload, { rawPayload: true, sendAsMessage: true }));
   // agent.context.set({ name: 'set_boleta_descargar', lifespan: 1, parameters: expedientes });  
    //agent.context.set({ name: 'set_resolucion_det', lifespan: 1, parameters: expedientes });  

    agent.context.set({ name: 'set_resolucion_dow', lifespan: 1, parameters: parametros });  
    agent.context.set({ name: 'set_menu_asegurado', lifespan: 1, parameters: identificacion });  
    agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {} });   

    
  }





}



module.exports = { handleIntentPResolucion, handleIntentPResolucionDetalle, handleIntentPResolucionDownload };