const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

//const {getBoletaPago} = require('../controllers/boleta');
const {getTokenLogin} = require('../controllers/clave-virtual');
const {getApiUpdateDatos} = require('../controllers/update-datos');


async function handleIntentUpdateDatos(agent) {
    
    console.log('handleIntentUpdateDatos');
   //console.log(agent.context.get("2identificacion-valid-followup"));
    let dataContexto = agent.context.get("2identificacion-valid-followup").parameters;
    
    const tipDoc = dataContexto.per_tipo_doc;
    const numDoc = dataContexto.per_num_doc;
    
    //const token = dataContexto.token;
    const idUser = dataContexto.id_user;
    //const typeUser = dataContexto.type_user;
    const correo = agent.parameters.per_correo;
    const celular = agent.parameters.per_celular;
/*
    console.log(idUser);
    console.log(tipDoc);
    console.log(celular);
    console.log(correo);
*/

    const tokenLogin = await getTokenLogin();
    const updateDatos = await getApiUpdateDatos(idUser,tipDoc,numDoc,correo,celular,tokenLogin.data);

   //console.log(tokenLogin);
   console.log(updateDatos);

  // agent.add('aaaaa');
  
    let texto='';
    if(updateDatos.status)
    {
     //const parametros = {'anio': anio, 'per_num_doc': per_num_doc, 'mes': mes };
    // console.log(parametros);
    // console.log(dataBoletaPago);
    texto = `Estimado(a) se actualizaron sus datos 👍`;  

  }else
  {
    texto = `Estimado(a) hubo un problema al actualizar sus datos 🙁, vuelva intentar en otro momento. Gracias`;  
  }

  const payload = {
    "telegram": {
        "text": texto,
        "reply_markup": {
          "inline_keyboard": [
           // [{"text": "Consultar Boleta de Pago", "callback_data": "boleta"}],
           // [{ "text": "Obtener Resolucion", "callback_data": "resolucion" }]
           // [{"text": "Consultar Boleta de Pago", "callback_data": "boleta"}],
          //  [{ "text": "Otras consultas", "callback_data": "otras_consultas" }],                  
            [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
            [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
          ]
        }
      }
    }
agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 


  
  }

  module.exports = handleIntentUpdateDatos;