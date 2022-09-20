import React, { useEffect, useState } from 'react';
import { Button, Space, List } from 'antd-mobile';
import { AddCircleOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import GroupBuyCard from '../components/groupBuyCard';
import { doGet } from '../utils/ajax';
import 'antd/dist/antd.css';

export default (props) => {
    const navigate = useNavigate();
    const [groupBuyList, setGroupBuyList] = useState(props.groupBuyList);

    useEffect(()=>{
        const fetchData = async() => {
            let response = await doGet('/searchGroupByGroupLeader/' + props.user.name);
            console.log(response);
            setGroupBuyList(response);
            props.setGroupBuyList(response);
        }
        console.log(JSON.stringify(props.user));
        fetchData();
        return () => {
            console.log("admin Unmount");
        }
    }, [])

    return (
        <div style={{flex: 1}}>
        <Header back='' backArrow={false} title='我的团购' />
        <div style={{marginLeft: '3%', width: '94%'}}>
            <Button block type='button' onClick={() => { navigate('/create', {}); } } style={{borderColor: 'blue', marginTop: '10px'}}>
            <Space>
                <AddCircleOutline />
                <span>新建团购</span>
            </Space>
            </Button>
            <List header='我创建的团购' style={{borderColor: 'red'}}>
                {
                    groupBuyList.map((item, index)=>{
                        return <GroupBuyCard info={item} index={index} groupBuyList={groupBuyList} setGroupBuyList={v => { setGroupBuyList(v); props.setGroupBuyList(v); }} />
                    })
                }
            </List>
            <div style={{height: '50px', backgroundColor: 'lightblue'}}></div>
        </div>
        </div>
    );
}