import {env} from "../env";
import appConfig from "../appConfig";
let ProjectConfiguration=()=>{
    if(process.env.NODE_ENV!== 'production'){
        //DEVELOPMENT
        return{
            AppEnviroment:process.env,
            AppVersion:"0.1.0",
            API_BASE_URL:"http://localhost:5163/api/",
            AppDataInputTest:"FALSE",
            WIJMO_KEY:appConfig.wijmoKey//<-WIJMO LICENSE(SECURE BY THE HIDDEN .ENV FILE)->//
        }
    }else{
        //PRODUCTION
        return{
            AppEnviroment:process.env,
            AppVersion:env.REACT_APP_INFOMEX_VERSION,
            API_BASE_URL:"http://"+env.REACT_APP_API_BASE_URL+"/api/",
            AppDataInputTest:env.REACT_APP_TEST,
            WIJMO_KEY:appConfig.wijmoKey//<-WIJMO LICENSE(SECURE BY THE HIDDEN .ENV FILE)->//
        }
    }
}

export const APP_CONFIG=ProjectConfiguration();

//Array with the RESPONSES TYPE OF THE FETCH.
export const API_STATUS={
    SUCCESS:200,
    ERROR:500,
    NOTFOUND:404,
    UNAUTHORIZED:401,
    CONFLICT:409,
    CREATED:201,
    BAD:400,
    NOCONTENT:204
}