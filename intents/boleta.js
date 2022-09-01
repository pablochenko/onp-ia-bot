const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const {getBoletaPago} = require('../controllers/boleta');

async function handleIntentBoletaPago(agent) {
    
    console.log('boleta webhook 121111');
    console.log(agent.context.get("2identificacion-valid-followup"));

    //const servicios = agent.parameters.servicios;
    const anio = agent.parameters.anio;
    const mes = agent.parameters.mes;
    let per_num_doc = agent.context.get("2identificacion-valid-followup").parameters.per_num_doc;
    const dataBoletaPago = await getBoletaPago(per_num_doc,anio,mes);
    console.log(dataBoletaPago);

    let texto='';
    if(dataBoletaPago.status)
    {
     const parametros = {'anio': anio, 'per_num_doc': per_num_doc, 'mes': mes };
    // console.log(parametros);
    // console.log(dataBoletaPago);
    texto = `Descargue su boleta de pago :  ${dataBoletaPago.data.url}
    Selecciona una de las siguientes opciones:`;  

  }else
  {
    texto = `${dataBoletaPago.mensaje} de su Resoluciones.`;  
  }

  const payload = {
    "telegram": {
        "text": texto,
        "reply_markup": {
          "inline_keyboard": [
            [{"text": "Consultar Boleta de Pago", "callback_data": "boleta"}],
            [{ "text": "Obtener Resolucion", "callback_data": "resolucion" }]
            [{"text": "Consultar Boleta de Pago", "callback_data": "boleta"}],
            [{ "text": "Otras consultas", "callback_data": "otras_consultas" }],                  
            [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
            [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
          ]
        }
      }
    }
agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 



  
  }

  module.exports = handleIntentBoletaPago;