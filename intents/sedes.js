const { Card, Suggestion, Payload,Text } = require('dialogflow-fulfillment');
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
    const sede_region=agent.parameters.sede_reg;  
    let list_opc = [];
    list_opc.push(`¡Conoce nuestras sedes en ${sede_region}!`); 
    let contador = 0;
    for (const sede of v_sedes_horarios) {   
      if((sede_region.toUpperCase() == (sede.ubigeo.departamento).toUpperCase()) || 
         (sede_region.toUpperCase() == 'LIMA METROPOLITANA' && (sede.ubigeo.provincia).toUpperCase()== 'LIMA') ||
         (sede_region.toUpperCase() == 'LIMA PROVINCIA' && (sede.ubigeo.departamento).toUpperCase()== 'LIMA'&& (sede.ubigeo.provincia).toUpperCase()!= 'LIMA') || 
         (sede_region.toUpperCase() == 'CALLAO' && (sede.ubigeo.departamento).toUpperCase()== 'PROV.CONST.CALLAO')){
        contador++;
        let titulo='';
        if(sede.tipoCentroAtencion.idTipoCentroAtencion == 1){
          titulo = `🏬${sede.tipoCentroAtencion.tipoCentroAtencion} - ${sede.centroAtencion}`;
        }else if(sede.tipoCentroAtencion.idTipoCentroAtencion == 2){
          titulo = `🤝${sede.tipoCentroAtencion.tipoCentroAtencion} - ${sede.centroAtencion}`;
        }else if(sede.tipoCentroAtencion.idTipoCentroAtencion == 3){
          titulo = `📍${sede.tipoCentroAtencion.tipoCentroAtencion} - ${sede.centroAtencion}`;
        }
        let direccion = `${sede.direccion}\n${sede.ubigeo.departamento}-${sede.ubigeo.provincia}-${sede.ubigeo.distrito}`;        
        let horario = `🕑 ${sede.horarioLv}`;
        let imagen = sede.foto;
        let mapa = `https://maps.google.com/maps?daddr=${sede.latitud},${sede.longitud}`;
        list_opc.push(new Card({
                          title: titulo,
                          text: `${direccion}\n${horario}`,
                          imageUrl: imagen,
                          buttonText: `🌎 Ver en Maps`,
                          buttonUrl: mapa
                        }));
      }      
    } 
    let texto_menu = '';
    if(contador==0){
      list_opc = [];
      texto_menu =`😰 Por el momento no contamos con sedes en ${sede_region}.\nContactate con nosotros al 📞<a href='(01) 634 2222'>(01) 634 2222</a>\n`; 
    }
    texto_menu += "Realiza una nueva consulta seleccionando una opción:👇";
    let opciones = payload_opciones();
    const payload = {"telegram": {          
                        "text": "Realiza una nueva consulta seleccionando una opción:👇",
                        "reply_markup": {
                          "inline_keyboard": opciones
                        },
                        "parse_mode": "HTML"
                      }
                    };
    list_opc.push(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));       
    agent.add(list_opc);
    agent.context.set({ name: 'set_sede_info', lifespan: 1, parameters: {} });
    agent.context.set({ name: 'set_menu', lifespan: 1, parameters: {}});
    agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {} });
  }

  module.exports = {
    sedes_horarios,
    sedes_horarios_info
  }