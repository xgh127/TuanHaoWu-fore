import Header from "../components/header";
import {
    AutoCenter,
    Avatar,
    Button,
    Form,
    Image,
    ImageViewer,
    Input,
    List,
    Popup,
    Space,
    Stepper,
    Tag,
    TextArea, Toast
} from "antd-mobile";
import {useLocation, useNavigate} from "react-router-dom";
import {doJSONPost} from "../utils/ajax";
import {IntToPrice} from "../utils/transformPrice";
import {useEffect} from "react";

export default ()=>{
    const navigate = useNavigate();
    const location = useLocation();

    const order = location.state.order;

    let totalPrice = 0;
    order.orderitemList.forEach((item)=>{
        totalPrice += item.itemPrice * item.itemBuynum;
    })

    const back = () => {
        //window.history.back();
        console.log("回退");
        navigate('/user_order', { replace: true });
    }

    useEffect(()=>{
        window.history.pushState(null, null);
        window.addEventListener('popstate', back);
        console.log("监听");
        return () => {console.log("移除"); window.removeEventListener('popstate', back) };
    },[])

    const payOrder = async () => {
        let payRequest = {
            userId:JSON.parse(localStorage.getItem('user')).userid,
            orderId:order.orderId
        }
        let response = await doJSONPost('/payOrder', payRequest)
        console.log(response)
        if( parseInt(response.success) === 1 ) {
            Toast.show(response.meg);
            navigate('/user_order', { replace: true });
        }
        else{
            Toast.show(response.meg)
        }

    }

    const Logistics = (props) =>{
        if(props.logistics === 1)
            return (<Space>快递</Space>)
        else if(props.logistics === 2)
            return (<Space>快递</Space>)
        else if(props.logistics === 3)
            return (<Space>快递</Space>)
        else if(props.logistics === 4)
            return (<Space>快递</Space>)
    }

    return(
        <div style={{flex: 1}}>
            <Header onBack={back} title='现在就买' />
            <div style={{marginLeft: '5%', width: '90%'}}>
                <Space block direction='vertical'>
                    <List layout='horizontal'>

                        <List.Item
                            extra={
                            <Space>
                                下单时间：
                                {order.orderFinishTime}
                            </Space>
                        }
                        >
                            订单号：{order.orderId}
                        </List.Item>
                        {/*<List.Item prefix={"物流方式："}>*/}
                        {/*    <Logistics logistics={order.logistics}/>*/}
                        {/*</List.Item>*/}
                        <List header={"购买的商品"}>
                            {
                                order.orderitemList.map((item)=>{
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
                            <List.Item prefix={"配送地址："}>{order.address}</List.Item>
                            <List.Item prefix={"电话："}>{order.tel}</List.Item>
                        </List>
                        <List.Item  prefix={"总价："}
                            extra={
                            <Space>
                                <h2>¥{IntToPrice(totalPrice)}</h2>
                            </Space>
                        }/>
                    </List>
                    <Button block type='submit' color='primary' size='large' onClick={payOrder}>
                        现在付款
                    </Button>
                </Space>
            </div>
        </div>
    )
}
