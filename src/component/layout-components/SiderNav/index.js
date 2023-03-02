import {Button,  Layout, Menu,Avatar} from "antd";
import {useNavigate} from "react-router-dom";
import {LogoutOutlined,UserOutlined} from "@ant-design/icons";
import {useEffect} from "react";

const {Sider}=Layout;
export const SiderNav=(props)=>{
    const {machineList,collapse,userData}=props;
    let navigate=useNavigate();
    const quitSession=()=>{
        sessionStorage.removeItem("user");
        navigate("/");
    }
    const gotoMachine=(id,name)=>{
        navigate(`/machine/${name}/${id}`);
    }
    useEffect(()=>{
        if(!userData?.Name){
            sessionStorage.removeItem("user");
            navigate("/");
        }
    },[userData,navigate])
    //backgroundColor:"#217761",
    return(
        <Sider style={{backgroundColor:"#004c29"}} width={160}  collapsedWidth={0} collapsed={collapse} >
            <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",margin:'0px 0px 0px px',height:"96%"}}>
                <div style={{flex:"0 1 auto",margin:'10px 0px 10px 5px',width:"150px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace: "nowrap" }}>
                    <div style={{display:"flex",justifyContent:"start",alignItems:"center",flexWrap:"wrap"}} >
                        <span style={{marginRight:"0.5rem"}}><Avatar shape={"square"} size={"default"} icon={<UserOutlined style={{color:"#6d7373"}}/>} /></span>
                        <h1 style={{color:"#8D9594",fontSize:(userData.Name.length<8)?"medium":"small",marginBottom:"0"}}>{userData?.Name}</h1>
                    </div>

                </div>
                <div style={{flex:"3 1 auto",margin:'10px 0px 10px 0px'}}>
                    <div style={{height:"100%",backgroundColor:"#004c29"}}>
                        <h2 style={{color:"#8D9594",marginBottom:"0",marginLeft:"5px"}}>Macchine</h2>
                        <Menu theme={"dark"} style={{backgroundColor:"#004c29"}} onClick={(item)=>gotoMachine(item.key,item.item.props.id)}>
                            {machineList.map(machine=>(
                                <Menu.Item  key={machine.MachineCode} id={machine.NomeStampa} >{machine.NomeStampa}</Menu.Item>
                            ))}
                        </Menu>
                    </div>
                </div>
                <div style={{flex:"0 1 auto",margin:'10px 10px 10px 10px'}}>
                    <Button type={"primary"} block icon={<LogoutOutlined />}
                            onClick={()=>quitSession()}>Chiudi Sessione</Button>
                </div>
            </div>
        </Sider>
    )
}