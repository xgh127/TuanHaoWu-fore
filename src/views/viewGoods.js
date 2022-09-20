import Header from "../components/header";
import {
    AutoCenter,
    Avatar,
    Button,
    Dialog,
    Form,
    Image, ImageViewer,
    Input,
    List,
    Popup,
    Space,
    Stepper,
    Tag,
    TextArea, Toast
} from "antd-mobile";
import {useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {doJSONPost} from "../utils/ajax";
import {IntToPrice} from "../utils/transformPrice";
import React from "react";
import Timer from "../utils/timer";

//set interval
//stock constrain
//group time constrain

export default () =>{
    const location = useLocation();

    const navigate = useNavigate()
    const back = () => {
        navigate(location.state.back, { replace: true, state:location.state.backState });
    }

    useEffect(()=>{
        window.history.pushState(null, null);
        window.addEventListener('popstate', back);
        console.log("监听");
        return () => {
            console.log("移除");
            window.removeEventListener('popstate', back)
        };
    }, []);

    const [groupInfo,setGroupInfo] = useState(location.state.groupInfo)
    const [leaderAvatar, setLeaderAvatar] = useState('')
    const [onSale, setOnSale] = useState(
        (new Date().getTime() > new Date(groupInfo.startTime).getTime()) &&
        (new Date().getTime() < new Date(groupInfo.endTime).getTime())
    )

    const [visible, setVisible] = useState(false)
    const [imageVisible, setImageVisible] = useState(false) //后续
    const [popInfo, setPopInfo] = useState([])
    const [imageInfo, setImageInfo] = useState({
        index:1,
        urls:[]
    })


    const [order, setOrder] = useState({
        groupId: location.state.groupInfo.groupId,
        userId:1,
        tel:null,
        address:null,
        itemId:[],
        num:[]
    })

    const [total, setTotal] = useState(()=>{
        let total = []
        location.state.groupInfo.items.forEach((item)=>{
            total.push(0)
        })
        return total
    })

    const [totalPrice, setTotalPrice]=useState(0)
    const modifyTotal = (value, index) =>{
        let newTotal = total
        newTotal[index] = value
        console.log(newTotal)
        let price = 0
        newTotal.forEach((value, index)=>{
            price += value * groupInfo.items[index].itemPrice
        })
        setTotalPrice(price)
    }

    const modifyOrder = (order) => {
        setOrder(order);
    }

    const Logistics = (props) =>{
        if(props.logistics === 1)
            return (<Space>快递</Space>)
        else if(props.logistics === 2)
            return (<Space>同城配送</Space>)
        else if(props.logistics === 3)
            return (<Space>顾客自提</Space>)
        else if(props.logistics === 4)
            return (<Space>无物流</Space>)
    }

    const StartLabel = () => {
        if(new Date().getTime() < new Date(groupInfo.startTime).getTime())
            return <div style={{color:"grey"}}>团购未开始</div>
        if(new Date(groupInfo.endTime).getTime() < new Date())
            return <div style={{color:"grey"}}>团购已结束</div>
        return <div style={{color:"green"}}>正在热卖中</div>
    }

    const orderRequest = async () =>{
        console.log(JSON.parse(localStorage.getItem('user')))
        console.log(onSale)
        if(!onSale) {
            Toast.show("团购未开始或已结束！")
            return
        }
        let joinRequset = {
            groupId:groupInfo.groupId,
            userId:JSON.parse(localStorage.getItem('user')).userid,
            tel:order.tel,
            address:order.address,
            itemId:[],
            num:[]
        }
        let itemId = []
        let num = []
        total.map((item, index)=>{
            if(parseInt(item) !== 0){
                itemId.push(groupInfo.items[index].itemId)
                num.push(item)
            }
        })
        joinRequset["itemId"] = itemId
        joinRequset["num"] = num
        console.log(joinRequset)
        if(joinRequset.itemId === []){
            Toast.show("至少买一样物品")
            return
        }
        let response = await doJSONPost('/joinGroup', joinRequset)
        console.log(response)
        navigate('/pay', { replace: true, state: { order: response } })
    }

    return(
        <div style={{flex: 1}}>
            <Header onBack={back} title='新的跟团' />
            <div style={{marginLeft: '1%', width: '98%'}}>
                <Space block direction='vertical'>
                    <List layout='horizontal'>

                        <List.Item
                            prefix={<Avatar src={leaderAvatar} />}
                            onClick={()=>{}}
                        >
                            {groupInfo.groupLeader} 的团购
                        </List.Item>
                        <List.Item>
                            <AutoCenter>{groupInfo.groupTitle}</AutoCenter>
                        </List.Item>
                        <List.Item prefix={
                            <Space direction={"vertical"}>
                                起止时间
                            </Space>}
                            description={<StartLabel/>}
                        >
                            <Space direction={"vertical"}>
                                {groupInfo.startTime}
                                {groupInfo.endTime}
                            </Space>
                        </List.Item>
                        <List.Item>
                            <TextArea readOnly autoSize value={groupInfo.groupDescription}/>
                        </List.Item>
                        <List.Item prefix={"物流方式"}>
                            <Logistics logistics={groupInfo.logistics}/>
                        </List.Item>
                        {
                            groupInfo.items.map((item, index)=>{
                                if(!item.itemSeckill)
                                    return(
                                        <List.Item>
                                            <List>
                                                <List.Item
                                                    prefix={<Avatar src={item.itemImage} fit='contain' />}
                                                    // extra={
                                                    //     <Space>
                                                    //         库存:剩余{item.item_stock}件
                                                    //     </Space>
                                                    // }
                                                    onClick={()=>{
                                                        setPopInfo(item)
                                                        setVisible(true)
                                                    }}
                                                >
                                                    {item.itemName}
                                                </List.Item>
                                                <List.Item extra={
                                                    <Space>
                                                        <Stepper defaultValue={0} value={total[index]}
                                                                 min={0} max={item.itemStock} onChange={
                                                            (value)=>{
                                                                modifyTotal(value, index)
                                                            }
                                                        } />
                                                        <h3>¥{IntToPrice(item.itemPrice)}</h3>
                                                    </Space>
                                                }>
                                                    购买数量
                                                </List.Item>
                                            </List>
                                        </List.Item>
                                    )
                                else {
                                    let now = new Date()
                                    if(now.getTime()>new Date(item.skStartTime).getTime() &&
                                        now.getTime()<new Date(item.skEndTime).getTime())
                                        return (
                                            <List.Item>
                                                <List>
                                                <List.Item
                                                    prefix={<Avatar src={item.itemImage} fit='contain' />}
                                                    onClick={()=>{
                                                        setPopInfo(item)
                                                        setVisible(true)
                                                    }}
                                                >
                                                    <Space direction={"vertical"}>
                                                        <Space>
                                                            {item.itemName}
                                                            <Tag color='danger'>秒杀商品</Tag>
                                                        </Space>
                                                        <Space>
                                                            据秒杀结束还有
                                                            <div style={{color:"red"}}>
                                                                <Timer time={new Date(item.skEndTime).getTime() - now.getTime()}/>
                                                            </div>
                                                        </Space>
                                                    </Space>
                                                </List.Item>
                                                <List.Item extra={
                                                    <Space>
                                                        <Stepper defaultValue={0} value={total[index]}
                                                                 min={0} max={item.itemStock} onChange={
                                                            (value) =>{
                                                                modifyTotal(value, index)
                                                            }} />
                                                        <h3>¥{IntToPrice(item.itemPrice)}</h3>
                                                    </Space>
                                                }>
                                                    购买数量
                                                </List.Item>
                                                </List>
                                            </List.Item>
                                        )
                                    else if(now.getTime() > new Date(item.skEndTime).getTime())
                                        return (
                                            <List.Item>
                                                <List>
                                                <List.Item
                                                    prefix={<Avatar src={item.itemImage} fit='contain' />}
                                                    onClick={()=>{
                                                        setPopInfo(item)
                                                        setVisible(true)
                                                    }}
                                                >
                                                    <Space>
                                                        {item.itemName}
                                                        <Tag color='danger'>秒杀商品</Tag>
                                                    </Space>
                                                </List.Item>
                                                <List.Item extra={
                                                    <Space>
                                                        商品售卖已结束
                                                    </Space>
                                                }>
                                                    购买数量
                                                </List.Item>
                                                </List>
                                            </List.Item>
                                        )
                                    else
                                        return (
                                                <List.Item>
                                                    <List>
                                                <List.Item
                                                    prefix={<Avatar src={item.itemImage} fit='contain' />}
                                                    onClick={()=>{
                                                        setPopInfo(item)
                                                        setVisible(true)
                                                    }}
                                                >
                                                    <Space direction={"vertical"}>
                                                        <Space>
                                                            {item.itemName}
                                                            <Tag color='danger'>秒杀商品</Tag>
                                                        </Space>
                                                        <Space>
                                                            据秒杀开始还有
                                                            <div style={{color:"red"}}>
                                                                <Timer time={new Date(item.skStartTime).getTime() - now.getTime()}/>
                                                            </div>
                                                        </Space>
                                                    </Space>
                                                </List.Item>
                                                <List.Item extra={
                                                    <Space>
                                                        秒杀尚未开始
                                                    </Space>
                                                }>
                                                    购买数量
                                                </List.Item>
                                                    </List>
                                                </List.Item>
                                        )
                                }

                            })
                        }
                        <List.Item extra={
                            <Space>
                                <h2>¥{IntToPrice(totalPrice)}</h2>
                            </Space>
                        }>
                            总价
                        </List.Item>
                    </List>
                    <Form>
                        <Form.Item>
                            <Input placeholder={"您的地址"} onChange={(val)=>{
                                let newOrder = order;
                                newOrder.address = val;
                                modifyOrder(newOrder)
                            }}/>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder={"您的电话"} onChange={(val) =>{
                                let newOrder = order;
                                newOrder.tel = val;
                                modifyOrder(newOrder)
                            }}/>
                        </Form.Item>
                    </Form>
                    <Button block type='submit' color='primary' size='large' onClick={orderRequest}>
                        生成订单
                    </Button>
                    <div></div>
                </Space>
                <Popup visible={visible}
                  onMaskClick={() => {
                     setVisible(false)
                  }}
                  bodyStyle={{
                      borderTopLeftRadius: '16px',
                      borderTopRightRadius: '16px',
                      minHeight: '60vh', }}
                >
                    <List>
                        <List.Item extra={
                            <Space>
                                剩余
                                {popInfo.itemStock}
                                件
                            </Space>
                        }>
                            <Space>
                                {popInfo.itemName}
                            </Space>
                        </List.Item>
                        <List.Item prefix={"图片"}>
                            <Space wrap={true}>
                                <Image src={popInfo.itemImage} width={100} height={100} fit='contain'
                                       onContainerClick={()=>{
                                           if(popInfo.itemImage !== null)
                                           setImageInfo(popInfo.itemImage)
                                           setImageVisible(true)
                                       }}/>
                                {/*<Image src={popInfo.itemImage} width={100} height={100} fit='contain'*/}
                                {/*       onContainerClick={()=>{*/}
                                {/*           let img = []*/}
                                {/*           if(popInfo.itemImage !== null) img.push(popInfo.itemImage)*/}
                                {/*           if(popInfo.item_image2 !== null) img.push(popInfo.item_image2)*/}
                                {/*           if(popInfo.item_image3 !== null) img.push(popInfo.item_image3)*/}
                                {/*           if(popInfo.item_image4 !== null) img.push(popInfo.item_image4)*/}
                                {/*           setImageInfo({*/}
                                {/*                index:1,*/}
                                {/*                urls:img*/}
                                {/*       })*/}
                                {/*           setImageVisible(true)*/}
                                {/*       }}/>*/}
                                {/*<Image src={popInfo.item_image2} width={100} height={100} fit='contain'*/}
                                {/*       onClick={()=>{*/}
                                {/*           let img = []*/}
                                {/*           if(popInfo.itemImage !== null) img.push(popInfo.itemImage)*/}
                                {/*           if(popInfo.item_image2 !== null) img.push(popInfo.item_image2)*/}
                                {/*           if(popInfo.item_image3 !== null) img.push(popInfo.item_image3)*/}
                                {/*           if(popInfo.item_image4 !== null) img.push(popInfo.item_image4)*/}
                                {/*           setImageInfo({*/}
                                {/*               index:2,*/}
                                {/*               urls:img*/}
                                {/*           })*/}
                                {/*           setImageVisible(true)*/}
                                {/*       }}/>*/}
                                {/*<Image src={popInfo.item_image3} width={100} height={100} fit='contain'*/}
                                {/*       onClick={()=>{*/}
                                {/*           let img = []*/}
                                {/*           if(popInfo.itemImage !== null) img.push(popInfo.itemImage)*/}
                                {/*           if(popInfo.item_image2 !== null) img.push(popInfo.item_image2)*/}
                                {/*           if(popInfo.item_image3 !== null) img.push(popInfo.item_image3)*/}
                                {/*           if(popInfo.item_image4 !== null) img.push(popInfo.item_image4)*/}
                                {/*           setImageInfo({*/}
                                {/*               index:3,*/}
                                {/*               urls:img*/}
                                {/*           })*/}
                                {/*           setImageVisible(true)*/}
                                {/*       }}/>*/}
                                {/*<Image src={popInfo.item_image4} width={100} height={100} fit='contain'*/}
                                {/*       onClick={()=>{*/}
                                {/*           let img = []*/}
                                {/*           if(popInfo.itemImage !== null) img.push(popInfo.itemImage)*/}
                                {/*           if(popInfo.item_image2 !== null) img.push(popInfo.item_image2)*/}
                                {/*           if(popInfo.item_image3 !== null) img.push(popInfo.item_image3)*/}
                                {/*           if(popInfo.item_image4 !== null) img.push(popInfo.item_image4)*/}
                                {/*           setImageInfo({*/}
                                {/*               index:4,*/}
                                {/*               urls:img*/}
                                {/*           })*/}
                                {/*           setImageVisible(true)*/}
                                {/*       }}/>*/}
                            </Space>
                        </List.Item>
                        <List.Item prefix={"单价"}
                            extra={<div style={{fontSize: 20, fontWeight: 700, color: 'red'}}>￥{IntToPrice(popInfo.itemPrice)}</div>}/>
                        <List.Item prefix={"描述"}>
                            <TextArea readOnly autoSize value={popInfo.itemDescription}/>
                        </List.Item>
                    </List>
                </Popup>
                <ImageViewer
                    visible={imageVisible}
                    image={imageInfo} onClose={()=>{
                    setImageVisible(false)
                }}/>
                {/*<ImageViewer.Multi*/}
                {/*    defaultIndex={1}*/}
                {/*    swipeTo={imageInfo.index}*/}
                {/*    images={imageInfo.urls}*/}
                {/*    onClose={()=>{*/}
                {/*        setImageVisible(false)*/}
                {/*    }}/>*/}
            </div>
        </div>
    )
}
