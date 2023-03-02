import React from 'react'
import LoginForm from "../../components/LoginComponent";
import { Card, Row, Col } from "antd";
import {HeaderNav} from "../../../../component/layout-components/HeaderNav";
import {env} from "../../../../env";
import {APP_CONFIG} from "../../../../constants/ApiConstants";
//import injectIntl from "../../../../components/util-components/IntlMessage";
const {AppEnviroment}=APP_CONFIG
const backgroundStyle = {
    backgroundColor: '#ffffff',//319d80
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height:"100vh"
}
const textTitle = {
    color: 'black',
    fontSize: 'xxx-large',
    marginBottom: '0px'
}
const textSubTitle = {
    color: 'black',
    fontSize: 'x-large',
    marginBottom: '0px'
}
const textLogin = {
    color: 'black',
    fontSize: 'large'
}

const LoginOne = props => {
    console.log('structure login');
    const titleText=(AppEnviroment.REACT_APP_INFOMEX_Q==="TRUE")?"INFOMEX Q":"INFOMEX"
    return (
        <div>
            <div className="h-100" style={backgroundStyle}>
                <div className="container d-flex flex-column justify-content-center h-100"
                     style={{display:"flex",flexDirection:"column",justifyContent:"center",height:"100%"}}>
                    <div className="text-center" style={{margin:'1rem',display:"flex",justifyContent:"center"}} ><p style={textTitle}>{titleText}</p></div>
                    <div  hidden className="text-center" style={{marginBottom:'1rem',display:"flex",justifyContent:"center"}} ><p style={textSubTitle}>Inizia Sesione</p></div>
                    <Row justify="center">
                        <Col xs={20} sm={20} md={20} lg={7}>
                            <Card style={{borderRadius:"10px",border:"1px black solid"}}>
                                <div className="my-4">
                                    <div className="text-center">
                                        <p hidden={true} style={textLogin}>Inizia Sesione</p>
                                    </div>
                                    <Row justify="center">
                                        <Col xs={24} sm={24} md={20} lg={20}>
                                            <LoginForm {...props} />
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <div style={{display:"flex",justifyContent:"center",margin:"1rem"}}>
                        {env.REACT_APP_INFOMEX_Q==="TRUE"?<h4>InfoMEX Q v{APP_CONFIG.AppVersion}</h4>:<h4>v{APP_CONFIG.AppVersion}</h4>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginOne;
