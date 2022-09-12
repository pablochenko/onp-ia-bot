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

  
  agent.context.set({ name: 'set_sede_info', lifespan: 1, parameters: {} });
  agent.context.set({ name: 'set_menu', lifespan: 1, parameters: {} });
  agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {} });
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
  if(departamentos.length >0){opciones.push(departamentos);  }
  
  opciones.push([{"text": "Regresar al menú principal","callback_data": "menu"}]);
  opciones.push([{"text": "Finalizar conversación","callback_data": "finalizar"}]);
  
  return opciones;
}


function sedes_horarios_info(agent) {         
    const sede_region=agent.parameters.sede_region;  
    let list_opc = [];
    //agent.add(`¡Conoce nuestras sedes en ${sede_region}!`); 
    
    //list_opc.push(new Text(`¡Conoce nuestras sedes en ${sede_region}!`)); 
    for (const sede of v_sedes) {   
      if((sede_region.toUpperCase() == (sede.region).toUpperCase()) || 
         (sede_region.toUpperCase() == 'LIMA METROPOLITANA' && (sede.provincia).toUpperCase()== 'LIMA') ||
         (sede_region.toUpperCase() == 'LIMA PROVINCIA' && (sede.region).toUpperCase()== 'LIMA'&& (sede.provincia).toUpperCase()!= 'LIMA') || 
         (sede_region.toUpperCase() == 'CALLAO' && (sede.region).toUpperCase()== 'CALLAO')){
        let direccion = (sede.direccion == 'S/D')? (sede.region+' - '+sede.provincia+' - '+sede.distrito) : (sede.direccion+'\n'+sede.region+' - '+sede.provincia+' - '+sede.distrito);
        let horario = (sede.horario == 'S/D')? 'Sin datos': ('\nHorario de atención: '+sede.horario);
        let mapa = (sede.maps == 'S/D')? 'Sin datos': sede.maps;
        let imagen = (sede.imagen == 'S/D')? 'Sin datos': sede.imagen;
        list_opc.push(new Card({
          title: sede.tipo + ' - '+ sede.descripcion,
          text: direccion+horario,
          imageUrl: imagen,
          buttonText: 'Ver en Maps',
          buttonUrl: mapa
        }));
        /*agent.add(new Card({
            title: sede.tipo + ' - '+ sede.descripcion,
            text: direccion+horario,
            imageUrl: imagen,
            buttonText: 'Ver en Maps',
            buttonUrl: mapa
          })
        );*/
      }      
    }     
    let opciones=[];
    opciones.push([{"text": "Regresar al menú principal","callback_data": "menu"}]);
    opciones.push([{"text": "Finalizar conversación","callback_data": "finalizar"}]);

    const payload = {
      "telegram": {
          "text": 'texto',
          "reply_markup": {
            "inline_keyboard": opciones
          },
          "parse_mode": "HTML"
        }
      }
    list_opc.push(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));
    agent.add(list_opc);

    /*agent.add(new Card({
        title: '¡Gracias por usar nuestros canales digitales!',
        text: 'Selecciona la siguiene opción para retornar al menú principal ',
        buttonText: 'Menú principal',
        buttonUrl: 'menu'
      })
    );*/
    
    agent.context.set({ name: 'set_menu', lifespan: 1, parameters: {}});
    agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {} });

  }



  module.exports = {
    sedes_horarios,
    sedes_horarios_info
}