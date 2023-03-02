//Email sender
import {API_STATUS, APP_CONFIG} from "../constants/ApiConstants";
const {API_BASE_URL}=APP_CONFIG
export function SendEmail(msg){
    return new Promise(async (resolve,reject)=>{
      try{
          fetch(API_BASE_URL+'sendEmail?'+new URLSearchParams(
              {message: msg}),{
              method:"GET",
              headers:{
                  Accept:'application/json',
              }}).then(response => {
              if (response.status===API_STATUS.SUCCESS){
                  response.json()
                      .then(body => {
                          console.log('aea',body);
                          resolve(body);
                      })
              }console.log(response)
              response.json()
                  .then(body=>{
                      reject(body);
                  })
          })

      } catch (error){
          reject(error);
      }
    })
}
function errorHandling (errorMSG){

}