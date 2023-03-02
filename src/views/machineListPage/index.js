import MachineOption from "../../component/util-components/MachineOption";
//import machinelist from "../../assets/data/machineList.data.json"
import {env} from   "../../env"
import {Button} from "antd";
import {useEffect, useState} from "react";
import {API_STATUS} from "../../constants/ApiConstants";
import {message} from "antd";
const MachineListPage=(props)=>{
    const {api_url,title}=props;
    const [machineList,setMachineList]=useState([]);
    title("Macchine")
    function getMachineList(){
        fetch(api_url+'macchine',{
            method:"GET",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response=>{
            //status:200,500,404,409,201,400
            if (response.status===API_STATUS.SUCCESS){
                response.json()
                    .then(body=>{
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
    }
    useEffect(()=>{
        const dataMachine=async ()=>fetch(api_url+'macchine',{
            method:"GET",
        }).then(response=>{
            console.log(response);
            if (response.status===API_STATUS.SUCCESS){
                response.json()
                    .then(body=>{
                        console.log('DATA',body)
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
  return(
      <div className={'machine-container'} >
          <div hidden className={'machine-sub1-container'}>
              <h1 style={{fontSize:"2.5rem"}}>Macchine</h1>
          </div>
          <div className={'machine-sub2-container'} >
              {
                  machineList.length?
                      <div>
                          <h2 style={{fontWeight:"bold"}}>Selezionare una macchina.</h2>
                          <div className={'machine-list-container'}>
                              {
                                  machineList.map(machine=>(
                                      <MachineOption key={machine.NomeStampa} name={machine.NomeStampa} id={machine.MachineCode} /*id={'S2'}*//>
                                  ))
                              }
                          </div>
                      </div>:
                      <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                          <h2 style={{fontFamily:"Oswald"}}>Non ci sono macchine</h2>
                          <Button onClick={()=>getMachineList()}>Riprova</Button>
                      </div>
              }
          </div>
          {/*<Outlet/>*/}
      </div>
  )
}
export default MachineListPage;