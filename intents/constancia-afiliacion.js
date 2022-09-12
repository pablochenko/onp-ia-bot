require('dotenv').config();

const {Payload } = require('dialogflow-fulfillment');

function handleIntentConstanciaAfiliacion(agent) {
   
  const identificacion = agent.context.get("set_constancia_afiliacion").parameters;
  const token = identificacion.token;






    console.log('handleIntentUltimoAporte');
    //const  dataRes = agent.context.get("set_ultimo_aporte").parameters;
    const numDoc = identificacion.per_num_doc;


    //console.log(dataRes);
    const server_url=process.env.SERVER_URL

 
      //texto = `📄 ¡Tu constancia de pago ${desEmision} ha sido generada!\n👉 ${dataBoletaPagoDwnd.data.url}`;  
     const texto = `📄 ¡Tu constancia de afiliación ha sido generada!\n👉 ${server_url}/download-consulta-afiliado/${numDoc}`;  


    const payload = {
      "telegram": {
          "text": texto,
          "reply_markup": {
            "inline_keyboard": [                
                [{"text": "Regresar al menú anterior","callback_data": "menu_asegurado"}],
                [{"text": "Finalizar conversación","callback_data": "finalizar"}]
              ]
          },
          "parse_mode": "HTML"
        }
      }
    agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 
    agent.context.set({ name: 'set_menu_asegurado', lifespan: 1, parameters: identificacion });  
    agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {}});   
   

  }
  module.exports = handleIntentConstanciaAfiliacion;