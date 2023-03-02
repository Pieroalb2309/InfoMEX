import {Link} from "react-router-dom"
import {CaretRightOutlined} from "@ant-design/icons";

export const MachineOption=({name,id})=>{

    return(
        <Link style={{textDecoration:"none"}} to={`/machine/${name}/${id}`}>
            <div className={'machine-option-container'} >
                <h1 className={'machine-option-title'} >{name}</h1>
                <div className={'machine-option-icon-container'}>
                    <CaretRightOutlined className={'machine-option-icon-active'}/>
                </div>
            </div>
        </Link>
    )
};
export default MachineOption;