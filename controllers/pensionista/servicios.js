const axios = require("axios");
const base64 = require('base64topdf');

//const apiGetUrl='https://uat.onp.gob.pe/Pensionista';
const apiGeResoluciones='https://uat.onp.gob.pe/Pensionista/api/Resoluciones';

function handleResponse(status,codigo,mensaje,data) {
    const response =
    {
      "status": status,
      "codigo": codigo,
      "mensaje": mensaje,
      "data": data
    }
    return response;
  }

  function getResoluciones(stoken,id) {

    //const authorization = {Authorization: `Bearer ${stoken}`};
    //const headers = { 'Content-Type': 'application/json' };
    //const config = { headers: headers ,authorization};
    const config = { headers: { 'Content-Type':'application/json; charset=utf-8',Authorization: `Bearer ${stoken}`}};


    const parms ='';

    const result = new Promise(function (resolve, reject) {
      axios.get(apiGeResoluciones, config)
        .then(function (res) {
          const data = res.data;
          if(data && data.Codigo=='0000')
          {
            resolve(handleResponse(true,'0000','ok', data.Result.DatosDetalle));
          }else{
            resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));

          }
          //resolve(handleResponse(true,'0000','ok', data));
  
          //descripcionCuenta
          //numRegLey
          //codProc
          //inSubProceso
          /*
          if (data.IsSuccess && data.Codigo == '0000') {
            resolve(handleResponse(true,'0000','ok', data.ResultToken));
          }if (data.IsSuccess || data.Codigo == '0002' || data.Codigo == '0003') {
            resolve(handleResponse(true,'0002','No se pudo validar tu identidad 🥲', data.ResultToken));
          } else {
            resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
          }*/
        })
        .catch(function (error) {
            console.log('error1');

          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
        })
    });
    result.catch((err) => {
        console.log('error2');

      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
    });
    return result;
  
  }


  function getResolucionesDetalle(stoken,caso,ley,numExp,IdExpediente) {
    console.log('getResolucionesDetalle');
    const config = { headers: { 'Content-Type':'application/json; charset=utf-8',Authorization: `Bearer ${stoken}`}};
    const parms= `/${caso}/${ley}/${numExp}/${IdExpediente}`;

    console.log(apiGeResoluciones+parms);

    const result = new Promise(function (resolve, reject) {
      axios.get(apiGeResoluciones+parms, config)
        .then(function (res) {
          const data = res.data;
          if(data && data.Codigo=='0000')
          {
            resolve(handleResponse(true,'0000','ok', data.Result));
          }

        })
        .catch(function (error) {
            console.log('error1');

          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
        })
    });
    result.catch((err) => {
        console.log('error2');

      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
    });
    return result;
  
  }

  function getResolucionDonwload(stoken,id) {
    console.log('getResolucionesDetalle');
    const config = { headers: { 'Content-Type':'application/json; charset=utf-8',Authorization: `Bearer ${stoken}`}};
    const parms= `/${id}`;

    //console.log(apiGeResoluciones+parms);

    const result = new Promise(function (resolve, reject) {
      axios.get(apiGeResoluciones+parms, config)
        .then(function (res) {
          const data = res.data;
         // console.log(data);

          if(data && data.Codigo=='0000')
          {
            const urlPdf=(data.Details).replace(/\s+/g, "").trim();
            let decodedBase64 = base64.base64Decode(data.Result, urlPdf)
            resolve(handleResponse(true,'0000','ok', urlPdf));
          }

        })
        .catch(function (error) {
            console.log('error1');

          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
        })
    });
    result.catch((err) => {
        console.log('error2');

      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
    });
    return result;
  
  }





module.exports = 
{
  getResoluciones,
  getResolucionesDetalle,
  getResolucionDonwload
}




//https://uat.onp.gob.pe/Pensionista/api/Resoluciones/1_19990_00300040605_12567845_DC-2005-0000034208