import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { List, Avatar, Button, Space, Popup, Toast } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';

export default (props) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const text = (txt) => {
        return <div style={{marginTop: '12px'}}>{txt}</div>;
    }

    const goBack = () => {
        console.log("回退");
        navigate('/me', { replace: true });
    }
  
    useEffect(()=>{
      window.history.pushState(null, null);
      window.addEventListener('popstate', goBack);
      console.log("监听");
      return () => {console.log("移除"); window.removeEventListener('popstate', goBack) };
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        props.setUser(null);
        props.setRole("游客");
        navigate("/login", { replace: true })
    }

    return (
        <div style={{flex: 1}}>
            <Space block direction='vertical'>
                <Header title='用户信息' onBack={() => { window.history.back(); goBack(); }} />
                <List>
                    <List.Item prefix="头像" extra={<Avatar src={props.user.picture} />} />
                    <List.Item prefix={text("用户ID")} extra={text(props.user.userid)} style={{height: '50px'}} />
                    <List.Item prefix={text("用户名")} extra={text(props.user.account)} style={{height: '50px'}} />
                    <List.Item prefix={text("昵称")} extra={text(props.user.name)} style={{height: '50px'}} />
                    <List.Item prefix={text("默认收件人")} extra={text(props.user.name)} style={{height: '50px'}} />
                    <List.Item prefix={text("默认电话")} extra={text(props.user.tel)} style={{height: '50px'}} />
                    <List.Item prefix={text("默认地址")} extra={text(props.user.address)} />
                    <List.Item prefix={text("修改密码")} arrow={text(<RightOutline />)} onClick={()=>{}} style={{height: '50px'}} />
                </List>
                <div style={{width: '90%', marginLeft: '5%'}}>
                    <Button color='primary' onClick={() => {setVisible(true)}} size='large' block>修改信息</Button>
                    <div style={{height: '10px'}}></div>
                    <Button color='danger' onClick={() => {logout()}} size='large' block>退出登录</Button>
                </div>
            </Space>
        </div>
    );
}