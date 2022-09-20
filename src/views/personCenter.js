import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import { Space, List, Avatar, Tag, Badge } from 'antd-mobile';
import { 
    MessageOutline,
    HistogramOutline,
    SetOutline,
    EnvironmentOutline,
    ScanningOutline,
    UserSetOutline,
    BellOutline,
    ReceiptOutline,
} from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import { IntToPrice } from '../utils/transformPrice';
import { doGet } from '../utils/ajax';

export default (props) =>{
    const navigate = useNavigate();
    const [money, setMoney] = useState((props.role === '游客')? 0 : props.user.money);

    useEffect(() => {
        const getData = async() => {
            let userInfo = await doGet("/queryUserInfo/" + props.user.userid);
            console.log("userinfo = "+JSON.stringify(userInfo))
            setMoney(userInfo.money);
            props.setUser(userInfo);
            localStorage.setItem("user", JSON.stringify(userInfo));
        }
        if(props.role !== '游客') getData();
    }, [])

    return (
        <div style={{flex: 1}}>
            <Header title='个人中心' backArrow={false} />
            <div style={{color: 'lightblue', height: '10px'}}></div>
            {
                (props.role === '游客')?
                <Space block direction='vertical'>
                <List>
                    <List.Item
                        prefix={<Avatar src={""} />}
                        onClick={()=>{navigate("/login", {})}}
                    >
                        未登录
                        <Tag style={{marginLeft: '10px'}} color='default'>游客</Tag>
                    </List.Item>
                </List>
                <List header=''>
                    <List.Item prefix={<ScanningOutline color='purple' />} onClick={() => {navigate("/scan", {})}}>
                        扫一扫
                    </List.Item>
                    <List.Item prefix={<SetOutline color='gray' />} onClick={() => {}}>
                        设置
                    </List.Item>
                </List>
                </Space>
                
                :

                <Space block direction='vertical'>
                <List>
                    <List.Item
                        prefix={<Avatar src={props.user.picture} />}
                        description={<div><EnvironmentOutline /><span>上海市闵行区</span></div>}
                        onClick={()=>{navigate("/info", {})}}
                    >
                        { props.user.name }
                        <Tag style={{marginLeft: '10px'}} color={(props.role === '团长')? 'success' : 'primary'}>{props.role}</Tag>
                    </List.Item>
                </List>

                {
                    (props.role === '团长')? 
                    <List header=''>
                        <List.Item prefix={<ReceiptOutline color='green' />} extra={ IntToPrice(money) } onClick={() => {}}>
                            我的钱包
                        </List.Item>
                        <List.Item prefix={<UserSetOutline color='blue' />} onClick={() => {navigate("/switch", {})}}>
                            切换身份
                        </List.Item>
                        <List.Item prefix={<Badge content='5'><MessageOutline color='green' /></Badge>} onClick={() => {}}>
                            我的消息
                        </List.Item>
                        <List.Item prefix={<HistogramOutline color='orange' />} onClick={() => {}}>
                            销售统计
                        </List.Item>
                        <List.Item prefix={<ScanningOutline color='purple' />} onClick={() => {navigate("/scan", {})}}>
                            扫一扫
                        </List.Item>
                        <List.Item prefix={<SetOutline color='gray' />} onClick={() => {}}>
                            设置
                        </List.Item>
                    </List> :
                    <List header=''>
                        <List.Item prefix={<ReceiptOutline color='green' />} extra={ IntToPrice(money) } onClick={() => {}}>
                            我的钱包
                        </List.Item>
                        <List.Item prefix={<UserSetOutline color='blue' />} onClick={() => {navigate("/switch", {})}}>
                            切换身份
                        </List.Item>
                        <List.Item prefix={<Badge content='5'><MessageOutline color='green' /></Badge>} onClick={() => {}}>
                            我的消息
                        </List.Item>
                        <List.Item prefix={<BellOutline color='orange' />} onClick={() => {}}>
                            我的订阅
                        </List.Item>
                        <List.Item prefix={<ScanningOutline color='purple' />} onClick={() => {navigate("/scan", {})}}>
                            扫一扫
                        </List.Item>
                        <List.Item prefix={<SetOutline color='gray' />} onClick={() => {}}>
                            设置
                        </List.Item>
                    </List>
                }
                </Space>
            }
            <div style={{height: '60px', backgroundColor: 'lightblue'}}></div>
        </div>
    );
}