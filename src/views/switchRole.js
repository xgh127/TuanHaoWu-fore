import { List } from 'antd-mobile';
import { FlagOutline, TeamOutline, CheckOutline } from 'antd-mobile-icons';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';

export default (props) => {
    const role = props.role;
    const setRole = props.setRole;
    const navigate = useNavigate();
    const checkOutline = <CheckOutline color='deepskyblue' fontSize={24} />;

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

    return (
        <div style={{flex: 1}}>
            <Header title='切换身份' onBack={() => { window.history.back(); goBack(); }} />
            <List header='选择身份'>
                <List.Item prefix={<FlagOutline color='red' />} arrow={(role === '团长')? checkOutline : false} onClick={()=>{setRole('团长'); localStorage.setItem("role", "团长"); }}>
                    <span style={{color: (role === '团长'? 'deepskyblue' : 'black')}}>团长</span>
                </List.Item>
                <List.Item prefix={<TeamOutline color='black' />} arrow={(role === '团员')? checkOutline : false} onClick={() => {setRole('团员'); localStorage.setItem("role", "团员")}}>
                    <span style={{color: (role === '团员'? 'deepskyblue' : 'black')}}>团员</span>
                </List.Item>
            </List>
        </div>
    );
}