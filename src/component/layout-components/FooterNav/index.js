import React from 'react'
import {APP_CONFIG} from "../../../constants/ApiConstants";
import {Footer} from "antd/lib/layout/layout";
const {AppEnviroment,AppVersion}=APP_CONFIG;
export default function FooterNav() {
    const footerText=(AppEnviroment.REACT_APP_INFOMEX_Q==="TRUE")?`InfoMEX Q - v${AppVersion}` :`InfoMEX - v${AppVersion}`
    return (
        <Footer className="footer">
            <div style={{display:"flex",justifyContent:"end"}}>
                <span>{footerText}</span>
            </div>
        </Footer>
    )
}

