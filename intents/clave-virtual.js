const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const {getValidDni,getConsultarUserExiste,getValidOlvideClave,getEnviarCorreo} = require('../controllers/clave-virtual');

function handleIntentClaveVirtual(agent) {
    let texto = `<b>¡Solicita o recupera tu Clave Virtual!🔐</b>\nCon clave virtual puedes acceder a tus servicios de manera rápida y segura.🤝\nPor favor, selecciona tu tipo de documento:`;  
    const inline_keyboard = [    [
      { "text": "DNI", "callback_data": "DNI" },
      { "text": "CE", "callback_data": "CE" },
    ]
  ];
    const payload = {
          "telegram": {
              "text": texto,
              "parse_mode": "HTML",
              "reply_markup": {
                "inline_keyboard": inline_keyboard
              },
            }
          };
    agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));  
    agent.context.set({ name: 'set_clave_datos', lifespan: 1, parameters: [] });
  }

function handleIntentClaveVirtualDatos(agent) {
  const parametros = {
    'per_num_doc': agent.parameters.per_tipo_doc,
    'per_tipo_doc': agent.parameters.per_num_doc,
    'per_fec_emision': agent.parameters.per_fec_emision
  };
  let texto = `Selecciona una opción para validar tu identidad:`;  
  const payload = {
        "telegram": {
            "text": texto,
            "parse_mode": "HTML",
            "reply_markup": {
              "inline_keyboard": [[{ "text": "Validar con el nombre de mi <b>Padre</b>", "callback_data": "padre" },
                                    { "text": "Validar con el nombre de mi <b>Madre</b>", "callback_data": "madre" } ]]
            }
          }
        };
  agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 
  agent.context.set({ name: 'set_clave_valid', lifespan: 1, parameters: parametros });
  
}
async function handleIntentClaveVirtualValidUser(agent) {
    const datos = agent.context.get("set_clave_valid").parameters;
    const per_tipo_doc = datos.per_tipo_doc;
    const per_num_doc = datos.per_num_doc;
    const per_fec_emision = datos.per_fec_emision;
    const per_tipo_padre_madre = agent.parameters.per_tipo_padre_madre;
    const per_nom_padre_madre = agent.parameters.per_nom_padre_madre;

    const validDni = await getValidDni(per_tipo_doc,per_num_doc,per_fec_emision,per_tipo_padre_madre,per_nom_padre_madre);
    let persona = `Estimado(a), ${validDni.data.Nombres} ${validDni.data.ApellidoPaterno} ${validDni.data.ApellidoMaterno}`;
    let mensaje='';

    if(validDni.status && validDni.codigo=='0000')
    {
        const consultarUserExiste = await getConsultarUserExiste(per_tipo_doc,per_num_doc);
        //consultarUserExiste.codigo=='0006' usuario no tiene clave virtual -- validar
        if(consultarUserExiste.status && consultarUserExiste.codigo=='0000')
        {
          const {TipoDocumentoId,NumeroDocumento,ApellidoMaterno}=consultarUserExiste.data;

          console.log(consultarUserExiste.data);

          const idProceso=validDni.data.IdProceso;

          const validOlvideClave= await getValidOlvideClave(idProceso,TipoDocumentoId,NumeroDocumento,ApellidoMaterno);

          const enviarCorreo= await getEnviarCorreo(idProceso);

          console.log(enviarCorreo);

          mensaje = `${persona} se envió a su 📧correo electrónico "${consultarUserExiste.data.Correo}" un link para que pueda recuperar su 🔐 clave virtual`;  

        }else{
          mensaje = `${persona} usted no cuenta con una clave virtual.\nSolicite su 🔐 clave virtual en la opción de "Solicitar Clave Virtual"`;  
        }

    }else {
      mensaje = `Estimado Usuario no pudimos validar su identidad, vuelva intentarlo nuevamente`; 
    }


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

 

module.exports = {handleIntentClaveVirtual,handleIntentClaveVirtualDatos,handleIntentClaveVirtualValidUser};