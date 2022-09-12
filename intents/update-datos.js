const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const {getTokenLogin} = require('../controllers/clave-virtual');
const {getApiUpdateDatos} = require('../controllers/update-datos');


async function handleIntentUpdateDatos(agent) {    
    console.log('handleIntentUpdateDatos');
    const identificacion = agent.context.get("set_actualizacion").parameters;    
    console.log(identificacion);    
    const tipDoc = identificacion.per_tipo_doc;
    const numDoc = identificacion.per_num_doc;
    const idUser = identificacion.id_user;
    const correo = agent.parameters.per_correo;
    const celular = agent.parameters.per_celular;

    const updateDatos = await getApiUpdateDatos(idUser,tipDoc,numDoc,correo,celular);

   console.log(updateDatos);
  
    let texto='';
    if(updateDatos.status)
    {
    texto = `Estimado(a) ${identificacion.name_user}, tus datos de contacto fueron actualizados. 👍`;  

  }else
  {
    texto = `Estimado(a) hubo un problema al actualizar sus datos 🙁, vuelva intentar en otro momento. Gracias`;  
  }

  const payload = {
    "telegram": {
        "text": texto,
        "reply_markup": {
          "inline_keyboard": [                
            [{ "text": "Regresar al menú anterior", "callback_data": "menu_asegurado" }],
            [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
          ]
        }
      }
    }
  agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 
  agent.context.set({ name: 'set_menu_asegurado', lifespan: 1, parameters: identificacion });  
  agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {}});   

  
  }

  module.exports = handleIntentUpdateDatos;