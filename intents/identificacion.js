const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');
const { validUserClaveVirtual } = require('../controllers/clave-virtual');
const jwt_decode = require('jwt-decode');

function handleIntentIdentificacion(agent) {
  const text = `Estimado(a) asegurado(a), para acceder a tu cuenta necesitamos validar tu identidad.🕵️‍♂️\nPor favor, selecciona tu tipo de documento:`;
  const inline_keyboard = [    [
      { "text": "DNI", "callback_data": "DNI" },
      { "text": "CE", "callback_data": "CE" },
    ]
  ];
  let parametros = {};
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
  agent.context.set({ name: 'set_identificacion_valid', lifespan: 1, parameters: parametros });
}

async function handleIntentIdentificacionValid(agent) {
  const per_tipo_doc = agent.parameters.per_tipo_doc;
  const per_num_doc = agent.parameters.per_num_doc;
  const per_clave = agent.parameters.per_clave;
  //validUserClaveVirtual
  const tokenJwt = await validUserClaveVirtual(per_tipo_doc, per_num_doc, per_clave);
  console.log(tokenJwt);
  let inline_keyboard = '';
  if (tokenJwt.status && tokenJwt.codigo == '0000') {
    //USUARIO VALIDADO ....
    /**
      UserId: '296',
      NumDoc: '19209886',
      TypeDoc: '23',
      TypeUser: 'P',
      CodeApli: 'MOVIL',
      CodeComp: '',
      FullName: 'PASTOR ALADINO VASQUEZ SERRANO',        
      Name: 'PASTOR ALADINO',
      TypeDocDesc: 'DNI',
      FullTypeDocDesc: 'DOCUMENTO NACIONAL DE IDENTIDAD',
      DateSearch: '19/08/2022',
      DateUpdate: '18/08/2022',
      TypeDocSnp: 'DI',
      TypeDocMccia: '01',
      TypeDocNstd: 'DNI',
      TypeDocAportantes: '01',
      TypeDocCalculo: '02',
      TypeDocOnpVirtual: '1',
      Correo: 'javiervasquezpadilla@outlook.com',
      CodCelular: 'PL',
      Celular: '988889855',
      exp: 1660932254 
    */
    const datDec = jwt_decode(tokenJwt.data);
    let parametros = {
      'per_num_doc': per_num_doc,
      'per_tipo_doc': per_tipo_doc,
      'token': tokenJwt.data,
      'id_user': datDec.UserId,
      'type_user': datDec.TypeUser,
      'name_user': datDec.Name,
      'fullname_user': datDec.FullName
    };
    console.log(parametros)
    //
    //NA :NUEVO AFILIADO
    //A  : AFIALIADO
    //P : PENSIONISTA
    const text = `Hola ${(datDec.Name).replace(/\s+/gi, ' ')}, iniciaste sesión correctamente.✅\n ¿A qué servicio deseas acceder?`;
    //validar doble perfil...
    if (datDec.TypeUser == 'P') {
      inline_keyboard = [
        [{ "text": "Obtener Constancia de Pago", "callback_data": "boleta" }],
        [{ "text": "Consultar Resolucion", "callback_data": "resolucion" }],
        [{ "text": "Actualizar correo y/o teléfono", "callback_data": "actualizacion_ficha_asegurado" }],
        [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
        [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
      ];
    } else if (datDec.TypeUser == 'A' || datDec.TypeUser == 'NA') {
      inline_keyboard = [
        [{ "text": "Constancia de afiliación", "callback_data": "constancia_afiliacion" },],
        [{ "text": "Actualizar correo y/o teléfono", "callback_data": "actualizacion_ficha_asegurado" }],
        [{ "text": "Cual es mi último aporte", "callback_data": "ultimo_aporte" }],
        [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
        [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
      ];
    }

    const payload = payloadBody(text, inline_keyboard);
    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
    agent.context.set({ name: 'set_boleta', lifespan: 1, parameters: parametros });
    agent.context.set({ name: 'set_resolucion', lifespan: 1, parameters: parametros });
    agent.context.set({ name: 'set_actualizacion', lifespan: 1, parameters: parametros });
    agent.context.set({ name: 'set_ultimo_aporte', lifespan: 1, parameters: parametros });

    agent.context.set({ name: 'set_menu', lifespan: 1, parameters: parametros });
    agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: parametros });

  } else {
    const text = tokenJwt.mensaje;
    let inline_keyboard = [ [{ "text": "Intentar nuevamente", "callback_data": "login" }]];
    const payload = payloadBody(text, inline_keyboard);
    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
    //agent.context.set({ name: contexto, lifespan: -1, parameters: parametros });
  }


}
//19209886
function payloadBody(text, inline_keyboard) {
  const payload = {
    "telegram": {
      "text": text,
      "reply_markup": {
        "inline_keyboard": inline_keyboard
      }
    }
  };
  return payload;
}
/*
function menuFin(){
  const menuFin =[ 
  [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
  [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
];
  return menuFin[0];
}*/

//P,NA

module.exports = { handleIntentIdentificacion, handleIntentIdentificacionValid };