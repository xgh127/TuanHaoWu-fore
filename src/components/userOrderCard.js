import {Avatar, Button, Card, Divider, List, Space, Tag, Toast} from "antd-mobile";
import styles from "../Card.less";
import {MessageOutline} from "antd-mobile-icons";
import React from "react";
import {doGet, doJSONPost} from "../utils/ajax";
import {useNavigate} from "react-router-dom";
import {IntToPrice} from "../utils/transformPrice";

const StatusTag = (props)=>{
    if(props.status === 0)
        return(<Tag color={"warning"}>未付款</Tag>)
    if(props.status === 1)
        return(<Tag color={"primary"}>已付款</Tag>)
    if(props.status === 2)
        return(<Tag color={"#87d068"}>待收货</Tag>)
    if(props.status === 3)
        return(<Tag color={"success"}>已收货</Tag>)
    if(props.status === 4)
        return(<Tag color={"default"}>已取消</Tag>)
}

const OrderButton = (props)=>{

    const drawBack = async () => {
        let response = await doGet('/cancelOrder/' + props.order.orderId)
        if( parseInt(response.success) === 1 ) {
            Toast.show(response.meg);
            props.navigate('/user_order', { replace: true });
        }
        else{
            Toast.show(response.meg)
        }
    }

    if(props.order.orderStatus === 0)
        return(
            <Space>
                <Button color={"warning"} size={"small"} onClick={()=>{
                    props.navigate('/pay', { replace: true, state: { order: props.order } })
                    }}>
                    现在付款
                </Button>
                <Button color={"danger"} size={"small"} onClick={drawBack}>
                    取消订单
                </Button>
            </Space>
        )
    else if(props.order.orderStatus === 1)
        return (
        <Space>
            <Button color={"primary"} size={"small"}>
                查看物流信息
            </Button>
            <Button color={"danger"} size={"small"} onClick={drawBack}>
                申请退款
            </Button>
        </Space>
    )
    else if(props.order.orderStatus === 2)
        return (
            <Space>
                <Button color={"primary"} size={"small"}>
                    查看物流信息
                </Button>
                <Button color={"success"} size={"small"}>
                    确认收货
                </Button>
                <Button color={"danger"} size={"small"} onClick={drawBack}>
                    申请退款
                </Button>
            </Space>
        )
    else if(props.order.orderStatus === 3)
        return (
            <Space>
                <Button color={"primary"} size={"small"}>
                    服务评价
                </Button>
                <Button color={"danger"} size={"small"} onClick={drawBack}>
                    申请退款
                </Button>
            </Space>
        )
    else if(props.status === 4)
        return null
}


const UserOrderCard = (props) => {

    const navigate = useNavigate()

    let total_price = 0;
    props.order.orderitemList.forEach((item)=>{
        total_price += item.itemPrice * item.itemBuynum;
    })


    return(
        <div style={{width: '98%', marginLeft: '1%', marginRight: '1%'}}>

        <Card title={
            <Space>
                订单号：{props.order.orderId}
                {props.order.groupTitle}
                <StatusTag status={props.order.orderStatus}/>
            </Space>
        }
        extra={props.order.orderFinishTime}
              onHeaderClick={()=>{}}
        >
            <div className={styles.content}>
                <List>
                    <List.Item
                        prefix={<Avatar src={""} />}
                        extra={
                            <Button size='small' style={{borderColor: 'green'}}>
                                <Space>
                                    <MessageOutline color='green' fontSize={20} />
                                </Space>
                            </Button>}
                    >
                        leader

                    </List.Item>
                </List>
            <List header={"购买的商品"}
            >
                {
                    props.order.orderitemList.map((item, index)=>{
                        return(
                            <List.Item
                                prefix={<Avatar src={item.itemImage}/>}
                                extra={
                                <Space>
                                    {item.itemBuynum}
                                    *
                                    {IntToPrice(item.itemPrice)}
                                </Space>
                                }
                            >
                                {item.itemName}
                            </List.Item>
                        )
                    })
                }
                <List.Item prefix={"配送地址："}>{props.order.address}</List.Item>
                <List.Item prefix={"电话："}>{props.order.tel}</List.Item>
                <List.Item prefix={"总价："}>¥{IntToPrice(total_price)}</List.Item>
            </List>
            </div>
            {/*<div className={styles.footer} >*/}
                    <OrderButton order={props.order} navigate={navigate}/>
            {/*</div>*/}
        </Card>
            <Divider> </Divider>
        </div>
    )
}
export default UserOrderCard;
