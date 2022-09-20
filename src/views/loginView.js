import React from 'react';
import { Form, Input, Button, Space, Avatar, AutoCenter, Divider, NavBar, Toast } from 'antd-mobile';
import { UserOutline, LockOutline, CheckCircleOutline, RightOutline } from 'antd-mobile-icons';
import PicAuthCode from '../components/picAuthCode';
import { useNavigate } from 'react-router-dom';
import { doJSONPost } from '../utils/ajax';

export default (props) => {
    const [form] = Form.useForm();
    const onFinish = async (v) => {
        if(v.picAuth != picCode) {
            Toast.show("验证码错误");
            const elem = document.getElementById("another");
            elem.click();
            return;
        }
        if(v.account === '' || v.account === null) {
            Toast.show("用户名不能为空");
            return;
        }
        if(v.password === '' || v.password === null) {
            Toast.show("密码不能为空");
            return;
        }
        delete v["picAuth"];
        let user = await doJSONPost("/loginCheck", v);
       // alert("user = "+user.toLocaleString());
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", '团长');
        props.setUser(user);
        props.setRole("团长");
        navigate("/home", { replace: true });
    }

    var picCode = '';

    const setCode = () => {
        const words = 'AaBbDdEeFfGgHhQqRrTtYy1234567890';
        let code = ''
        for(let i = 0; i < 4; i++)
            code += words[Math.floor(Math.random() * 32)]
        picCode = code;
        return code;
    }

    const navigate = useNavigate();

    return (
        <div style={{flex: 1}}>
            <NavBar backArrow={false} right={<span style={{ fontSize: 14 }} onClick={()=>{ props.setRole('游客'); navigate('/home', { replace: true }) }}>以游客身份使用<RightOutline /></span>} />
            <AutoCenter><Avatar src={require('../images/logo.png')} style={{"--size": "72px", "--border-radius": "12px", marginTop: '50%'}}  /></AutoCenter>
            <AutoCenter><div style={{fontSize: 18, fontWeight: 'bold', marginBottom: '50%'}}>团好物</div></AutoCenter>
            <Form layout="horizontal" onFinish={v=>onFinish(v)} footer={
                <Button block type='submit' color='primary' size='large'>
                登录
                </Button>
            }
            mode='card'
            form={form}
            >

            <Form.Item name='account' label={<UserOutline fontSize={20} />} style={{"--prefix-width": "30px"}}>
                <Input placeholder='请输入用户名' />
            </Form.Item>

            <Form.Item name='password' label={<LockOutline fontSize={20}/>} style={{"--prefix-width": "30px"}}>
                <Input type="password" placeholder='请输入密码' />
            </Form.Item>

            <Form.Item name='picAuth' label={<CheckCircleOutline fontSize={20}/>} style={{"--prefix-width": "30px"}} extra={<PicAuthCode setCode={setCode} />}>
                <Input placeholder='请输入验证码' />
            </Form.Item>

            </Form>
            <div style={{marginLeft: '4%', width: '92%'}}>
                <span style={{float: 'left'}} onClick={()=>navigate("/register", {})}>新用户注册</span>
                <span style={{float: 'right'}}>忘记密码</span>
            </div>
            <Divider style={{marginTop: '7%'}}>其他方式登录</Divider>
        </div>
    );
}