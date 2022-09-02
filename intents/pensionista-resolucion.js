require('dotenv').config();

const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

const {getResoluciones,getResolucionesDetalle,getResolucionDonwload} = require('../controllers/pensionista/servicios');

async function handleIntentPResolucion(agent) {
    
    console.log('resol webhook 121111');
    console.log(agent.context.get("2identificacion-valid-followup"));
    const token = agent.context.get("2identificacion-valid-followup").parameters.token;
    //2identificacion-valid-followup-2


    const dataResoluciones = await getResoluciones(token);
    console.log(dataResoluciones);
if(dataResoluciones.status && dataResoluciones.codigo=='0000')
{

    const dataRes=dataResoluciones.data;
      let mensaje = '🧾 Resoluciones:\n'; 
      let inline_keyboard=[];

       for (const cron of dataRes) { 
      
        inline_keyboard.push([{"text": cron.NumeroExpediente,"callback_data": cron.NumeroExpediente}]);
          mensaje+=`
          ⚖️ Codigo Ley: ${cron.CodigoLey} 
          #️⃣ Número de Expediente: ${cron.NumeroExpediente}
          --------------------------------------------------------
          `;
      }    
      console.log(inline_keyboard);
       const parametros = {'resolucion': dataRes,'token': token};
       //2.2 Resolucion Pensionista
       const contexto = '22resolucionpensionista-followup';

      
       let texto = `${mensaje}
       Seleccione/escriba una resolución:`;  
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
       agent.context.set({ name: contexto, lifespan: 2, parameters: parametros });
      

}
    //const servicios = agent.parameters.servicios;
    ///const anio = agent.parameters.anio;
    ///const mes = agent.parameters.mes;
  ///  let per_num_doc = agent.context.get("2identificacion-valid-followup").parameters.per_num_doc;
  //  const dataBoletaPago = await getBoletaPago(per_num_doc,anio,mes);
  
    //let text = 'Seleccione';
    //const contexto = 'Identificacion-followup';
    // const parametros = {'anio': anio, 'per_num_doc': per_num_doc, 'mes': mes };
    // console.log(parametros);

    //agent.add(`Descargue su boleta de pago :  ${dataBoletaPago.data.url}`);

/*
    let texto = `
    Selecciona una de las siguientes opciones:`;  
    const payload = {
          "telegram": {
              "text": texto,
              "reply_markup": {
                "inline_keyboard": [
                  [{"text": "Consultar Boleta de Pago", "callback_data": "boleta"}],
                  [{ "text": "Obtener Resolucion", "callback_data": "resolucion" }],
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

  
async function handleIntentPResolucionDetalle(agent) {
    
    console.log('handleIntentPResolucionDetalle');
    console.log(agent.context.get("22resolucionpensionista-followup"));
    const data = agent.context.get("22resolucionpensionista-followup").parameters;

    const token=data.token;
    const resolucion=data.resolucion;

    const nuRes = agent.parameters.num_resolucion;

    const filterDataRes = resolucion.filter(x => x.NumeroExpediente==nuRes);//VALIDAR SI NO COICIDE DATOS

    const dataRes=filterDataRes[0];
    console.log(dataRes);
    console.log(nuRes);
    // IdExpediente: '12567845',
    // CodigoLey: '19990',
    // NumeroExpediente: '00300040605',
    // ExisteDocumentos: '1'
    const dataResDetalle = await getResolucionesDetalle(token,dataRes.ExisteDocumentos,dataRes.CodigoLey,dataRes.NumeroExpediente,dataRes.IdExpediente);

    console.log(dataResDetalle);

    if(dataResDetalle.status && dataResDetalle.codigo=='0000')
{
    console.log('ok-dataResDetalle');
    const dataPens=dataResDetalle.data.DatosCabecera;
    const dataRes=dataResDetalle.data.DatosDetalle;
    console.log(dataPens);
    console.log(dataRes);

    let mensaje = '🧾Por favor escriba el número de Resolución que desea descargar:\n'; 
    let inline_keyboard=[];

    let num=1;

     for (const cron of dataRes) { 
    
      //inline_keyboard.push([{"text": cron.NumeroExpediente,"callback_data": cron.NumeroExpediente}]);
        mensaje+=`
        #️⃣ ${num++}
        ⚖️ Tipo Documento: ${cron.TipoDocumento} 
        🗓️ Fecha Creación NSP: ${cron.FechaCreacionNSP}
        📄 Número Documento: ${cron.NumeroDocumento}
        📃 Descripción Documento: ${cron.DescripcionDocumento}
        ✅ Resultado Documento: ${cron.ResultadoDocumento}
        --------------------------------------------------------
        `;
    }    
    //console.log(inline_keyboard);
    const parametros = {'resolucionDet': dataRes,'token': token};
     //2.2 Resolucion Pensionista
    const contexto = '221resolucionpensionistadetalle-followup';

    
     let texto = mensaje;  
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
     agent.context.set({ name: contexto, lifespan: 2, parameters: parametros });
}

 
}


async function handleIntentPResolucionDownload(agent) {
    
    console.log('handleIntentPResolucionDownload');
    //console.log(agent.context.get("22resolucionpensionista-followup"));
    const data = agent.context.get("221resolucionpensionistadetalle-followup").parameters;

    const token=data.token;
    const resolucion=data.resolucionDet;

    const nuRes = agent.parameters.codnumres;

    const dataRes=resolucion[nuRes-1];

   // console.log(resolucion); 
    console.log(dataRes); 
    console.log(nuRes); 

    const dataResDownload = await getResolucionDonwload(token,dataRes.IdDetalle);

    console.log(dataResDownload);

    if(dataResDownload.status && dataResDownload.codigo=='0000')
{

    const server_url=process.env.SERVER_URL
   // agent.add(`Descargar Resolución : ${server_url}/download-resolucion-pensionista/${dataResDownload.data}`);

    let texto = `Descargar Resolución : 
    ${server_url}/download-resolucion-pensionista/${dataResDownload.data}`;  
        const payload = {
              "telegram": {
                  "text": texto,
                  "reply_markup": {
                    "inline_keyboard": [
                      [{"text": "Regresar al menú principal","callback_data": "menu"}],
                      [{"text": "Finalizar conversación","callback_data": "finalizar"}]
                    ]
                  },"parse_mode": "HTML"
                }
              }
        agent.add(new Payload(agent.TELEGRAM, payload, {rawPayload: true, sendAsMessage: true}));



}




 
}



  module.exports = {handleIntentPResolucion,handleIntentPResolucionDetalle,handleIntentPResolucionDownload};