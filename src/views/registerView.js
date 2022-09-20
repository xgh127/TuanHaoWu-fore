import React, { useEffect } from 'react';
import { Form, TextArea, Button, Input, ImageUploader, Toast, NavBar } from 'antd-mobile';
import { imageUpload } from '../utils/imageUpload';
import { doJSONPost } from '../utils/ajax';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';

export default () => {
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const goBack = () => {
        navigate('/login', { replace: true });
    }
  
    useEffect(()=>{
      window.history.pushState(null, null);
      window.addEventListener('popstate', goBack);
      console.log("监听");
      return () => {console.log("移除"); window.removeEventListener('popstate', goBack) };
    }, []);

    const onFinish = async (v) => {
        console.log(JSON.stringify(v));
        let [urlJSON] = v["picture"];
        v["picture"] = urlJSON.url;
        let response = await doJSONPost("/register", v);
        if(response.status == 0) {
            Toast.show({
                content: response.msg,
                afterClose: () => {
                    window.history.back();
                    goBack();
                },
                icon: 'success'
            });
        } else {
            Toast.show({
                content: response.msg,
                icon: 'fail'
              });
        }
    }

    return (
        <div style={{flex: 1}}>
            <NavBar onBack={() => { window.history.back(); goBack(); }} />
            <Form layout="horizontal" onFinish={v=>onFinish(v)} footer={
                <Button block type='submit' color='primary' size='large'>
                注册
                </Button>
            }
            mode='card'
            form={form}
            >

                <Form.Header>新用户注册</Form.Header>
                <Form.Item name='account' label='用户名' rules={[{required: true, message: "用户名不能为空"}]}>
                    <Input placeholder='请输入用户名' />
                </Form.Item>

                <Form.Item name='password' label='密码' rules={[{required: true, message: "密码不能为空"}]}>
                    <Input type="password" placeholder='请输入密码' />
                </Form.Item>

                <Form.Item name='name' label='昵称'>
                    <Input placeholder='请输入昵称' />
                </Form.Item>

                <Form.Item name='picture' label='头像'>
                    <ImageUploader upload={ imageUpload } maxCount={1} multiple={false} />
                </Form.Item>

                <Form.Item name='tel' label='默认电话'>
                    <Input type="number" placeholder='请输入电话号码' />
                </Form.Item>

                <Form.Item name='address' label='默认地址'>
                    <TextArea placeholder='请输入默认地址' />
                </Form.Item>

            </Form>
        </div>
    );
}