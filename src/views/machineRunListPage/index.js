import React, {useEffect, useState} from "react";
import {FlexGrid,FlexGridColumn,FlexGridCellTemplate} from'@grapecity/wijmo.react.grid'
import {env} from   "../../env"
import {CellRange,GroupRow} from "@grapecity/wijmo.grid";
import * as wjcCore from '@grapecity/wijmo';
import cloneDeep from "clone-deep";
import {EyeOutlined, EyeInvisibleOutlined} from "@ant-design/icons";
import {Button, Modal, Divider, Input, Form, InputNumber, DatePicker,message} from "antd";
//import {LoadingOutlined, PlusOutlined, RightOutlined} from "@ant-design/icons";
import {Link, useParams} from "react-router-dom";
import moment from "moment";
import {APP_CONFIG,API_STATUS} from "../../constants/ApiConstants";
wjcCore.setLicenseKey(APP_CONFIG.WIJMO_KEY);
const TableGrid =({tableData,tableColumns,setSelectedItem,startRow,totalRow,tableType,styled=false})=>{
    //let tablaData=machineRunListData;
    const [gridState,setGridState]=useState(null);
    //const [lastRow,setlastRow]=useState(startRow);
    const initializedGrid=(flex)=>{
        if(totalRow){
            flex.columnFooters.rows.push(new GroupRow());
            flex.bottomLeftCells.setCellData(0, 0, 'Σ');
        }
        setGridState(flex);
    }
    const getRowData=(s,e)=>{
        let x=s._rng.row
        //console.log('cell',x);
        if(setSelectedItem){
            console.log("selected row by wijmo:",tableType,startRow,tableData[x]);
            setSelectedItem(tableData[x]);
        }
    }
    const onFormatItem=(flex,e)=>{
        if(styled===true){
            //console.log("flex",flex);
            //console.log("e",flex);
            //console.log('col:',e.col)
            //console.log(e.row)
            //console.log(e.panel)
            //console.log('col name:',flex.getColumn(e.col).binding)
            let value = e.panel.getCellData(e.row, e.col, false);
            wjcCore.toggleClass(e.cell, 'status-running', value==="IN ESECUZIONE");
            wjcCore.toggleClass(e.cell, 'status-suspended', value==="SOSPESO");
            wjcCore.toggleClass(e.cell, 'status-finished', value==="FINALIZZATO");
        }
    };

    useEffect(()=>{
        console.log("new selected row",tableType,startRow)
        if(gridState){
            //console.log("new selected row",tableType,startRow)
            if(tableData.length){
                if(startRow>0){
                    //setlastRow();
                    //gridState.selection=new CellRange(0,1,0,0);
                    gridState.selection=new CellRange(startRow,0,startRow,0)
                }else{
                    //gridState.selection=new CellRange(0,1,0,0);
                    gridState.selection=new CellRange(0,0,0,0);
                }
            }
        }
    },[gridState,startRow,tableType,tableData])
    return(
        <div style={{padding:10}}>
            {/*console.log('tableData',tableData)*/}
            {tableData.length&& <FlexGrid initialized={(flexGrid)=>{initializedGrid(flexGrid)}} style={{overflow:"auto",height:"220px"}} itemsSource={tableData}
                                          allowResizing="None" selectionMode={"Row"} formatItem={(a,b)=>onFormatItem(a,b)}
                                          allowSorting={false}  onSelectionChanged={(a,b)=>getRowData(a,b)}
                                          allowDragging={false} >
                {tableColumns.map(column=>(
                    <FlexGridColumn key={column.binding} header={column.header} binding={column.binding} width={column.width} aggregate={column.aggregate}
                                    isReadOnly={true} align={"center"}>
                        <FlexGridCellTemplate cellType={"Cell"} template={cell=><React.Fragment>
                            {cell.item[column.binding]}
                        </React.Fragment>}/>
                    </FlexGridColumn>
                ))}
            </FlexGrid>}
        </div>
    )
}
export const MachineRunListPage = (props) => {
    const {api_url,title,userData}=props;
    let {NomeStampa,MachineCode}=useParams();
    const [form] = Form.useForm();
    const [selectedRun,setSelectedRun]=useState({});
    const [selectedSetup,setSelectedSetup]=useState({});
    const [visiblePopUp,setVisiblePopUp]=useState(false);
    const [runData,setRunData]=useState([]);
    const [setupData,setSetupData]=useState([]);
    const [runHistoric,setRunHistoric]=useState([]);
    const [setupDetailData,setSetupDetailData]=useState([]);
    const [btnRunUpdate,setBtnRunUpdate]=useState(false);
    const [btnLevateUpdate,setBtnLevateUpdate]=useState(false);
    const [btnPopUpLoading,setBtnPopUpLoading]=useState(false);
    const [btnRunStoricoStati,setBtnRunStoricoStati]=useState(false);
    const [btnRunHistoric,setBtnRunHistoric]=useState(false);
    const [modalLoading,setModalLoading]=useState(false);
    const [slitSet,setSlitSet]=useState(moment());
    const [startTime,setStartTime]=useState(moment());
    const [endTime,setEndTime]=useState(moment());
    const [lastRun,setLastRun]=useState(0);
    const [lastSetup,setLastSetup]=useState(0);
    const [testDate,setTestDate]=useState(moment());
    //let runData=machineRunListData;
    //let setupData=setupListData;
    let tablaColumns=[
        {
            header:"Run",
            binding:"RunCode",
            aggregate:"None",
            width:80
        },
        {
            header:"Process Order",
            binding:"ProcessOrder",
            aggregate:"None",
            width:130
        },
        {
            header:"Prodotto",
            binding:"ProductCode",
            aggregate:"None",
            width: 130
        },
        {
            header:"Sp.("+String.fromCharCode(181)+"m)",
            binding:"Thickness",
            aggregate:"None",
            width: 70
        },
        {
            header:"Stato Estrusione",
            binding:"status",
            aggregate:"None",
            width: 125
        },{
            header:"Data Operazione",
            binding:"dataOperazione",
            aggregate:"None",
            width: 135
        }
    ];
    let tablaColumns2=[
        {
            header:"Setup",
            binding:"SetUp",
            aggregate:"CntAll",
            width:60
        },
        {
            header:"Levate",
            binding:"Levate",
            aggregate:"Sum",
            width: 70
        },
        {
            header:"Levate Tagliate",
            binding:"LevateTagliate",
            aggregate:"Sum",
            width: 120
        },
        {
            header:"Jumbo Lunghezza (m)",
            binding:"JumboLunghezza",
            aggregate:"None",
            width: 160
        },
        {
            header:"Larghezza (mm)",
            binding:"Larghezza",
            aggregate:"None",
            width: 130
        },
        {
            header:"Trattamento",
            binding:"Trattamento",
            aggregate:"None",
            width: 100
        }
    ];
    let tablaColumns3=[
        {
            header:"Posizione",
            binding:"Position",
            aggregate:"None",
            width:80
        },
        {
            header:"Fascia (mm)",
            binding:"Fascia",
            aggregate:"Sum",
            width: 100
        },
        {
            header:"Cliente",
            binding:"Cliente",
            aggregate:"None",
            width: 300
        },
        {
            header:"Doc Entry",
            binding:"DocEntry",
            aggregate:"None",
            width: 80
        },
        {
            header:"Ordine Cliente",
            binding:"rigaOrdine",
            aggregate:"None",
            width: 150
        },
        {
            header:"Riga Ordine",
            binding:"ordineCliente",
            aggregate:"None",
            width: 130
        },
        {
            header:"Data Consegna Ordine",
            binding:"dataConsegna",
            aggregate:"None",
            width: 170
        }
    ];
    let tablaColumns4=[
        {
            header:"Extrusion Order",
            binding:"ExtrusionOrder",
            aggregate:"None",
            width:120
        },
        {
            header:"Sp.("+String.fromCharCode(181)+"m)",
            binding:"Thickness",
            aggregate:"None",
            width:80
        },
        {
            header:"Larghezza (mm)",
            binding:"Width",
            aggregate:"None",
            width:120
        },
        {
            header:"Jumbo Lunghezza (m)",
            binding:"Length",
            aggregate:"None",
            width:160 //Quantity
        },
        {
            header:"Quantita",
            binding:"Quantity",
            aggregate:"None",
            width:75
        },
        {
            header:"Codice bobina",
            binding:"ReelCode",
            aggregate:"None",
            width:115
        },
        {
            header:"Trattamento",
            binding:"Treatment",
            aggregate:"None",
            width: 100
        },
        {
            header:"Data Inizio",
            binding:"startData",
            aggregate:"None",
            width:120
        },
        {
            header:"Data Fine",
            binding:"endData",
            aggregate:"None",
            width:120
        },
        {
            header:"Operatore",
            binding:"FirstOperator",//ExtrusionStatus
            aggregate:"None",
            width:120
        },//FirstOperator
        {
            header:"Stato",
            binding:"status",//ExtrusionStatus
            aggregate:"None",
            width:120
        }
    ];

    title(`${NomeStampa}`);
    function range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    function disabledDateTime(datedata,typeCompare) {
        //console.log(datedata.date());
        console.log(endTime.diff(startTime))
        if(typeCompare==="start"){
            return {
                disabledHours: () =>(datedata.diff(slitSet,"days"))?[]:range(0, 24).splice(0,slitSet.hour()),
                disabledMinutes: (selectHour) =>(datedata.diff(slitSet,"days"))?[]:(datedata.diff(slitSet,"hours"))?[]:(selectHour>moment().hour())?[]:range(0, 60).splice(0,slitSet.minute())
                //disabledSeconds: (selectHour,selectMinute) => (datedata.diff(slitSet,"hours"))?[]:(selectHour>slitSet.hour())?[]:(selectMinute>slitSet.minute())?[]:range(0, 60).splice(0,slitSet.second()),
            };
        }else{
            return {
                disabledHours: () =>(moment().diff(datedata,"days"))?[]:range(0, 24).splice(moment().hour()+1,24),
                disabledMinutes: (selectHour) =>(moment().diff(slitSet,"days"))?[]:(moment().diff(datedata,"hours"))?[]:(selectHour<moment().hour())?[]:range(0, 60).splice(moment().minute()+1,60)
                //disabledSeconds: (selectHour,selectMinute) =>(moment().diff(datedata,"hours"))?[]:(selectHour<moment().hour())?[]:(selectMinute<moment().minute())?[]:range(0, 60).splice(0,moment().second()+1),
            };
        }


    }
    /*Function:Get the data about the runs from the selected machine (o nly when this function is called)*/
    const getRunData=async ()=> {
        setBtnRunUpdate(true);
        fetch(api_url + `runs?machineCode=${MachineCode}`, {
            method: "GET",
        }).then(response => {
            if (response.status === API_STATUS.SUCCESS) {
                response.json()
                    .then(body => {
                        if (body.status === "success") {
                            console.log('Run list Get',body.data.runs);
                            let data=body.data.runs;
                            //DataOperazione
                            let running=data.find(elm=>elm.ExtrusionStatus==="R");
                            data.forEach(elm=>{
                                if(elm){
                                    elm.status=(elm.ExtrusionStatus==="R")?"IN ESECUZIONE":(elm.ExtrusionStatus==="S")?"SOSPESO":(elm.ExtrusionStatus==="F")?"FINALIZZATO":null
                                    if(running){//There is a campaign with the run status
                                        if(elm.ExtrusionStatus==="S"){
                                            elm.ButtonStatus="ST";
                                        }else if(elm.ExtrusionStatus==="R"||elm.ExtrusionStatus==="F"){
                                            elm.ButtonStatus=elm.ExtrusionStatus;
                                        }else{
                                            elm.ButtonStatus="NT";
                                        }
                                    }else{
                                        if(elm.ExtrusionStatus==="S"){
                                            elm.ButtonStatus="SF";
                                        } else if(elm.ExtrusionStatus==="R"||elm.ExtrusionStatus==="F"){
                                            elm.ButtonStatus=elm.ExtrusionStatus;
                                        }else{
                                            elm.ButtonStatus="NF";
                                        }
                                    }
                                    elm.dataOperazione = (elm.DataOperazione)?moment(elm.DataOperazione).format("DD/MM/YYYY HH:mm"):null//DataOperazione
                                }
                            })
                            //let running=data.find(elm=>elm.ExtrusionStatus==="R");
                            //setRunData(data);
                            setRunData(data);
                            console.log("Runinng Campaing",running);
                            if(running){
                                //console.log(running);
                                //console.log(data.findIndex(elm=>elm.ExtrusionStatus==="R"));
                                //setCampaignRun(running);//Mark the run Campaing
                                setSelectedSetup(running);//Save the selection of the running campaign
                                setLastRun(data.findIndex(elm=>elm.ExtrusionStatus==="R"));
                            }else{
                                //setCampaignRun(data[0]);
                                //setCampaignRun({RunCode:undefined});
                                console.log("selectedRun",selectedRun);
                                let lastselect=data.findIndex(elm=>elm.RunCode===selectedRun.RunCode);
                                console.log("lastselect",lastselect);
                                setLastRun((lastselect>=0)?lastselect:0);
                            }
                        }
                    })
            } else {
                message.error('Error in the conection.Check the navigator console.')
                console.log(response)
                response.json()
                    .then(body => {
                        console.log(body)
                    });
            }
        })
    }
    /*Function:Get the data about the setups from a selected run (only when this function is called)*/
    const getSetUpData=async ()=>{
        setBtnLevateUpdate(true);
        fetch(api_url+`slittingPlans?runCode=${selectedRun.RunCode}`,{
            method:"GET",
            headers:{
                Accept:'application/json',
            }
        }).then(response=>{
            if (response.status===API_STATUS.SUCCESS){
                response.json()
                    .then(body=>{
                        if (body.status==="success"){
                            //console.log('Setup Get',body.data);
                            //Save the new table setup
                            setSetupData(body.data.plans);
                            //Search the last selected setup
                            let setupNotFinish=body.data.plans.find(elm=> elm.SetUp===selectedSetup.SetUp);
                            if (setupNotFinish){//maintain selected setup
                                console.log(body.data.plans.findIndex(elm=>elm.SetUp===selectedSetup.SetUp));
                                console.log(setupNotFinish);
                                //setSelectedSetup(setupNotFinish);
                                setLastSetup(body.data.plans.findIndex(elm=>elm.SetUp===selectedSetup.SetUp));
                            }else{
                                setLastSetup(0);
                            }
                            if (btnRunHistoric){
                                getRunHistoric(0,10);
                            }
                            if(btnRunStoricoStati){
                                getRunHistoric(1,10);
                            }
                            //setSelectedSetup(body.data.plans[0]);
                        }
                    })
            }else{
                message.error('Error in the conection.Check the navigator console.')
                console.log(response)
                response.json()
                    .then(body=>{
                        console.log(body);
                    });
            }
        })
    }
    const getRunHistoric=async(showStatus=0,numberList=10)=>{
        fetch(api_url + `producedJR?`+new URLSearchParams({
            machineCode:MachineCode,
            showStatus:showStatus,
            requestedQuantity:numberList
        }), {
            method: "GET",
        }).then(response => {
            if (response.status === API_STATUS.SUCCESS) {
                response.json()
                    .then(body => {
                        if (body.status === "success") {
                            console.log('Run historic list Get',body.data.producedJR);
                            //let data=body.data.producedJR;
                            let data = body.data.producedJR;
                            data.forEach(elm => {
                                elm.startData = moment(elm.StartDate).format("DD/MM/YYYY HH:mm")//EndDate
                                elm.endData = moment(elm.EndDate).format("DD/MM/YYYY HH:mm")//EndDate
                                elm.status=(elm.ExtrusionStatus==="R")?"IN ESECUZIONE":(elm.ExtrusionStatus==="S")?"SOSPESO":(elm.ExtrusionStatus==="F")?"FINALIZZATO":null
                                if(elm.Length.toString()==="0"){
                                    elm.Length=null;
                                }
                                if(elm.Quantity.toString()==="0"){
                                    elm.Quantity=null;
                                }
                            })
                            setRunHistoric(data);
                        }else{
                            setRunHistoric([]);
                        }
                    })
            } else {
                message.error('Error in the conection.Check the navigator console.')
                console.log(response)
                response.json()
                    .then(body => {
                        console.log(body)
                        setRunHistoric([]);
                    });
            }
        })
    }
    /**/
    const getSetUpDetails=async()=>{
        fetch(api_url+`setup?runCode=${selectedRun.RunCode}`,{
            method:"GET",
            headers:{
                Accept:'application/json',
            }
        }).then(response=>{
            if (response.status===API_STATUS.SUCCESS){
                response.json()
                    .then(body=>{
                        if (body.status==="success"){
                            setSetupDetailData(body.data.setup_details);
                        }
                    })
            }else{
                message.error('Error in the conection.Check the navigator console.')
                console.log(response)
                response.json()
                    .then(body=>{
                        console.log(body);
                    });
            }
        })
    }
    async function getSlitSetDataInizio(){
        const response =await fetch(api_url+`slittingPlanDate?processOrder=${selectedSetup.ProcessOrder}`,{
            method:"GET"
        });
        if (response.status===API_STATUS.SUCCESS){
            let dataJson =await response.json().then(body=>body)
            if (dataJson.status==="success"){
                console.log("given date:",dataJson.data.initialDate)
                const data=moment(dataJson.data.initialDate);
                //console.log(moment(body.data.initialDate))
                //TO change:Always use the start time given by the backend
                //console.log(data)
                if(selectedSetup.SetUp>1){
                    setSlitSet(data);
                    setStartTime(data);
                }else{
                    if(selectedSetup.LevateTagliate<1){
                        let todayDate=moment();
                        todayDate.set({h:0,m:0});
                        console.log(todayDate);
                        setSlitSet(todayDate);
                    }else{
                        setSlitSet(data);
                    }
                }
                return data;
                //setEndTime(data.add(1,"Days"))
            }
        }else{
            console.log(response);
            let dataJson =await response.json().then(body=>body)
            message.error('Error in the server.Check the navigator console.');
            console.log('Error',dataJson)
            if (dataJson){
                if(dataJson.errors){
                    if(dataJson.errors.length>1){
                        dataJson.errors.forEach((value,index)=>{
                            if(index>0){
                                message.warning(value.msg,4);
                            }
                        })
                        if(dataJson.errors.find(elm=>elm.type==="notfound")){
                            let errorData=dataJson.errors.find(elm=>elm.type==="notfound");
                            setModalLoading(false);
                            setVisiblePopUp(false);
                            setBtnLevateUpdate(false);
                            throw new Error(errorData.msg);
                        }
                    }
                }
            }
            const todayDate=moment()
            todayDate.set({h:0,m:0})
            setSlitSet(todayDate)
            return moment();

        }
        /*
        .catch(error=>{
            message.error('Error in the connection.Check the navigator console.')
            console.log(error);
            let todayDate=moment()
            todayDate.set({h:0,m:0})
            setSlitSet(todayDate)
        })
        * */
    }
    async function getSlitSetPlanQuantity(){
        /*Using the endpoint, fetch the required data to get and return the calculated quantity*/
        const response= await fetch(api_url+`slittingPlanQuantity?runCode=${selectedSetup.RunCode}&fascia=${selectedSetup.Larghezza}&lunghezza=${selectedSetup.JumboLunghezza}`,{
            method:"GET"
        })
        if (response.status===API_STATUS.SUCCESS){
            let dataJson =await response.json().then(body=>body)
            if (dataJson.status==="success"){
                console.log('Calculated Quantity:',dataJson.data);
                return dataJson.data.quantity;
                //form.setFieldsValue(jsonPopUp);
                //form.resetFields();
                //setVisiblePopUp(true);
            }
        }else {
            console.log(response);
            let dataJson =await response.json().then(body=>body)
            message.error('Error in the server.Check the navigator console.');
            console.log('Error', dataJson);
            if (dataJson){
                if(dataJson.errors){
                    if(dataJson.errors.length>1){
                        dataJson.errors.forEach((value,index)=>{
                            if(index>0){
                                message.warning(value.msg,4);
                            }
                        })
                        if(dataJson.errors.find(elm=>elm.type==="notfound")){
                            let errorData=dataJson.errors.find(elm=>elm.type==="notfound");
                            setModalLoading(false);
                            setVisiblePopUp(false);
                            setBtnLevateUpdate(false);
                            throw new Error(errorData.msg);
                        }
                    }

                }
            }
            return null;
        }
    }
    /*This functions is called when the "slit-button"(Completamento Levata) was clicked.*/
    const openModal= async()=>{
        if(selectedSetup){
            try{
                let dataInizio=await getSlitSetDataInizio()
                let dataQuantity=await getSlitSetPlanQuantity()
                let jsonPopUp={
                    RunCode:selectedSetup.RunCode,
                    ProductCode:selectedSetup.ProductCode,
                    Thickness:selectedSetup.Thickness,
                    SetUp:selectedSetup.SetUp,
                    StartDate:dataInizio,
                    //StartHour:dataInizio,
                    EndDate:moment(),
                    //EndHour:moment(),
                    JumboLunghezza:selectedSetup.JumboLunghezza,
                    Quantity:dataQuantity
                }
                console.log('Form data:',jsonPopUp)
                form.setFieldsValue(jsonPopUp);
                setVisiblePopUp(true);
            }catch (e) {
                message.warning("Error in the fetch process.check the logs",3);
                console.log(e);
                getRunData();
                setBtnLevateUpdate(false);
            }
            return
        }else{
            message.warning("Per favore, seleziona una riga",3);
            getRunData();
            setBtnRunUpdate(false);
        }

        let dataInizio=await getSlitSetDataInizio().catch(console.log);
        let dataQuantity=await getSlitSetPlanQuantity().catch(console.log);
        let jsonPopUp={
            RunCode:selectedSetup.RunCode,
            ProductCode:selectedSetup.ProductCode,
            Thickness:selectedSetup.Thickness,
            SetUp:selectedSetup.SetUp,
            StartDate:dataInizio,
            //StartHour:dataInizio,
            EndDate:moment(),
            //EndHour:moment(),
            JumboLunghezza:selectedSetup.JumboLunghezza,
            Quantity:dataQuantity
        }
        console.log('Form data:',jsonPopUp)
        try{
            form.setFieldsValue(jsonPopUp);
            setVisiblePopUp(true);
        }catch (e) {
            console.log(e)
        }
        //console.log(jsonPopUp);
        //
        //form.resetFields();
        //setVisiblePopUp(true);
    }
    /*Called Function when the form is submitted*/
    const handleOk=()=>{
        form.validateFields()
            .then(values => {
                let data_clone=cloneDeep(values);
                data_clone.jumboLunghezza=selectedSetup.jumboLunghezza;
                data_clone.larghezza=selectedSetup.larghezza;
                data_clone.startDate=moment(data_clone.StartDate).format("YYYY-MM-DD HH:mm:ss");
                data_clone.endDate=moment(data_clone.EndDate).format("YYYY-MM-DD HH:mm:ss");
                console.log(data_clone.EndDate.diff(data_clone.StartDate))
                console.log('b',data_clone.StartDate.diff(data_clone.EndDate))
                if(data_clone.EndDate.diff(data_clone.StartDate)>0){//2nd validation: if the data fine is after data inizio
                    console.log('All data submited',data_clone)
                    setModalLoading(true);
                    /*Put the fetch code here*/
                    fetch(api_url+`slitset`,{
                        method:"POST",
                        headers:{
                            Accept:'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            runCode:data_clone.RunCode.toString(),
                            pattern:data_clone.SetUp,
                            startDate:data_clone.startDate,
                            endDate:data_clone.endDate,
                            quantity:data_clone.Quantity,
                            length:data_clone.JumboLunghezza,
                            operatorUser:userData.Username
                        })
                    }).then(response=>{
                        if (response.status===API_STATUS.SUCCESS){
                            response.json()
                                .then(body=>{
                                    setBtnPopUpLoading(false);
                                    if (body.status==="success"){
                                        message.success('Done',2);
                                        setModalLoading(false);
                                        setVisiblePopUp(false);
                                        getSetUpData();
                                        setBtnLevateUpdate(false);
                                        //setSetupData(body.data.plans);
                                        //setSelectedSetup(body.data.plans[0]);
                                    }else{
                                        message.error('Error in the server.Check the navigator console.',1);
                                        console.log(body);
                                        if (body){
                                            if(body.errors){
                                                if(body.errors.length>1){
                                                    body.errors.forEach((value,index)=>{
                                                        if(index>0){
                                                            message.warning(value.msg,4);
                                                        }
                                                    })
                                                    if(body.errors.find(elm=>elm.type==="notfound")){
                                                        setModalLoading(false);
                                                        setVisiblePopUp(false);
                                                        getRunData();
                                                        setBtnRunUpdate(false);
                                                    }
                                                }
                                            }
                                        }

                                    }
                                })
                        }else{
                            message.error('Error in the conection.Check the navigator console.',1)
                            console.log(response)
                            response.json()
                                .then(body=>{
                                    setModalLoading(false);
                                    console.log(body);
                                    if (body){
                                        if(body.errors){
                                            if(body.errors.length>1){
                                                body.errors.forEach((value,index)=>{
                                                    if(index>0){
                                                        message.warning(value.msg,4);
                                                    }
                                                })
                                                if(body.errors.find(elm=>elm.type==="notfound")){
                                                    setModalLoading(false);
                                                    setVisiblePopUp(false);
                                                    getRunData();
                                                    setBtnRunUpdate(false);
                                                }
                                            }
                                        }
                                    }
                                });
                        }
                    }).catch(error=>{
                        message.error('Error in the fetch process.Check the navigator console.');
                        setModalLoading(false);
                        console.log(error)
                    })
                    //If the fetch returns a success, +1 to the selectedsetup and close the popUp
                    //+1 to the selectedsetup
                    //let thisSetup=setupData.find(setup=>setup.setup===selectedSetup.setup);
                    //thisSetup.levateTagliate++;
                    //console.log('+1 to the setup',thisSetup)
                    //close POPUP
                }else{
                    message.error("La data fine deve essere successiva alla data inizio",4)
                }
            })
            .catch(error=>{
                setModalLoading(false);
                console.log('form error',error);
                message.error("Error in the process:",4)
                if(error.errorFields){
                    error.errorFields.forEach(elm=>{
                        message.error(elm.errors[0],4);
                    })
                }

            })
    }
    /**/
    const updateRunStatus=(newStatus)=>{
        console.log('selected run to change status',selectedRun.RunCode);
        if (selectedRun.RunCode){
            changeStatus(newStatus).catch(console.log);
        }else{
            message.info("Please, select a campaign",3);
        }
    }
    const changeStatus=async (newStatus)=>{
        let dataStatus=(APP_CONFIG.AppDataInputTest==="TRUE")?testDate:moment();
        if (dataStatus){
            let data={
                runCode:selectedRun.RunCode.toString(),
                pattern: 1,
                startDate:dataStatus,
                endDate:dataStatus,
                runStatus:newStatus,
                operatorUser:userData.Username
            };
            console.log("Change Status",data);
            const response=await fetch(api_url+`slitset`,{
                method:"POST",
                headers:{
                    Accept:'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            console.log(response);
            if (response.status===API_STATUS.SUCCESS){
                response.json()
                    .then(body=>{
                        console.log(body);
                        if (body.status==="success"){
                            message.success('Done',2);
                            //setLoading1(true);
                            getRunData();
                            //setLoading1(false);
                            setBtnRunUpdate(false);
                            if(btnRunHistoric) {
                                getRunHistoric(0, 10).catch(console.log);
                            }
                            if(btnRunStoricoStati) {
                                getRunHistoric(1, 10).catch(console.log);
                            }
                        }else{
                            message.error('Error in the server.Check the navigator console.')
                            console.log(body)
                        }
                    })
            }else{
                message.error('Error in the conection.Check the navigator console.')
                console.log(response)
                response.json()
                    .then(body=>{
                        console.log(body);
                    });
            }
        }else{
            message.error("Error in the inserted date");
        }

    }
    const finalizeRunConfirmation=()=>{
        let levataTotal=0
        let levataTaglioTotal=0
        if (setupData){
            setupData.forEach(elm=>{
                if(elm){
                    levataTotal+=elm.Levate
                    levataTaglioTotal+=elm.LevateTagliate
                }
            })
            Modal.confirm({title:"Avvertimento:",content:"Sei sicuro di finalizzare questa campagna?",
                okText:"Anulla",cancelText:"Ok",
                onOk(){
                    console.log("Cancel");
                },
                onCancel(){
                    if(levataTotal>levataTaglioTotal){
                        Modal.confirm({title:"Avvertimento:",
                            content:"La campagna che stai per finalizzare non risulta materialmente completata. Vuoi procedere comunque?",
                            okText:"Anulla",cancelText:"Ok",
                            onOk(){
                                console.log("Cancel");
                            },
                            onCancel(){
                                changeStatus("F").catch(console.log);

                            }
                        })
                    }else {
                        changeStatus("F").catch(console.log);

                    }
                }
            });
            /*
            if (window.confirm("Sei sicuro di finalizzare questa campagna?") === true) {
                if(levataTotal>levataTaglioTotal){
                    //console.log("second message")
                    if (window.confirm("La campagna che stai per finalizzare non risulta materialmente completata. Vuoi procedere comunque?") === true){
                        //console.log("change status only second confirmation")
                        changeStatus("F");
                    }
                }else{
                    changeStatus("F");
                }
            }*/
        }else{
            message.info("Error in the proccess.",2)
        }
    }
    const openCloseRunHistoric=()=>{
        if(btnRunHistoric){
            setBtnRunHistoric(false);
        }else{
            //call function that consumes API
            if(btnRunStoricoStati){
                setBtnRunStoricoStati(false);
            }
            getRunHistoric(0,10).catch(console.log);
            setBtnRunHistoric(true);
        }
    }
    const openCloseRunStoricoStati=()=>{
        if(btnRunStoricoStati){
            setBtnRunStoricoStati(false);
        }else{
            //call function that consumes API
            if(btnRunHistoric){
                setBtnRunHistoric(false);
            }
            getRunHistoric(1,10).catch(console.log);
            setBtnRunStoricoStati(true);
        }
    }
    /*Function:Get the data about the machine's runs (only when the page is initialized)*/
    useEffect(()=>{
        const getRuns=async()=>{
            const response= await fetch(api_url+`runs?machineCode=${MachineCode}`,{
                method:"GET",
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            if (response.status===API_STATUS.SUCCESS){
                response.json()
                    .then(body=>{
                        if (body.status==="success"){
                            let running=body.data.runs.find(elm=>elm.ExtrusionStatus==="R");
                            console.log('Run list Get',body.data.runs);
                            body.data.runs.forEach(elm=>{
                                if(elm){
                                    elm.status=(elm.ExtrusionStatus==="R")?"IN ESECUZIONE":(elm.ExtrusionStatus==="S")?"SOSPESO":(elm.ExtrusionStatus==="F")?"FINALIZZATO":null
                                    if(running){//There is a campaign with the run status
                                        if(elm.ExtrusionStatus==="S"){
                                            elm.ButtonStatus="ST";
                                        }else if(elm.ExtrusionStatus==="R"||elm.ExtrusionStatus==="F"){
                                            elm.ButtonStatus=elm.ExtrusionStatus;
                                        }else{
                                            elm.ButtonStatus="NT";
                                        }
                                    }else{
                                        if(elm.ExtrusionStatus==="S"){
                                            elm.ButtonStatus="SF";
                                        } else if(elm.ExtrusionStatus==="R"||elm.ExtrusionStatus==="F"){
                                            elm.ButtonStatus=elm.ExtrusionStatus;
                                        }else{
                                            elm.ButtonStatus="NF";
                                        }
                                    }
                                    elm.dataOperazione = (elm.DataOperazione)?moment(elm.DataOperazione).format("DD/MM/YYYY HH:mm"):null//DataOperazione
                                }
                            })
                            setRunData(body.data.runs);
                            //console.log("Runinng Campaing",running);
                            if(running){
                                //console.log(data.findIndex(elm=>elm.ExtrusionStatus==="R"));
                                //setCampaignRun(running);//Mark the run Campaing
                                setSelectedSetup(running);//Save the selection of the running campaign
                                setLastRun(body.data.runs.findIndex(elm=>elm.ExtrusionStatus==="R"));
                            }else{
                                //setCampaignRun(data[0]);
                                if(body.data.runs.length>0){
                                    console.log("no Runinng Campaing",body.data.runs[0]);
                                    setSelectedSetup(body.data.runs[0]);
                                }
                                //setLastRun(0);
                            }
                        }
                    })
            }else{
                message.error('Error in the conection.Check the navigator console.')
                console.log(response)
                response.json()
                    .then(body=>{
                        console.log(body)
                    });
            }
        };
        if (MachineCode!==undefined){
            //setLoading1(true);
            getRuns().catch(console.log);
            //setLoading1(false);
        }
    },[api_url,MachineCode])
    /*Function:Get the data about the setups per run (only when the operator selects a run)*/
    useEffect(() => {
        const getSetupList = async () => {
            let text = selectedRun.RunCode;
            //console.log(text)
            //let text="28230";
            setLastSetup(0);
            const response =await fetch(api_url + `slittingPlans?runCode=` + text, {
                method: "GET",
            })
            if (response.status === API_STATUS.SUCCESS) {
                response.json()
                    .then(body => {
                        if (body.status === "success") {
                            //console.log('Setup Get',body.data.plans[0]);
                            setSetupData(body.data.plans);
                            let setupNotFinish = body.data.plans.find(elm => elm.Levate > elm.LevateTagliate);
                            if (setupNotFinish) {
                                console.log("setup new unfinished pattern",setupNotFinish)
                                //console.log(body.data.plans.findIndex(elm => elm.Levate > elm.LevateTagliate))
                                setSelectedSetup(setupNotFinish);
                                setLastSetup(body.data.plans.findIndex(elm => elm.Levate > elm.LevateTagliate))
                            } else {
                                console.log("setup the first pattern")
                                setLastSetup(0)
                            }
                            //setSelectedSetup(body.data.plans[0]);
                            //console.log("setup not finish",setupNotFinish)
                            //console.log("last setup",body.data.plans.findIndex(elm=>elm.Levate>elm.LevateTagliate))
                        }
                    })
            } else {
                message.error('Error in the conection.Check the navigator console.')
                console.log(response)
                response.json()
                    .then(body => {
                        console.log(body);
                    });
            }
        }
        if (selectedRun.RunCode !== undefined) {
            //console.log(selectedRun);
            //getSetUpData(selectedRun.RunCode).catch(console.log);
            getSetupList().catch(console.log);
        }
    },[api_url,selectedRun])
    /*Function:Get the data about the details of the setups and run (only when the operator selects a run)*/
    useEffect(() => {
        const getSetupDetailList = async () => {
            const response= await fetch(api_url + `setup?runCode=${selectedRun.RunCode}&setUp=${selectedSetup.SetUp}`, {
                method: "GET",
            })
            if (response.status === API_STATUS.SUCCESS) {
                response.json()
                    .then(body => {
                        if (body.status === "success") {
                            console.log('Setup Detail list',body.data);
                            let data = body.data.setup_details;
                            data.forEach(elm => {
                                elm.dataConsegna = moment(elm.DataConsegna).format("DD/MM/YYYY")
                            })
                            setSetupDetailData(body.data.setup_details);
                        }
                    })
            } else {
                message.error('Error in the conection.Check the navigator console.')
                console.log(response)
                response.json()
                    .then(body => {
                        console.log(body);
                    });
            }
        }
        if (selectedRun.RunCode !== "") {
            //console.log(selectedRun);
            //console.log(selectedSetup);
            //getSetUpData(selectedRun.RunCode).catch(console.log);
            if (selectedSetup.SetUp !== undefined) {
                getSetupDetailList().catch(console.log);
            }
        }
    },[api_url,selectedRun,selectedSetup])
  return(
      <div className={'list-container'}>
          <div hidden className={'list-sub1-container'}>
              {/*Container for the title*/}
              <div >
                  <h1 style={{marginBottom:"0"}} >{NomeStampa}</h1>
              </div>
          </div>
          <div className={'list-sub2-container'} >
              <div className={'flex-container'} >
                  <div style={{display:"flex",flexDirection:"column"}}>
                      <div className={'machine-page-button-container'} style={{display:"flex", alignItems:"center"}}>
                          <Button style={{marginRight:"1rem"}} icon={btnRunHistoric?<EyeInvisibleOutlined/>:<EyeOutlined/>} onClick={() => openCloseRunHistoric()}>Visualizza Jumbo Roll</Button>
                          <Button  icon={btnRunStoricoStati?<EyeInvisibleOutlined/>:<EyeOutlined/>} onClick={() => openCloseRunStoricoStati()}>Visualizza Storico Stati</Button>
                      </div>
                      <div className={'run-container'} style={{display:"flex",justifyContent:"center"}}>
                          <div className={'run-table-container'} /*style={{padding:"0 5px"}}*/ >
                              <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"}}>
                                  <h1 style={{margin:0}}>Run list per macchina</h1>
                                  <Button style={{margin:'0 0 0 0.5rem'}} loading={btnRunUpdate}
                                          onClick={()=>{getRunData();setBtnRunUpdate(false);}}  >Aggiorna elenco run</Button>
                              </div>
                              {runData.length?<div  >
                                  <div className={'table-container'}>
                                      <TableGrid key={"tableRun"} tableType={"Run"} tableData={runData} tableColumns={tablaColumns}
                                                 setSelectedItem={setSelectedRun} startRow={lastRun} totalRow={false} styled={true}/>
                                  </div>
                                  <div key={"test-dateTime-input"} hidden={APP_CONFIG.AppDataInputTest!=="TRUE"}>
                                      <DatePicker showTime format={"YYYY-MM-DD HH:mm"} onOk={(date)=> {setTestDate(date)}} />
                                  </div>
                              </div>:<div className={'table-container'} style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
                                  <h2 style={{fontFamily:"Oswald", fontWeight:"normal"}}>Non ci sono Run programmate su questa macchina</h2>
                              </div>}
                          </div>
                          {(selectedRun.RunCode!==undefined)?<div className={"option-button-container"} style={{padding:"0 5px"}}>
                              <Button hidden={selectedRun.ButtonStatus==="ST"||selectedRun.ButtonStatus==="NT"||selectedRun.ButtonStatus==="F"||selectedRun.ButtonStatus==="R"} type={"default"} size={"large"}
                                      block={false} style={{
                                  border: "1px solid black",
                                  borderRadius: "10px",
                                  fontWeight: "bold",
                                  marginBottom: "1rem"
                              }}
                                      onClick={() => {updateRunStatus("R")}}>Inizia</Button>
                              <Button
                                  hidden={selectedRun.ButtonStatus==="ST"||selectedRun.ButtonStatus==="SF"||selectedRun.ButtonStatus === "F"||selectedRun.ButtonStatus === "NT"||selectedRun.ButtonStatus==="NF"}
                                  type={"default"} size={"large"} block={false} style={{
                                  border: "1px solid black",
                                  borderRadius: "10px",
                                  fontWeight: "bold",
                                  marginBottom: "1rem"
                              }}
                                  onClick={() => {updateRunStatus("S")}}>Sospendi</Button>
                              <Button
                                  hidden={selectedRun.ButtonStatus === "F"||selectedRun.ButtonStatus === "NT"||selectedRun.ButtonStatus==="NF"}
                                  type={"default"} size={"large"} block={false}
                                  style={{
                                      border: "1px solid black",
                                      borderRadius: "10px",
                                      fontWeight: "bold",
                                      marginBottom: "1rem"
                                  }}
                                  onClick={() => {finalizeRunConfirmation()}}>Finalizza</Button>
                          </div>:null}
                      </div>
                  </div>
                  {selectedRun.RunCode!==undefined &&
                      <div className={'setup-container'} >
                          <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"}}>
                              <h1 style={{margin:0}}>Setup per run: {selectedRun.RunCode}</h1>
                              <Button style={{margin:'0 0 0 0.5rem'}} loading={btnLevateUpdate} onClick={()=>{getSetUpData();setBtnLevateUpdate(false)}} >Aggiorna elenco levate</Button>
                          </div>
                          <div className={'setup-table-container'} >
                              {setupData.length?<div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                                  <div className={'table-container'}>
                                      <TableGrid key={"tableSetup"} tableData={setupData} tableColumns={tablaColumns2} tableType={"Setup"}
                                                 setSelectedItem={setSelectedSetup} startRow={lastSetup} totalRow={true}/>
                                  </div>
                                  <div className={'button-container'} hidden={selectedSetup === undefined}
                                       style={{display: "flex", justifyContent: "center"}}>
                                      <Button key={"slit-button"} type={"default"} size={"large"} block={false} style={{
                                          border: "1px solid black",
                                          borderRadius: "10px",
                                          fontWeight: "bold",
                                          marginBottom: "1rem"
                                      }} hidden={selectedRun.ExtrusionStatus!=="R"} onClick={() => {
                                          setBtnPopUpLoading(true);
                                          openModal()
                                      }} loading={btnPopUpLoading}>Completamento Levata</Button>
                                  </div>
                              </div>:<div className={'table-container'} style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
                                  <h2 style={{fontFamily:"Oswald", fontWeight:"normal"}}>Non ci sono installazioni pianificate per questa esecuzione.</h2>
                              </div>}
                          </div>
                      </div>}
                  {(selectedSetup.SetUp!==undefined) &&
                      <div className={'setup-details-container'}>
                          <div style={{display:"flex",flexDirection:"row",alignItems:"center",marginBottom:"0rem"}}>
                              <h1 style={{margin:0}}>Dettaglio Setup:</h1>
                          </div>
                          <div className={'table-container'} style={{minHeight:"25vh"}}>
                              <TableGrid key={"tableSetup"} tableData={setupDetailData} tableColumns={tablaColumns3} tableType={"Setup-Detail"} totalRow={true}/>
                          </div>
                      </div>
                  }
                  {(btnRunHistoric||btnRunStoricoStati) &&
                      <div className={'run-historic-container'}>
                          <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:"0rem"}}>
                              <h1 hidden={!btnRunHistoric} style={{margin:0}}>Elenco Jumbo Prodotte: {NomeStampa}</h1>
                              <h1 hidden={!btnRunStoricoStati} style={{margin:0}}>Storico degli stati: {NomeStampa}</h1>
                          </div>
                          <div className={'setup-table-container'} >
                              {runHistoric.length?<div>
                                  <div className={'table-container'}>
                                      <TableGrid key={"tableRunHistoric"} tableData={runHistoric} tableColumns={tablaColumns4} tableType={"Run-historic"}
                                                 totalRow={false} styled={true}/>
                                  </div>
                              </div>:<div className={'table-container'} style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
                                  <h2 style={{fontFamily:"Oswald", fontWeight:"normal"}}>Non ci sono dati disponibili.</h2>
                              </div>}
                          </div>
                      </div>}
                  {/*PopUp*/}
                  <Modal visible={visiblePopUp} onCancel={()=> {form.resetFields();setBtnPopUpLoading(false);setModalLoading(false);setVisiblePopUp(false)}}
                         className={'modal-levate-container'} centered
                         okText={"Completamento Bobina"}
                         okButtonProps={{type:"default",style:{fontWeight:"bold",border:"1px solid black"}}}
                         confirmLoading={modalLoading}
                         cancelButtonProps={{hidden:true}} onOk={()=>handleOk()}>
                      <Form form={form} labelCol={{ span: 9 }} wrapperCol={{ span: 24 }}
                            layout={"horizontal"} name={"addJumboRoll"}>
                          <div className={'form-container'} style={{display:"flex",justifyContent:"space-around"}}>
                              <div className={'modal-column-expand-container'}>
                                  <h2 style={{fontWeight:"bold",padding:'10px'}}>Slit set (Levata)</h2>
                                  <div style={{padding:'10px'}}>
                                      <Form.Item name={"RunCode"} label={"Run"} >
                                          <Input bordered={true} disabled={true} />
                                      </Form.Item>
                                      <Form.Item name={"ProductCode"} label={"Product"}>
                                          <Input bordered={true} disabled={true} />
                                      </Form.Item>
                                      <Form.Item name={"Thickness"} label={"Spessore("+String.fromCharCode(181)+"m)"}>
                                          <Input bordered={true} disabled={true}  />
                                      </Form.Item>
                                      <Form.Item name={"SetUp"} label={"Setup"} >
                                          <Input bordered={true} disabled={true} />
                                      </Form.Item>
                                  </div>
                              </div>
                              <Divider className={"divider-vertical"} type={"vertical"}/>
                              <div className={'modal-column-expand-container'}>
                                  <h2 style={{fontWeight:"bold",padding:'10px'}}>Slit set details</h2>
                                  <div style={{padding:'10px'}}>
                                      <Form.Item name={"StartDate"} label={"Data Inizio"} >
                                          <DatePicker showTime format="YYYY-MM-DD HH:mm" allowClear={false}
                                                      disabledDate={(current)=> (APP_CONFIG.AppDataInputTest==="TRUE")?"":current<slitSet}
                                                      onOk={(date)=>setStartTime(date)} status={(endTime.diff(startTime)>0)?"":"error"}
                                                      disabledTime={(date)=>(APP_CONFIG.AppDataInputTest==="TRUE")?{}:disabledDateTime(date,"start")}
                                          />
                                      </Form.Item>
                                      <Form.Item name={"EndDate"} label={"Data Fine"} >
                                          <DatePicker showTime format="YYYY-MM-DD HH:mm" allowClear={false}
                                                      disabledDate={(current)=> (APP_CONFIG.AppDataInputTest==="TRUE")?"":current>moment()}
                                                      onOk={(date)=>setEndTime(date)}
                                                      status={(endTime.diff(startTime)>0)?"":"error"}
                                                      disabledTime={(date)=>(APP_CONFIG.AppDataInputTest==="TRUE")?{}:disabledDateTime(date,"end")}
                                          />
                                      </Form.Item>
                                      <Form.Item name={"JumboLunghezza"} label={"Lunghezza (m)"}>
                                          <InputNumber min={1} />
                                      </Form.Item>
                                      <Form.Item name={"Quantity"} label={"Quantità (Kg)"}
                                                 rules={[{
                                              required: true,
                                              message: 'Per favore, inserisci la quantità'}]}>
                                          <InputNumber min={1} />
                                      </Form.Item>
                                  </div>
                                  {/*<Button icon={<PlusOutlined/>}>Completamento Bobina</Button>*/}
                              </div>
                          </div>
                      </Form>
                  </Modal>
              </div>

          </div>
          <div hidden style={{display:"flex",justifyContent:"start"}}>
              {env.REACT_APP_INFOMEX_Q==="TRUE"?<h4>InfoMEX Q</h4>:null}
          </div>
      </div>
  )
}
export default MachineRunListPage;