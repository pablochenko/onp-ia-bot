const axios = require("axios");

const apiUpdateDatos='https://uat.onp.gob.pe/ClaveVirtualDev/api/Usuario/PostActualizarDatosContactoAsync';


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

function getApiUpdateDatos(userId,tipDoc,numDoc,correo,celular,stoken) {
  
    const config = { headers: { 'Content-Type':'application/json; charset=utf-8',Authorization: `Bearer ${stoken}`}};

    const parms = { 
        UsuarioId: parseInt(userId),
        TipoDocumentoId: parseInt(tipDoc),
        NumeroDocumento: numDoc,
        Correo: correo,
        Celular: celular,
        CodCelularPais: "PE",
        UsuarioRegistro: "API-CLAVE-APP-MOVIL",
        IpRegistro: "MOVIL"
    };
  
    const result = new Promise(function (resolve, reject) {
      axios.post(apiUpdateDatos,parms, config)
        .then(function (res) {
            const data = res.data;

            if (data.IsSuccess && data.Codigo == '0000') {
                resolve(handleResponse(true,'0000','ok', data));
            }else
            {
            resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 1',[]));
            }


        })
        .catch(function (error) {
            console.log(error)
          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 2',[]));
        })
    });
    result.catch((err) => {
        console.log(error)

      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3',[]));
    });
    return result;
  
  }


module.exports = {
    getApiUpdateDatos  
}