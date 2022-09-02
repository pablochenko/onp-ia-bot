
const {Payload } = require('dialogflow-fulfillment');

function welcome(agent) {
    console.log('inicio');


    const contexto = 'setbienvenida'; //MINUSCULAS 
    const parametros = {};

  
    const text = `<i><b>¡Bienvenida/o a la ONP!</b></i>🌟\nMi nombre es <b>Olivia</b>, soy agente virtual de la ONP. 🤖\n¡Por este medio te ayudaré a resolver tus consultas! 🤝\nSelecciona un servicio para continuar:`;;
  
    const inline_keyboard =  
    [
      [{"text": "Consultar información de mi cuenta","callback_data": "identificacion"}],
      [{"text": "Solicitar o recuperar mi Clave virtual", "callback_data": "clave_virtual"}],
      [{"text": "Consultar el cronograma de pagos","callback_data": "cronograma"}],
      [{"text": "Conocer las Sedes y los horarios de atención","callback_data": "sedes_horarios"}],
      [{"text": "Finalizar conversación","callback_data": "finalizar"}]
    ];


    const payload = { "telegram": { "text": text, "reply_markup": { "inline_keyboard": inline_keyboard },"parse_mode": "HTML" }};

    //const payloadwsp = { "wsp": { "text": text, "reply_markup": { "inline_keyboard": inline_keyboard } }};

    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }) );

    agent.context.set({ name: contexto, lifespan: 2, parameters: parametros });

  }
  module.exports = welcome;