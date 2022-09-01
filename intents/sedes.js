const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const v_sedes = require('../json/sedes.json'); 
//const v_regiones = require('./regiones.json'); 

function sedes_horarios_info(agent) {         
    const sede_region=agent.parameters.sede_region;  
    //const contextIn = agent.getContext('identificacion-followup');
    //const per_nombre = contextIn.parameters.per_nombre;
    agent.add(`¡Conoce nuestras sedes en ${sede_region}!`); 
    for (const sede of v_sedes) {   
      if((sede_region.toUpperCase() == (sede.region).toUpperCase()) || 
         (sede_region.toUpperCase() == 'LIMA METROPOLITANA' && (sede.provincia).toUpperCase()== 'LIMA') ||
         (sede_region.toUpperCase() == 'LIMA PROVINCIA' && (sede.region).toUpperCase()== 'LIMA'&& (sede.provincia).toUpperCase()!= 'LIMA')){
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
      }  else if((sede_region.toUpperCase() == 'LIMA METROPOLITANA' && (sede.provincia).toUpperCase()== 'LIMA')){

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


  module.exports = sedes_horarios_info;