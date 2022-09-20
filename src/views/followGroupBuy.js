import {
    AutoCenter,
    Avatar,
    Button,
    Dialog, Ellipsis,
    Form, Image,
    Input,
    List,
    Space,
    Stepper, Tag, TextArea
} from "antd-mobile";
import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Header from "../components/header";
import ViewGoods from "./viewGoods";
import {doGet} from "../utils/ajax";

export default () => {

    useEffect(()=>{
        navigator.clipboard.readText().then((result) => {
            if(result.includes('/goods_view?groupId=')) {
                let dst = result.substring(result.lastIndexOf('/'), result.indexOf('?'));
                let groupId = result.substring(result.indexOf('=') + 1);
                const getData = async() => {
                    let group = await doGet('/searchGroupByGroupId/' + groupId);
                    Dialog.confirm({
                        content: '您想要查看团购 ' + group.groupTitle +  ' 吗？',
                        onConfirm: () => {
                            navigate(dst, { state: { groupInfo: group, back: '/follow', backState: null }, replace: true });
                        },
                    })
                }
                getData();
            }
        }).catch(e=>{
            console.log("读取剪贴板错误");  
        });
    }, [])

    const [groupLink,setGroupLink] = useState('')

    const navigate = useNavigate()

    const findGroup = async (val) =>{
        let group = await doGet('/searchGroupByGroupId/' + val.link)
        console.log(group)
        if(group === null) return
        navigate('/goods_view', {
            replace: true,
            state: { groupInfo: group, back: '/user', backState:null } }
        )
    }

    const back = () => {
        //window.history.back();
        //window.history.back();
        console.log("回退");
        navigate('/user', { replace: true });
    }

    const goBack = () => {
        //window.history.back();
        console.log("回退");
        navigate('/user', { replace: true });
    }

    useEffect(()=>{
        window.history.pushState(null, null);
        window.addEventListener('popstate', goBack);
        console.log("监听");
        return () => {console.log("移除"); window.removeEventListener('popstate', goBack) };
    }, []);

    // if(groupInfo === null)
        return (
            <div style={{flex: 1}}>
                <Header onBack={back} title='新的跟团' />
                <Form
                    layout='horizontal' onFinish={val=>findGroup(val)}
                    footer={
                        <Button block type='submit' color='primary' size='large' >
                            查找团购
                        </Button>
                    }
                >
                    <Form.Header>查找团购</Form.Header>
                    <Form.Item
                        name='link'
                        label='团购ID'
                        rules={[{ required: true, message: 'ID不能为空' }]}
                    >
                        <Input placeholder='请输入ID' />
                    </Form.Item>
                </Form>
            </div>
        )
    // else
    //     return (
    //         <ViewGoods groupInfo={groupInfo} back={back}/>
    //     )
}
