import { Route, Routes,Redirect } from 'react-router-dom';
import MachineListPage from "./machineListPage";
import MachineRunListPage from "./machineRunListPage";
import {HeaderNav} from "../component/layout-components/HeaderNav";
import {Layout, message} from "antd";
import FooterNav from "../component/layout-components/FooterNav";
import {useEffect, useState} from "react";
import {SiderNav} from "../component/layout-components/SiderNav";
import {API_STATUS, APP_CONFIG} from "../constants/ApiConstants";
const {Content}=Layout;

export const Views = (props) => {
    /*This function manages the */
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const [titleHeader,setTitleHeader]=useState("");
    const [collapseSider,setCollapseSider]=useState(true);
    const [machineList,setMachineList]=useState([]);
    useEffect(()=>{
        const dataMachine=async ()=>fetch(APP_CONFIG.API_BASE_URL+'macchine',{
            method:"GET",
        }).then(response=>{
            console.log(response);
            if (response.status===API_STATUS.SUCCESS){
                response.json()
                    .then(body=>{
                        console.log('Hi DATA',body)
                        if(body.status==="success"){
                            console.log('DATA GET',body.data)
                            setMachineList(body.data.machines);
                        }
                    });
            }else{
                message.error('Error in the connection.Check the navigator console.')
                console.log(response)
                response.json()
                    .then(body=>{
                        console.log(body)
                    });
            }
        }).catch(error=>console.log(error))
        dataMachine().catch(console.log);
    },[])
    return (
        <Layout style={{height:"100vh",width:"100%"}}>
            <SiderNav collapse={collapseSider} machineList={machineList} userData={userData}/>
            <Layout>
                <HeaderNav {...props} NavTitle={titleHeader} collapseSider={collapseSider} setCollapseSider={setCollapseSider}/>
                <div style={{overflow: "auto"}}>
                    <Content>
                        <Routes>
                            {<Route path={"/"} element={<MachineListPage {...props} title={setTitleHeader} userData={userData}/>}/>}
                            <Route path={"/:NomeStampa/:MachineCode"} element={<MachineRunListPage {...props} title={setTitleHeader} userData={userData} />} />
                        </Routes>
                    </Content>
                </div>
                {/*<FooterNav/>*/}
            </Layout>
        </Layout>
    )
}

export default Views;