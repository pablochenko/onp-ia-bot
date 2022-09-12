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
    for (const sede of v_sedes) {   
      if((sede_region.toUpperCase() == (sede.region).toUpperCase()) || 
         (sede_region.toUpperCase() == 'LIMA_METROP' && (sede.provincia).toUpperCase()== 'LIMA') ||
         (sede_region.toUpperCase() == 'LIMA_PROV' && (sede.region).toUpperCase()== 'LIMA'&& (sede.provincia).toUpperCase()!= 'LIMA') || 
         (sede_region.toUpperCase() == 'CALLAO' && (sede.region).toUpperCase()== 'CALLAO')){
        let direccion = (sede.direccion == 'S/D')? (sede.region+' - '+sede.provincia+' - '+sede.distrito) : (sede.direccion+'\n'+sede.region+' - '+sede.provincia+' - '+sede.distrito);
        let horario = (sede.horario == 'S/D')? 'Sin datos': ('\nHorario de atención: '+sede.horario);
        let mapa = (sede.maps == 'S/D')? 'Sin datos': sede.maps;
        let imagen = (sede.imagen == 'S/D')? 'Sin datos': sede.imagen;
        agent.add(new Card({
            title: sede.tipo + ' - '+ sede.descripcion,
            text: direccion+horario,
            imageUrl: imagen,
            buttonText: 'Ver en Maps',
            buttonUrl: mapa
          })
        );
      }      
    }     
    const payload = {"telegram": {"text": "<b>¡Conoce nuestras sedes y horarios de atención a nivel nacional!</b>Selecciona la región que deseas consultar:",
                        "reply_markup": {
                          "inline_keyboard": [[
                            {"text": "LIMA METROPOLITANA","callback_data": "LIMA METROPOLITANA"  },{"text": "LIMA PROVINCIA","callback_data": "PROVINCIA"  },
                            {"text": "CALLAO","callback_data": "CALLAO"  }],
                            [{"callback_data": "AMAZONAS","text": "AMAZONAS"  },{"text": "ANCASH","callback_data": "ANCASH"  },
                            {"text": "APURIMAC","callback_data": "APURIMAC"  },{"text": "AREQUIPA","callback_data": "AREQUIPA"  }],
                          [ {"text": "AYACUCHO","callback_data": "AYACUCHO"  },{"callback_data": "CAJAMARCA","text": "CAJAMARCA"  },
                            {"text": "CUSCO","callback_data": "CUSCO"  },{"text": "HUANCAVELICA","callback_data": "HUANCAVELICA"  }],
                          [ {"callback_data": "HUANUCO","text": "HUANUCO"  },{"text": "ICA","callback_data": "ICA"  },
                            {"callback_data": "JUNIN","text": "JUNIN"  },{"callback_data": "LA LIBERTAD","text": "LA LIBERTAD"  }],
                          [ {"callback_data": "LAMBAYEQUE","text": "LAMBAYEQUE"  },{"callback_data": "LORETO","text": "LORETO"  },
                            {"text": "MADRE DE DIOS","callback_data": "MADRE DE DIOS"  },{"callback_data": "MOQUEGUA","text": "MOQUEGUA"  }],
                          [ {"callback_data": "PASCO","text": "PASCO"  },{"text": "PIURA","callback_data": "PIURA"  },
                            {"text": "PUNO","callback_data": "PUNO"  },{"callback_data": "SAN MARTIN","text": "SAN MARTIN"  }],
                          [ {"text": "TACNA","callback_data": "TACNA"  },{"callback_data": "TUMBES","text": "TUMBES"  },
                            {"text": "UCAYALI","callback_data": "UCAYALI"  }],
                          [ {"callback_data": "menu","text": "Regresar al menú principal"  }],
                          [ {"text": "Finalizar conversación","callback_data": "finalizar"  }]]
                        },"parse_mode": "HTML"
                      } }; 
    agent.add(new Payload(agent.UNSPECIFIED , payload, {rawPayload: true, sendAsMessage: true}));  
  }


  //module.exports = sedes_horarios_info;

  module.exports = {
    sedes_horarios,
    sedes_horarios_info
}