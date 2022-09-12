const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');
const {getBoletaPago,getListBoletaPago} = require('../controllers/boleta');

async function handleIntentBoletaPago(agent) { 
    const identificacion = agent.context.get("set_boleta").parameters;
    let per_num_doc = identificacion.per_num_doc;
    const dataBoletaPago = await getListBoletaPago(per_num_doc); 
    const boletas=dataBoletaPago.data;     
    const parametros = {
      'boletas': boletas,
      'identificacion': identificacion
    };  
    let opc = payload_opciones(boletas);
    let texto = '<b>¡Constancias de pago!</b>📄💰\nHas clic en la constancia que deseas descargar:';  
    const payload = {
            "telegram": {
                "text": texto,
                "reply_markup": {
                  "inline_keyboard": opc
                },
                "parse_mode": "HTML"
              }
            }
    agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));  
    agent.context.set({ name: 'set_boleta_descargar', lifespan: 1, parameters: parametros });  
    agent.context.set({ name: 'set_menu_asegurado', lifespan: 1, parameters: identificacion });  
    agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {}});   
  }
  function payload_opciones(datos){
    let opciones = [];
    let detalle = [];
    for (const x of datos) { 
      detalle.push({"text": `${x.desEmision}`,"callback_data": x.desEmision+'_'+x.numEmision}); 
      if(detalle.length == 4){
        opciones.push(detalle);
        detalle = [];
      }       
    } 
    if(detalle.length >0) opciones.push(detalle);  
    opciones.push([{"text": "Regresar al menú anterior","callback_data": "menu_asegurado"}]);
    opciones.push([{"text": "Finalizar conversación","callback_data": "finalizar"}]);
    return opciones;
  }

  async function handleIntentBoletaPagoDownload(agent) {    
    console.log('handleIntentBoletaPagoDownload');
    const  dataRes = agent.context.get("set_boleta_descargar").parameters;
    const boletas = dataRes.boletas;
    const identificacion = dataRes.identificacion;
    const parametros = {
      'boletas': boletas,
      'identificacion': identificacion
    };    
    const boleta = (agent.parameters.boteta_fec_emision).split('_');
    const desEmision = boleta[0];
    const numEmision = boleta[1];
    /*
    {
        "descripcionCuenta": "A078742",
        "numRegLey": "19990",
        "desEntRepago": "BANCO DE LA NACION",
        "fechaReintegro": "",
        "numEmision": "202210",
        "codProc": "001",
        "inSubProceso": "NR",
        "desEmision": "SET - 2022",
        "simbMoneda": "S/   ",
        "montoPagoBruto": "         550.00",
        "montoPagoNeto": "         530.00",
        "estPago": "PAGADO",
        "inConsPago": "0"
    }
    */
    const dataBoletaPagoDwnd = await getBoletaPago(numEmision,boletas[1].numRegLey,boletas[1].descripcionCuenta,boletas[1].codProc,boletas[1].inSubProceso);
    let texto='';
    if(dataBoletaPagoDwnd.status){
      texto = `📄 ¡Tu constancia de pago ${desEmision} ha sido generada!\n👉 ${dataBoletaPagoDwnd.data.url}`;  
    }else{
      texto = `${dataBoletaPagoDwnd.mensaje} de su -Constancia.`;  
    }
    let opc = payload_opciones(boletas);
    const payload = {
      "telegram": {
          "text": texto,
          "reply_markup": {
            "inline_keyboard": opc
          },
          "parse_mode": "HTML"
        }
      }
    agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 

    agent.context.set({ name: 'set_boleta_descargar', lifespan: 1, parameters: parametros });  
    agent.context.set({ name: 'set_menu_asegurado', lifespan: 1, parameters: identificacion });  
    agent.context.set({ name: 'set_finalizar', lifespan: 1, parameters: {} });   
  }

  module.exports = {handleIntentBoletaPago,handleIntentBoletaPagoDownload};