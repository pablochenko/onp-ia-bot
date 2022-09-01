const axios = require("axios");

const apiGetListPago='https://app.onp.gob.pe/ONPBackendAPI/onpmovil/listadoboletaspagomovil';
const apiGetBoletaPago='https://app.onp.gob.pe/ONPBackendAPI/onpmovil/boletapagomovil';


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

function getListBoletaPago(nudoc) {
    const apiKey = '58a270f70ad77689c020d2f35418c544';
  
    const headers = { 'Content-Type': 'application/json' };
    const parms = `?tipo=DI&nroDocumento=${nudoc}&api_key=${apiKey}`;
  
    const result = new Promise(function (resolve, reject) {
      axios.get(apiGetListPago+parms, headers)
        .then(function (res) {

          if(res.length>0)
          {
            const data = res.data[0];
            //console.log(res.data);
            resolve(handleResponse(true,'0000','ok', data));
          }else
          {
            resolve(handleResponse(false,'0001','No se encontraron resultados',[]));
          }

          const data = res.data[0];
          //console.log(res.data);
          resolve(handleResponse(true,'0000','ok', data));
  
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
          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
        })
    });
    result.catch((err) => {
      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
    });
    return result;
  
  }

  async function getBoletaPago(nudoc,anio,mes) {

  
    const boletaPago = await getListBoletaPago(nudoc);

   if(boletaPago.status=='0001')
    {
      console.log('no hay datos resol');

      return boletaPago;
    }else
    {


    const dataBoletaPago = boletaPago.data;
  
    const apiKey = '58a270f70ad77689c020d2f35418c544';
    const numRegimen = dataBoletaPago.numRegLey;
    const codCuenta = dataBoletaPago.descripcionCuenta;
    const numEmision = anio+mes;
    const numProceso = dataBoletaPago.codProc;
    const indSubProceso =dataBoletaPago.inSubProceso;
  
    const headers = { 'Content-Type': 'application/json' };
    const parms =`?numRegimen=${numRegimen}&codCuenta=${codCuenta}&numEmision=${numEmision}&numProceso=${numProceso}&indSubProceso=${indSubProceso}&indicadorRutaExternaInterna=E&api_key=${apiKey}`;
  
    const result = new Promise(function (resolve, reject) {
      axios.get(apiGetBoletaPago+parms, headers)
        .then(function (res) {
          const data = res.data.respuesta;
          //console.log(data);
          resolve(handleResponse(true,'0000','ok', data));
  
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
          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
        })
    });
    result.catch((err) => {
      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio',[]));
    });
    return result;
    }
  
  }

module.exports = {
    getBoletaPago  
}