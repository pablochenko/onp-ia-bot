const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');
const v_cronograma = require('../json/cronograma.json'); 
const d = new Date();
/*----------------------------CRONOGRAMA----------------------------------------*/
function cronograma(agent){     
  let texto = '<b>¡Cronograma de pagos '+ d.getFullYear()+'!</b>\nPor favor selecciona el mes que deseas consultar';  
  let payload = set_payload(texto,set_payload_opciones());
  agent.add(new Payload(agent.UNSPECIFIED , payload, {rawPayload: true, sendAsMessage: true}));  
}; 

  
function cronograma_info(agent){        
  const cronograma_mes=agent.parameters.cronograma_mes;  
  let list_opc = [];
  list_opc.push('🗓Cronograma de pagos '+cronograma_mes+' '+ d.getFullYear()+':'); 

  
  let texto = "Por favor selecciona una opción 👇";        
  list_opc.push(new Payload(agent.UNSPECIFIED,set_payload(texto,set_payload_opciones()),{rawPayload: true, sendAsMessage: true}));  

  
  for (const cron of v_cronograma) { 
    if(cronograma_mes == cron.mes_desc){
      list_opc.push(new Card({title:cron.tipo_1, text:cron.tipo_1_desc}));
      list_opc.push(new Card({title:cron.tipo_2, text:cron.tipo_2_desc}));
      list_opc.push(new Card({title:cron.tipo_3, text:cron.tipo_3_desc}));
      list_opc.push(new Card({title:cron.tipo_4, text:cron.tipo_4_desc}));
      list_opc.push(new Card({title:cron.tipo_5, text:cron.tipo_5_desc}));
    }       
  }   
  agent.add(list_opc);     
};
  



function set_payload(texto,inline_keyboard){
  const payload = {"telegram": {"text": texto,
                    "reply_markup": {
                      "inline_keyboard": inline_keyboard
                      },
                    "parse_mode": "HTML"}};     
  return payload;                                  
}

function set_payload_opciones(){
  let mes_actual = d.getMonth(); //0-11
  let opciones = [];
  let meses = [];
  for (const cron of v_cronograma) { 
    if(mes_actual < cron.mes){
      meses.push({"text": cron.mes_desc,"callback_data": cron.mes_desc});
    }       
  } 
  opciones.push(meses);
  opciones.push([{"text": "Regresar al menú principal","callback_data": "menu"}]);
  opciones.push([{"text": "Finalizar conversación","callback_data": "finalizar"}]);
  return opciones;
}


module.exports = {
  cronograma,
  cronograma_info
}