const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const v_sedes = require('../json/sedes.json'); 
const v_sedes_horarios = require('../json/sedes_horarios.json'); 
const v_departamentos = require('../json/departamentos.json'); 

function sedes_horarios(agent) {     
  let texto = '<b>¡Sedes y horarios de atención!</b>\nPor favor selecciona la región que deseas consultar';  
  let opciones = payload_opciones();
  const payload = {
    "telegram": {
        "text": texto,
        "reply_markup": {
          "inline_keyboard": opciones
        },
        "parse_mode": "HTML"
      }
    }
  agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));
  
  agent.context.set({ name: 'set_menu', lifespan: 1, parameters: {} });  
  agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {}});   
}

function payload_opciones(){  
  let _departamentos = v_departamentos;
  _departamentos.sort( (a, b) => {    
    if (a.departamento.toUpperCase() < b.departamento.toUpperCase()) return -1;
    if (a.departamento.toUpperCase() > b.departamento.toUpperCase()) return 1;
    return 0;
  });
  let opciones = [];
  let departamentos = [];
  departamentos.push({"text": "LIMA METROPOLITANA","callback_data": "LIMA_METROP"});
  departamentos.push({"text": "LIMA PROVINCIAS","callback_data": "LIMA_PROV"});
  opciones.push(departamentos);
  departamentos = [];  
  departamentos.push({"text": "CALLAO","callback_data": "CALLAO"});
  for (const dep of _departamentos) { 
    if (dep.departamento.toUpperCase() != 'LIMA' && dep.departamento.toUpperCase() != 'PROV.CONST.CALLAO') {
      departamentos.push({"text": dep.departamento,"callback_data": dep.departamento});    
    }
    if(departamentos.length == 4){
      opciones.push(departamentos);
      departamentos = [];
    }       
  } 
  if(departamentos.length >0)opciones.push(departamentos);  
  opciones.push([{"text": "Regresar al menú principal","callback_data": "menu"}]);
  opciones.push([{"text": "Finalizar conversación","callback_data": "finalizar"}]);
  return opciones;
}


function sedes_horarios_info(agent) {         
    const sede_region=agent.parameters.sede_region;  
    //const contextIn = agent.getContext('identificacion-followup');
    //const per_nombre = contextIn.parameters.per_nombre;
    agent.add(`¡Conoce nuestras sedes en ${sede_region}!`); 
    for (const sede of v_sedes_horarios) {   
      if((sede_region.toUpperCase() == (sede.ubigeo.departamento).toUpperCase()) || 
         (sede_region.toUpperCase() == 'LIMA_METROP' && (sede.ubigeo.provincia).toUpperCase()== 'LIMA') ||
         (sede_region.toUpperCase() == 'LIMA_PROV' && (sede.ubigeo.departamento).toUpperCase()== 'LIMA'&& (sede.ubigeo.provincia).toUpperCase()!= 'LIMA')|| 
         (sede_region.toUpperCase() == 'CALLAO' && (sede.ubigeo.departamento).toUpperCase()== 'PROV.CONST.CALLAO') ){
        let direccion = (sede.direccion == 'S/D')? (sede.ubigeo.departamento+' - '+sede.ubigeo.provincia+' - '+sede.ubigeo.distrito) : (sede.direccion+'\n'+sede.ubigeo.departamento+' - '+sede.ubigeo.provincia+' - '+sede.ubigeo.distrito);
        let horario = (sede.horarioLv == 'S/D')? 'Sin datos': ('\nHorario de atención: '+sede.horarioLv);
        let mapa = (sede.maps == 'S/D')? 'Sin datos': `https:\/\/maps.google.com\/maps?daddr=${sede.latitud},${sede.longitud}&ll=`;
        let imagen = (sede.foto == 'S/D')? 'Sin datos': sede.foto;
        agent.add(new Card({
            title: sede.tipoCentroAtencion.tipoCentroAtencion + ' - '+ sede.centroAtencion,
            text: direccion+'\n'+horario,
            imageUrl: imagen,
            buttonText: 'Ver en Maps',
            buttonUrl: mapa
          })
        );
      }     
    }    
    /*
    let opciones = payload_opciones(); 
    const payload = {"telegram": {"text": "<b>¡Conoce nuestras sedes y horarios de atención a nivel nacional!</b>Selecciona la región que deseas consultar:",
                        "reply_markup": {
                          "inline_keyboard": opciones
                        },"parse_mode": "HTML"
                      } }; 
    agent.add(new Payload(agent.UNSPECIFIED , payload, {rawPayload: true, sendAsMessage: true}));  */
    agent.context.set({ name: 'set_menu', lifespan: 1, parameters: {} });  
    agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {}});   
  }

  module.exports = {
    sedes_horarios,
    sedes_horarios_info
}