import React,{Suspense} from "react";
import {Layout} from "antd";
import {HeaderNav} from "../../component/layout-components/HeaderNav";
import {Route, Routes} from "react-router-dom";
import {SiderNav} from "../../component/layout-components/SiderNav";
const {Content,Footer}=Layout;

const MachineList=React.lazy(()=>import("../../views/machineListPage"))
const MachineRunList=React.lazy(()=>import("../../views/machineRunListPage"))
export const AppLayout=()=>{
    //strcuture: [(side bar)(header,content)]
    return(
        <Layout>
            <SiderNav/>
            <Layout>
                <HeaderNav/>
                <Content>
                    <Routes>
                        <Route path={"/"} element={<Suspense fallback={<>...</>}><MachineList/></Suspense>}/>
                        <Route path={"/machine/:NomeStampa/:MachineCode"} element={<Suspense fallback={<>...</>}><MachineRunList/></Suspense>}/>
                    </Routes>
                </Content>
                <Footer/>
            </Layout>
        </Layout>
    )
}