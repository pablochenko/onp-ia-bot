require('dotenv').config();

const {Payload } = require('dialogflow-fulfillment');

function handleIntentConstanciaAfiliacion(agent) {
   
    console.log('handleIntentUltimoAporte');
    const  dataRes = agent.context.get("set_ultimo_aporte").parameters;
    const numDoc = dataRes.per_num_doc;


    //console.log(dataRes);
    const server_url=process.env.SERVER_URL

 
      //texto = `📄 ¡Tu constancia de pago ${desEmision} ha sido generada!\n👉 ${dataBoletaPagoDwnd.data.url}`;  
     const texto = `📄 ¡Tu constancia de afiliación ha sido generada!\n👉 ${server_url}/download-consulta-afiliado/${numDoc}`;  


    const payload = {
      "telegram": {
          "text": texto,
          "reply_markup": {
            "inline_keyboard": [                
                [{"text": "Regresar al menú principal","callback_data": "menu"}],
                [{"text": "Finalizar conversación","callback_data": "finalizar"}]
              ]
          },
          "parse_mode": "HTML"
        }
      }
    agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 

   

  }
  module.exports = handleIntentConstanciaAfiliacion;