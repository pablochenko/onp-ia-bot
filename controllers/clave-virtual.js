const axios = require("axios");
const crypto = require("crypto");

const apiGetTokenClaveVirtual = 'https://uat.onp.gob.pe/SeguridadDev/api/Auth/loginApps';
const apiGetTokenLogin = 'https://uat.onp.gob.pe/ClaveVirtualAPI/api/login/PostLogin';
const apiGetValidPersona = 'https://uat.onp.gob.pe/ClaveVirtualDev/api/Usuario/PostConsultarUsuarioExisteAsync';

const apiValidDni='https://uat.onp.gob.pe/ClaveVirtualAPIHost/api/Validacion/PostValidarDni';

const apiConsultarUsuarioExiste='https://uat.onp.gob.pe/ClaveVirtualAPIHost/api/Usuario/PostConsultarUsuarioExiste'

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDsMd37llJw4NLq57498yjhU3Z
lsZGYOUqRArapO/SI7ajdQ8n4C/7hK+kXFNR7P1wCE5FmJ1KL4YOxEEG3+RcG37K
Hx9qvk328ciVMlNQgKKNpX3sKSegyp+vRFLS/xpfgq7lTMxKl0RPc4avnAOcM6vA
YCF0lN/+QKAR7IiwOQIDAQAB
-----END PUBLIC KEY-----`;

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

  function getEncryptRsa(clave) {
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(clave)
    );
    return encryptedData.toString("base64");
  
  }

   function validUserClaveVirtual(idTipDoc, numDoc, clave) {
    const claveEncryptRsa = getEncryptRsa(clave);
    const headers = { 'Content-Type': 'application/json' };
    const parms = { IdTipoDocumento: idTipDoc.toString(), NumeroDocumento: numDoc, Clave: claveEncryptRsa, CodigoAplicacion: 'MOVIL' };
  
    const result = new Promise(function (resolve, reject) {
      axios.post(apiGetTokenClaveVirtual, parms, headers)
        .then(function (res) {
          const data = res.data;
          console.log(data);
          if (data.IsSuccess && data.Codigo == '0000') {
            resolve(handleResponse(true,'0000','ok', data.ResultToken));
          }else  if (data.IsSuccess && data.Codigo == '0002') {
            resolve(handleResponse(true,'0002','No se pudo validar tu identidad 🥲', data.ResultToken));
          }else if (data.IsSuccess && data.Codigo == '0003') {
            resolve(handleResponse(true,'0003',`${data.Message} 🔃 `, []));
          } else {
            resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 1',[]));
          }
        })
        .catch(function (error) {
    

          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 2',[]));
        })
    });
    result.catch((err) => {
      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3',[]));
    });
    return result;
  
  }
  
  //ACTUALIZAR RESPUESTA

function getTokenLogin() {
    const headers = { 'Content-Type': 'application/json' };
    const parms = { Username: 'API-CLAVE-FICHA-ASEG', Password: '645D4017-7B4C-4266-82CB-52031A49A13E' };
  
    const result = new Promise(function (resolve, reject) {
      axios.post(apiGetTokenLogin, parms, headers)
        .then(function (res) {
          const data = res.data;
          if (data.IsSuccess && data.Codigo == '0000') {
            //resolve(handleResponse(true, data.Result));
            resolve(handleResponse(true,'0000','ok', data.Result));
          } else {
            resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3',[]));
          }
  
        })
        .catch(function (error) {
          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3',[]));
        })
  
    });
    result.catch((err) => {
      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3',[]));
    });
    return result;
  }
/*
 async function getTokenLoginValid(idTipDoc, numDoc, clave) {
    const headers = { 'Content-Type': 'application/json' };
    const parms = { Username: 'API-CLAVE-FICHA-ASEG', Password: '645D4017-7B4C-4266-82CB-52031A49A13E' };
  
    const result = new Promise(function (resolve, reject) {
      axios.post(apiGetTokenLogin, parms, headers)
        .then(function (res) {
          const data = res.data;
          if (data.IsSuccess && data.Codigo == '0000') {
             //getPersonaValid(data.Result,idTipDoc, numDoc,clave);
            resolve(getPersonaValid(data.Result,idTipDoc, numDoc,clave));

           // resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3',[]));
         
          } else {
            resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3',[]));
          }
  
        })
        .catch(function (error) {
          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3',[]));
        })
  
    });
    result.catch((err) => {
      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3',[]));
    });
    return result;
  }
*/
/*
   function getPersonaValid(stoken,idTipDoc, numDoc, clave) {
    console.log(stoken);
    const config = { headers: { 'Content-Type':'application/json; charset=utf-8',Authorization: `Bearer ${stoken}`}};
    const parms = { TipoDocumentoId: parseInt(idTipDoc), NumeroDocumento: numDoc, UsuarioRegistro: 'PI-CLAVE-APP-MOVIL', IpRegistro: '192.168.1.1' };

    const result = new Promise(function (resolve, reject) {
      axios.post(apiGetValidPersona,parms,config)
        .then(function (res) {
          const data = res.data;
          if (data.IsSuccess && data.Codigo == '0000') {
            //resolve(handleResponse(true, data.Result));
            //data.Result.EstadoUsuarioId
            console.log('ES PERSONA');

            if(data.Result.TipoUsuario=='A')
            {
              console.log('ES PERSONA AFILIADA');
              resolve(validUserClaveVirtual(idTipDoc,data.Result.NumeroDocumento,clave));

            }else if(data.Result.TipoUsuario=='P')
            {
              console.log('ES PERSONA PENSIONISTA');
              resolve(validUserClaveVirtual(idTipDoc,data.Result.NumeroDocumento,clave));
            }

            
          } else {
            resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3.1',[]));
          }
  
        })
        .catch(function (error) {
          console.log(error);
          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3.2',[]));
        })
  
    });
    result.catch((err) => {
      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3.3',[]));
    });
    return result;
  }
*/
  function getValidDni(idTipDoc, numDoc,fecEmi,inPadreMadre,nombrePadreMadre) {
    //const config = { headers: { 'Content-Type':'application/json; charset=utf-8',Authorization: `Bearer ${stoken}`}};

    const authBasic={
      username: '20136424867',
      password: 'E9CD45C5-32F3-4B0D-B119-EF25CFDC6ADB-BECD030E-9B85-40F3-BB16-7A93DD852C7F'
    }
    const config = { auth: authBasic};

    const parms = { 
      TipoDocumentoId: parseInt(idTipDoc), 
      NumeroDocumento: numDoc,
      tipoProcesoId:2,
      fechaEmision: fecEmi,
      inPadreMadre: parseInt(inPadreMadre),
      nombrePadreMadre: nombrePadreMadre,
      idProceso: 0
    };

    const result = new Promise(function (resolve, reject) {
      axios.post(apiValidDni,parms,config)
        .then(function (res) {
          const data = res.data;
          console.log(data);
          if (data.IsSuccess && data.Codigo == '0000') {
            resolve(handleResponse(true,'0000','ok', data.Result));
          }else{
            resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3.0',[]));
          }
  
        })
        .catch(function (error) {
          console.log(error);
          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3.2',[]));
        })
  
    });
    result.catch((err) => {
      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3.3',[]));
    });
    return result;
  }

  function getConsultarUserExiste(idTipDoc, numDoc) {
    const authBasic={
      username: '20136424867',
      password: 'E9CD45C5-32F3-4B0D-B119-EF25CFDC6ADB-BECD030E-9B85-40F3-BB16-7A93DD852C7F'
    }
    const config = { auth: authBasic};

    const parms = { 
      TipoDocumentoId: parseInt(idTipDoc), 
      NumeroDocumento: numDoc
    };

    const result = new Promise(function (resolve, reject) {
      axios.post(apiConsultarUsuarioExiste,parms,config)
        .then(function (res) {
          const data = res.data;
          console.log(data);
          if (data.IsSuccess && data.Codigo == '0000') {
            resolve(handleResponse(true,'0000','ok', data.Result));
          }else{
            resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3.0',[]));
          }
  
        })
        .catch(function (error) {
          console.log(error);
          resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3.2',[]));
        })
  
    });
    result.catch((err) => {
      resolve(handleResponse(false,'0404','Estamos presentando problemas con el servicio 3.3',[]));
    });
    return result;
  }

   // getTokenLoginValid,

  module.exports = {
    validUserClaveVirtual,
    getValidDni,
    getConsultarUserExiste,
    getTokenLogin
}
