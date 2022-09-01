
const {Payload } = require('dialogflow-fulfillment');

function welcome(agent) {
    console.log('inicio');


    const contexto = 'setbienvenida'; //MINUSCULAS 
    const parametros = '';

/*
    const dexpediente=
      [{
          "IdExpediente": "12567845",
          "CodigoLey": "19990",
          "NumeroExpediente": "00300040605",
          "ExisteDocumentos": "1"
      },{
        "IdExpediente": "74182",
        "CodigoLey": "19990",
        "NumeroExpediente": "00575575",
        "ExisteDocumentos": "1"
    }
]*/
   /* const parameters= {
      expediente: dexpediente
    }*/
  
    const text = `<i><b>¡Bienvenida/o a la ONP!</b></i>🌟\nMi nombre es <b>Olivia</b>, soy agente virtual de la ONP. 🤖\n¡Por este medio te ayudaré a resolver tus consultas! 🤝\nSelecciona un servicio para continuar:`;;
  
    const inline_keyboard =  
    [
      [{"text": "Consultar información de mi cuenta","callback_data": "identificacion"}],
      [{"text": "Solicitar o recuperar mi Clave virtual", "callback_data": "clave_virtual"}],
      [{"text": "Consultar el cronograma de pagos","callback_data": "cronograma"}],
      [{"text": "Conocer las Sedes y los horarios de atención","callback_data": "sedes_horarios"}],
      [{"text": "Finalizar conversación","callback_data": "finalizar"}]
    ];
    const inline_keyboardwsp = {
    "type": "interactive",
    "interactive": {
        "type": "button",
        "body": {
            "text": "<BUTTON_TEXT>"
        },
        "action": {
            "buttons": [
                {
                    "type": "reply",
                    "reply": {
                        "id": "<UNIQUE_BUTTON_ID_1>",
                        "title": "<BUTTON_TITLE_1>"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "<UNIQUE_BUTTON_ID_2>",
                        "title": "<BUTTON_TITLE_2>"
                    }
                }
            ]
        }
      }

    }

    const payload = { "telegram": { "text": text, "reply_markup": { "inline_keyboard": inline_keyboard },"parse_mode": "HTML" }};

    //const payloadwsp = { "wsp": { "text": text, "reply_markup": { "inline_keyboard": inline_keyboard } }};

    //agent.add(new Payload(agent.TELEGRAM, payload, { rawPayload: true, sendAsMessage: true }) );
    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }) );

   // agent.add(`BIENVENIDO.dxxxd.x.`);
    agent.context.set({ name: contexto, lifespan: 2, parameters: parametros });

  }
  module.exports = welcome;