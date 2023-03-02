import {Header} from "antd/lib/layout/layout";
import { MenuUnfoldOutlined,MenuFoldOutlined} from "@ant-design/icons";
import {APP_CONFIG} from "../../../constants/ApiConstants";
const {AppEnviroment,AppVersion}=APP_CONFIG;
export const HeaderNav = props => {
    //get information of the user and the current.
    const {NavTitle,collapseSider,setCollapseSider}=props
    const { navCollapsed, mobileNav, navType, headerNavColor, toggleCollapsedNav, onMobileNavToggle, isMobile } = props;
    const appVersionText=(AppEnviroment.REACT_APP_INFOMEX_Q==="TRUE")?`InfoMEX Q - v${AppVersion}` :`InfoMEX - v${AppVersion}`

    const collapseMenu=()=>{
        if(collapseSider){
            setCollapseSider(false);
        }else{
            setCollapseSider(true);
        }
    }
    return (
        <Header className={`app-header`} style={{backgroundColor: "#319d80"}}>
            <div className={`app-header-wrapper`}>
                {/*aca va el logo src/components/layout-components/Logo */}
                {/*<div style={rebecaTextHeader}>Rebeca</div>*/}
                <div className="nav" style={{display:"flex",justifyContent:"space-between"}}>
                    <div className="nav-left" style={{display:"flex",alignItems:"baseline"}}>
                        {/*<span title={"Log out"} onClick={()=>navigate(-1)}><LeftCircleOutlined/></span>*/}
                        <span className="collapse-button-container" onClick={()=>collapseMenu()}>
                            {collapseSider?<MenuUnfoldOutlined />:<MenuFoldOutlined />}
                        </span>
                        <h1 style={{marginBottom:"0",fontSize:"xx-large",color:"White"}}>{NavTitle}</h1>
                    </div>
                    <div className="nav-right" style={{display:"flex"}}>
                        <h1 style={{color:"White"}}>{appVersionText}</h1>
                    </div>
                </div>

            </div>
        </Header>
    )
}