import React,{useState,useEffect} from 'react'
import {Button, Form, Input, Alert, Checkbox, Modal, message} from "antd";
import {UserOutlined,LockOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import {API_STATUS,APP_CONFIG} from "../../../constants/ApiConstants";
import {SendEmail} from "../../../utils";
const {API_BASE_URL,AppEnviroment}=APP_CONFIG;
const LoginForm =props=>{
    const {setUser}=props;
    console.log("loginform")
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading,setLoading]=useState(false);
    const onLogin=()=>{
        form.validateFields()
            .then(values=>{
                //sessionStorage.clear();
                setLoading(true);
                //setToken(form.getFieldValue("username"));
                console.log(values)
                fetch(API_BASE_URL+'login?'+new URLSearchParams(
                    {username: values.username, password: values.password}
                ),{
                    method:"GET",
                    headers:{
                        Accept:'application/json',
                    }
                }).then(response=>{
                    if (response.status===API_STATUS.SUCCESS){
                        response.json()
                            .then(body=>{
                                if (body.status==="success"){
                                    //setSetupDetailData(body.data.setup_details);
                                    console.log(body);
                                    setUser(body.data.user);
                                    navigate("machine");
                                    //setLoading(true);
                                }
                            })
                    }else{
                        console.log(response)
                        response.json()
                            .then(body=>{
                                //message.error('Error in the server.Check the navigator console.');
                                console.log('Error', body);
                                if(body.errors){
                                    if(body.errors.length>1){
                                        body.errors.forEach((value,index)=>{
                                            if(index>0){
                                                message.error(value.msg,4);
                                            }
                                        })
                                        if(body.errors.find(elm=>elm.type==="conflict")){
                                            let errorData=body.errors.find(elm=>elm.type==="conflict");
                                            setLoading(false);
                                            throw new Error(errorData.msg);
                                        }
                                    }
                                }
                            });
                    }
                })
            }).catch(error=>{
                message.error('Error in the conection.Check the navigator console.');
                console.log(error);
                setLoading(false)
            })

    }
    const onLoginToTest=()=>{
        setLoading(true);
        form.validateFields()
            .then(values=>{
                let userData={
                    Username:values.username,
                    Name:values.username
                }
                setUser(userData);
                setLoading(false);
                navigate("machine")
            })

    }
    return (
        <>
            <Form form={form} layout={"vertical"} name={"login-form"} >
                <Form.Item name={"username"} label={"Utenti"}>
                    <Input prefix={<UserOutlined className="text-primary" />}/>
                </Form.Item>
                <Form.Item hidden name={"password"} label={"Contrasegna"} >
                    <Input.Password disabled prefix={<LockOutlined className="text-primary"/>}/>
                </Form.Item>
                <Button type={"primary"} className={"text-center"} onClick={()=>onLoginToTest()} htmlType={"submit"} block loading={loading}>Inizia sessione</Button>
            </Form>
        </>
    )
};
export default LoginForm;