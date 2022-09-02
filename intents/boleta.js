const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const {getBoletaPago,getListBoletaPago} = require('../controllers/boleta');

async function handleIntentBoletaPago(agent) {
    
    console.log('boleta webhook 121111');
    console.log(agent.context.get("2identificacion-valid-followup"));

    //const servicios = agent.parameters.servicios;
    const anio = agent.parameters.anio;
    const mes = agent.parameters.mes;
    let per_num_doc = agent.context.get("2identificacion-valid-followup").parameters.per_num_doc;
    const dataBoletaPago = await getListBoletaPago(per_num_doc);



    console.log(dataBoletaPago);

    //validar 0000

    const dataRes=dataBoletaPago.data;
    //numEmision,numRegimen,codCuenta,numProceso,indSubProceso

    /**
        const apiKey = '58a270f70ad77689c020d2f35418c544';
    const numRegimen = dataBoletaPago.numRegLey;
    const codCuenta = dataBoletaPago.descripcionCuenta;
    const numEmision = anio+mes;
    const numProceso = dataBoletaPago.codProc;
    const indSubProceso =dataBoletaPago.inSubProceso; 
     */
    
    let parametros = {
      'numEmision':dataRes[0].numEmision,
      'numRegimen':dataRes[0].numRegLey,
      'codCuenta':dataRes[0].descripcionCuenta,
      'numProceso':dataRes[0].codProc,
      'indSubProceso':dataRes[0].inSubProceso
    };



    let mensaje = '💵 Boletas de Pagos:\n';
   // let inline_keyboard=[];



   //  let i=0;
   //   let j=0;
   //   let aux = [];
     for (const cron of dataRes) {

      /*
      if(i%2 == 0 && j==0){
        aux.push({"text": cron.desEmision,"callback_data": cron.numEmision});
        j=1;
      }else if(j==1){
        aux.push({"text": cron.desEmision,"callback_data": cron.numEmision});
        inline_keyboard.push(aux);
        aux = [];
        j=0;
      }else if(j==0){
        inline_keyboard.push([{"text": cron.desEmision,"callback_data": cron.numEmision}]);
      }*/
      
       /* mensaje+=`
        🏦 Banco : ${cron.desEntRepago}
        📆 Fecha de emisión : ${cron.desEmision}
        📑 Estado de Pago : ${cron.estPago}
        💰 Monto Pago Bruto  : ${cron.montoPagoBruto}
        💵 Monto Pago Neto : ${cron.montoPagoNeto}*/

        mensaje=`
        🏦 Banco : ${cron.desEntRepago}         
        📑 Estado de Pago : ${cron.estPago}
        💰 Monto Pago Bruto  : ${cron.montoPagoBruto}
        💵 Monto Pago Neto : ${cron.montoPagoNeto}`;
agent.add(new Card({
            title: `📆 Fecha de emisión : ${cron.desEmision}`,
            text: mensaje,            
            buttonText: 'Descargar boleta',
            buttonUrl: cron.numEmision
          })
          );

      i++;  
    }
    
   /* let texto = `${mensaje}
       Seleccione la fecha de la boleta que desea descargar:`;  
       const payload = {
             "telegram": {
              "text": texto,
              "reply_markup": {
                "inline_keyboard":
                  inline_keyboard          
              }
               }
             }
       agent.add(new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true}));


 */


       agent.context.set({ name: '2identificacion-valid-followup', lifespan: 2, parameters: parametros });
       //agent.context.set({ name: contexto, lifespan: 4, parameters: parametros });


      //agent.add('mm');
   // const dataBoletaPago = await getBoletaPago(per_num_doc,anio,mes);

    /*
    console.log(dataBoletaPago);

    let texto='';
    if(dataBoletaPago.status)
    {
     const parametros = {'anio': anio, 'per_num_doc': per_num_doc, 'mes': mes };
    // console.log(parametros);
    // console.log(dataBoletaPago);
    texto = `Descargue su boleta de pago :  ${dataBoletaPago.data.url}
    Selecciona una de las siguientes opciones:`;  

  }else
  {
    texto = `${dataBoletaPago.mensaje} de su Resoluciones.`;  
  }

  const payload = {
    "telegram": {
        "text": texto,
        "reply_markup": {
          "inline_keyboard": [
            [{"text": "Consultar Boleta de Pago", "callback_data": "boleta"}],
            [{ "text": "Obtener Resolucion", "callback_data": "resolucion" }]
            [{"text": "Consultar Boleta de Pago", "callback_data": "boleta"}],
            [{ "text": "Otras consultas", "callback_data": "otras_consultas" }],                  
            [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
            [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
          ]
        }
      }
    }
agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 
*/
 
  }


  async function handleIntentBoletaPagoDownload(agent) {
    
    console.log('handleIntentBoletaPagoDownload');
    console.log(agent.context.get("2identificacion-valid-followup"));
    dataResp = agent.context.get("2identificacion-valid-followup").parameters;

    const numEmision = agent.parameters.boteta_fec_emision;

   // console.log(numEmision);
    //numEmision,numRegimen,codCuenta,numProceso,indSubProceso
    const dataBoletaPagoDwnd = await getBoletaPago(numEmision,dataResp.numRegimen,dataResp.codCuenta,dataResp.numProceso,dataResp.indSubProceso);
   // console.log('dataBoletaPagoDwnd-1');

    //console.log(dataBoletaPagoDwnd);
    //console.log('dataBoletaPagoDwnd-2');


    //agent.add('detalle-12');

    let texto='';
    if(dataBoletaPagoDwnd.status)
    {
    // const parametros = {'anio': anio, 'per_num_doc': per_num_doc, 'mes': mes };
    // console.log(parametros);
    // console.log(dataBoletaPago);
    texto = `Descargue su boleta de pago 📄:  ${dataBoletaPagoDwnd.data.url}
    🖥 Seleccione una de las siguientes opciones:`;  

  }else
  {
    texto = `${dataBoletaPagoDwnd.mensaje} de su Resoluciones.`;  
  }

  const payload = {
    "telegram": {
        "text": texto,
        "reply_markup": {
          "inline_keyboard": [
           // [{"text": "Consultar Boleta de Pago", "callback_data": "boleta"}],
          //  [{ "text": "Obtener Resolucion", "callback_data": "resolucion" }]
          //  [{"text": "Consultar Boleta de Pago", "callback_data": "boleta"}],
          //  [{ "text": "Otras consultas", "callback_data": "otras_consultas" }],                  
            [{ "text": "Regresar al menú principal", "callback_data": "menu" }],
            [{ "text": "Finalizar conversación", "callback_data": "finalizar" }]
          ]
        }
      }
    }
agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true})); 




  
  }




  module.exports = {handleIntentBoletaPago,handleIntentBoletaPagoDownload};