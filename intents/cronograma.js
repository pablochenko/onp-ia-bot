const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');
const v_cronograma = require('../json/cronograma.json'); 
const d = new Date();
/*----------------------------CRONOGRAMA----------------------------------------*/
function cronograma(agent){     
  let texto = '<b>¡Cronograma de pagos '+ d.getFullYear()+'!</b>\nPor favor selecciona el mes que deseas consultar';  
  agent.add(set_payload(texto,set_payload_opciones()));
}; 

  
function cronograma_info(agent){        
  const cronograma_mes=agent.parameters.cronograma_mes;  
  let list_opc = [];
  list_opc.push('🗓<u><b>Cronograma de pagos '+cronograma_mes+' '+ d.getFullYear()+':</b></u>'); 
  for (const cron of v_cronograma) { 
    if(cronograma_mes == cron.mes_desc){
      list_opc.push(set_payload("<i><b>"+cron.tipo_1+"</b></i>\n"+cron.tipo_1_desc,[]));
      list_opc.push(set_payload("<i><b>"+cron.tipo_1+"</b></i>\n"+cron.tipo_1_desc,[]));
      list_opc.push(set_payload("<i><b>"+cron.tipo_2+"</b></i>\n"+cron.tipo_2_desc,[]));
      list_opc.push(set_payload("<i><b>"+cron.tipo_3+"</b></i>\n"+cron.tipo_3_desc,[]));
      list_opc.push(set_payload("<i><b>"+cron.tipo_4+"</b></i>\n"+cron.tipo_4_desc,[]));
      list_opc.push(set_payload("<i><b>"+cron.tipo_5+"</b></i>\n"+cron.tipo_5_desc,[]));
    }       
  }   
  let texto = "Por favor selecciona una opción 👇";        
  list_opc.push(set_payload(texto,set_payload_opciones()));  
  agent.add(list_opc);     
  
};
  
function set_payload(texto,inline_keyboard){
  const payload = {"telegram": {"text": texto,
                    "reply_markup": {
                      "inline_keyboard": inline_keyboard
                      },
                    "parse_mode": "HTML"}};                  
  return new Payload(agent.UNSPECIFIED , payload, {rawPayload: true, sendAsMessage: true});  
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