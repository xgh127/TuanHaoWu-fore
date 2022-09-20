import Header from "../components/header";
import {useEffect, useState} from "react";
import UserOrderCard from "../components/userOrderCard";
import {Badge, Empty, Tabs} from "antd-mobile";
import React from "react";
import {doJSONPost} from "../utils/ajax";
import {FileWrongOutline} from "antd-mobile-icons";

export default () => {
    const [orders,setOrders] = useState([])

    const [order0,setOrder0] = useState([])
    const [order1,setOrder1] = useState([])
    const [order2,setOrder2] = useState([])
    const [order3,setOrder3] = useState([])
    const [order4,setOrder4] = useState([])

    function sortByTime(a,b){
        return new Date(b.orderFinishTime).getTime() - new Date(a.orderFinishTime).getTime()
    }


    useEffect(()=>{
        async function fetchOrders(){
            let response = await doJSONPost('/searchOrderByUserId', JSON.parse(localStorage.getItem('user')).userid)
            console.log(response)
            response.sort(sortByTime)
            setOrders(response)
            let order0 = []
            let order1 = []
            let order2 = []
            let order3 = []
            let order4 = []
            response.forEach((order)=>{
                if(parseInt(order.orderStatus) === 0) order0.push(order)
                if(parseInt(order.orderStatus) === 1) order1.push(order)
                if(parseInt(order.orderStatus) === 2) order2.push(order)
                if(parseInt(order.orderStatus) === 3) order3.push(order)
                if(parseInt(order.orderStatus) === 4) order4.push(order)
            })
            setOrder0(order0)
            setOrder1(order1)
            setOrder2(order2)
            setOrder3(order3)
            setOrder4(order4)
        }
        fetchOrders();

    },[])

    const OrdersMapping=(props)=>{
        if(props.orders.length === 0)
            return(
                <Empty
                    style={{ padding: '64px 0'}}
                    image={
                        <FileWrongOutline
                            style={{
                                color: 'var(--adm-color-primary)',
                                fontSize: 96,
                            }}
                        />}
                    description={<h4 style={{color:"black"}}>暂无数据</h4>}
                />
            )
        else return (
            props.orders.map((order, index) =>{
                return (<UserOrderCard order={order} index={index}/>)
            })
        )
    }

    return (
        <div style={{width:"100%"}}>
            <Header title='订单管理' backArrow={false} />
            <div style={{width: '100%'}}>
            <Tabs defaultActiveKey='1'>
                <Tabs.Tab title={"全部订单"} key='1'>
                    <OrdersMapping orders={orders}/>
                </Tabs.Tab>
                <Tabs.Tab title={"未付款"} key='2'>
                    <OrdersMapping orders={order0}/>
                </Tabs.Tab>
                <Tabs.Tab title={"待发货"} key='3'>
                    <OrdersMapping orders={order1}/>
                </Tabs.Tab>
                <Tabs.Tab title={
                    <Badge content='0' style={{ '--right': '-10px', '--top': '8px' }}>
                    待收货
                    </Badge>} key='4'>
                    <OrdersMapping orders={order2}/>
                </Tabs.Tab>
                <Tabs.Tab title={"已收货"} key='5'>
                    <OrdersMapping orders={order3}/>
                </Tabs.Tab>
                <Tabs.Tab title={"已取消"} key='6'>
                    <OrdersMapping orders={order4}/>
                </Tabs.Tab>
            </Tabs>
            </div>
            <div style={{height: '50px', backgroundColor: 'lightblue'}}></div>
        </div>
    )
}

