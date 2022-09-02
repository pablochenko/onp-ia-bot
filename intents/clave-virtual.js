const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const {getValidDni,getConsultarUserExiste} = require('../controllers/clave-virtual');

function handleIntentClaveVirtual(agent) {
    
    console.log('handleIntentClaveVirtual');

     let texto = `¡Solicita o recupera tu Clave Virtual!
    Con clave virtual, accedes a tus servicios preferidos de manera rápida y segura.`;  
    const payload = {
          "telegram": {
              "text": texto,
              "reply_markup": {
                "inline_keyboard": [
                  [{"text": "Solicitar Clave Virtual", "callback_data": "solicitar_clave"}],
                  [{ "text": "Recuperar mi Clave Virtual", "callback_data": "recuperar_clave" }],
                  [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
                  [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
                ]
              }
            }
          }
    agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 
 
  }

  function handleIntentClaveVirtualRecuperar(agent) {

    const text = `<b>¡Consulta información de tu cuenta!</b>
Para acceder a tu cuenta necesitamos validar tu identidad.
Por favor, indícame tu tipo de documento:`;
  
    const inline_keyboard = [
      [
        { "text": "DNI", "callback_data": "DNI" },
        { "text": "CE", "callback_data": "CE" },
  
      ]
    ];
  
    const payload = {
      "telegram": {
        "text": text,
        "reply_markup": {
          "inline_keyboard": inline_keyboard
        },
        "parse_mode": "HTML"
      }
    };
    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));  
  }

  async function handleIntentClaveVirtualValidUser(agent) {

    const per_tipo_doc = agent.parameters.per_tipo_doc;
    const per_num_doc = agent.parameters.per_num_doc;
    const per_fec_emision = agent.parameters.per_fec_emision;
    const per_tipo_padre_madre = agent.parameters.per_tipo_padre_madre;
    const per_nom_padre_madre = agent.parameters.per_nom_padre_madre;

    const validDni = await getValidDni(per_tipo_doc,per_num_doc,per_fec_emision,per_tipo_padre_madre,per_nom_padre_madre);
    let persona = `Estimado(a), ${validDni.data.Nombres} ${validDni.data.ApellidoPaterno} ${validDni.data.ApellidoMaterno}`;
    let mensaje='';

    if(validDni.status && validDni.codigo=='0000')
    {
        const consultarUserExiste = await getConsultarUserExiste(per_tipo_doc,per_num_doc);
        if(consultarUserExiste.status && consultarUserExiste.codigo=='0000')
        {
          mensaje = `${persona} se envió a su 📧correo electrónico "${consultarUserExiste.data.Correo}" un link para que pueda recuperar su 🔐 clave virtual`;  
        }else{
          mensaje = `${persona} usted no cuenta con una clave virtual.
solicite su 🔐 clave virtual en la opción de "Solicitar Clave Virtual"`;  
        }

    }else
    {
      mensaje = `Estimado Usuario no pudimos validar su identidad, vuelva intentarlo nuevamente`; 
    }

    
    //validDni.data.IdProceso


    console.log(validDni);

     texto = mensaje;  
    const payload = {
          "telegram": {
              "text": texto,
              "reply_markup": {
                "inline_keyboard": [                
                  [{"text": "Regresar al menú principal","callback_data": "menu"}],
                  [{"text": "Finalizar conversación","callback_data": "finalizar"}]
                ]
              }
            }
          }
    agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));
 

  }


  

  module.exports = {handleIntentClaveVirtual,handleIntentClaveVirtualRecuperar,handleIntentClaveVirtualValidUser};