import { Divider, SearchBar, Space, Swiper, Toast, Dialog } from "antd-mobile";
import Header from "../components/header";
import ShopCard from "../components/shopCard";
import {useEffect, useState} from "react";
import { doGet } from "../utils/ajax";
import {Col, Row} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";


const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac'];

const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
        <div
            className="content"
            style={{ background: color }}
            onClick={() => {
                Toast.show(`你点击了卡片 ${index + 1}`)
            }}
        >
            {index + 1}
        </div>
    </Swiper.Item>
))

const HomeView = (props)=>{
    useEffect(()=>{
        navigator.clipboard.readText().then((result) => {
            if(result.includes('/goods_view?groupId=') && result !== props.link) {
                props.setLink(result);
                let dst = result.substring(result.lastIndexOf('/'), result.indexOf('?'));
                let groupId = result.substring(result.indexOf('=') + 1);
                const getData = async() => {
                    let group = await doGet('/searchGroupByGroupId/' + groupId);
                    Dialog.confirm({
                        content: '您想要查看团购 ' + group.groupTitle +  ' 吗？',
                        onConfirm: () => {
                            navigate(dst, { state: { groupInfo: group, back: '/home', backState: null }, replace: true });
                        },
                    })
                }
                getData();
            }
        }).catch(e=>{
            console.log("读取剪贴板错误");  
        });
    }, [])

    const [groupInfo,setGroupInfo] = useState({
        groupTitle:'title',
        groupLeader:'leader',
        groupDescription:'description,description,description,description,description,' +
            'description,description,description,description,description,description,description,' +
            'description,description,description,description,description,description,description,' +
            'description,description,description,description,description,description,description,',
        startTime:'2022-06-01 00:00:00',
        endTime:'2022-07-15 08:00:00',
        logistics:1,
        items:[
            {
                itemName:'item1',
                itemImage:'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60',
                itemDescription:'item1_dcp',
                itemPrice:'100',
                itemStock:1000,
                itemSeckill:false,
                skStartTime:null,
                skEndTime:null
            },
            {
                itemName:'item2',
                itemImage:'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60',
                itemDescription:'item2_dcp',
                itemPrice:'200',
                itemStock:1000,
                itemSeckill:true,
                skStartTime:'2022-06-28 00:00:00',
                skEndTime:'2022-06-29 00:00:00'
            }
        ]
    })

    const navigate = useNavigate()

    return (
        <div style={{flex: 1}}>
            <Header title='首页' backArrow={false} />
            <div style={{marginTop: '10px'}}>
                <Space block direction='vertical'>
                    <SearchBar placeholder='请输入内容' onSearch={val=>{
                        navigate('/search', { replace: true, state: { txt: val }})
                    }}/>
                    <Swiper loop autoplay>{items}</Swiper>
                </Space>
                <Divider>
                    最近热卖
                </Divider>
                <div style={{marginLeft: '5%', width: '90%'}}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                    </Row>
                </div>
                <Divider>
                    附近的团购
                </Divider>
                <div style={{marginLeft: '5%', width: '90%'}}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                    </Row>
                </div>
                <Divider>
                    猜你喜欢
                </Divider>
                <div style={{marginLeft: '5%', width: '90%'}}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                        <Col span={12}>
                            <ShopCard groupInfo={groupInfo}/>
                        </Col>
                    </Row>
                </div>
            </div>
            <div style={{height: '60px', backgroundColor: 'lightblue'}}></div>
        </div>
    );
}
export default HomeView;
