const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const v_cronograma = require('../json/cronograma.json'); 


/*----------------------------CRONOGRAMA----------------------------------------*/
function cronograma(agent){    
    let texto = `<b>¡Cronograma de pagos 2022!</b>
Por favor selecciona el mes que deseas consultar`;  
    const payload = {
          "telegram": {
              "text": texto,
              "reply_markup": {
                "inline_keyboard": [
                  [{"text": "Agosto","callback_data": "Agosto"},
                  {"text": "Septiembre", "callback_data": "Septiembre"},
                  {"text": "Octubre","callback_data": "Octubre"},
                  {"text": "Noviembre","callback_data": "Noviembre"},
                  {"text": "Diciembre","callback_data": "Diciembre"}],
                  [{"text": "Regresar al menú principal","callback_data": "menu"}],
                  [{"text": "Finalizar conversación","callback_data": "finalizar"}]
                ]
              },"parse_mode": "HTML"
            }
          }
    agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));
  }; 
  
  function cronograma_info(agent){        
    const cronograma_mes=agent.parameters.cronograma_mes;  

   /// const contexto = '4cronogramadepagos-followup'; //MINUSCULAS 
    //const parametros = {'cron': 1};


    let mensaje = '<u><b>Cronograma de pagos '+cronograma_mes+' 2022:</b></u>🗓💸\n'; 
    for (const cron of v_cronograma) { 
      if(cronograma_mes == cron.mes){
        mensaje = mensaje+"\n<i><b>"+cron.a+"</b></i>\n"+cron.aa+"\n----------";
        mensaje = mensaje+"\n<i><b>"+cron.b+"</b></i>\n"+cron.bb+"\n----------";
        mensaje = mensaje+"\n<i><b>"+cron.c+"</b></i>\n"+cron.cc+"\n----------";
        mensaje = mensaje+"\n<i><b>"+cron.d+"</b></i>\n"+cron.dd+"\n----------";    
        mensaje = mensaje+"\n<i><b>"+cron.e+"</b></i>\n"+cron.ee;   
      }       
    }           
    const payload = { "telegram": {"text": mensaje,
                      "reply_markup": {
                                  "inline_keyboard": [
                                    [{"text": "Agosto","callback_data": "Agosto"},
                                    {"text": "Septiembre", "callback_data": "Septiembre"},
                                    {"text": "Octubre","callback_data": "Octubre"},
                                    {"text": "Noviembre","callback_data": "Noviembre"},
                                    {"text": "Diciembre","callback_data": "Diciembre"}],
                                    [{"text": "Regresar al menú principal","callback_data": "menu"}],
                                    [{"text": "Finalizar conversación","callback_data": "finalizar"}]
                                  ]
                                },
                      "parse_mode": "HTML"}};   
    agent.add(new Payload(agent.UNSPECIFIED , payload, {rawPayload: true, sendAsMessage: true}));

   // agent.context.set({ name: contexto, lifespan: 2, parameters: parametros });

    
    
  };     

  module.exports = {
    cronograma,
    cronograma_info
}