import React, { useState } from 'react';
import { Card, Avatar, List, Tag, Image, Space, Form, TextArea, Input, Button, Popup, Collapse, Toast, Dialog } from 'antd-mobile';
import { MessageOutline } from 'antd-mobile-icons';
import { useForm } from 'rc-field-form';
import dayjs from 'dayjs';
import { IntToPrice } from '../utils/transformPrice';
import { doGet } from '../utils/ajax';

export default (props) => {
    const [visible, setVisible] = useState(false);
    const [form]  = useForm();

    const text = (txt) => {
        return <div style={{fontSize: 14}}>{txt}</div>;
    }

    const orderStatuses = ['未支付', '待发货', '待收货', '已收货', '已取消']
    const orderTagColor = ["default", "primary", "warning", "success", "danger"];

    const sum = (itemList) => {
        let num = 0;
        for(let i = 0; i < itemList.length; ++i) {
            const itemPrice = itemList[i].itemPrice;
            const itemBuynum = itemList[i].itemBuynum;
            console.log(itemPrice);
            num = Number(Number(num) + Number(itemPrice) * Number(itemBuynum));
        }
        return num;
    }

    const cancelOrder = () => {
        Dialog.confirm({
            content: '您确定要取消该订单吗？',
            confirmText: <div style={{color: 'red', fontWeight: 'bold'}}>取消</div>,
            onConfirm: async() => {
                let response = await doGet("/cancelOrder/" + props.info.orderId);
                console.log(JSON.stringify(response));
                if(response.success == 1) {
                    let url = "/getOrdersForGroupLeader/" + props.userid;
                    let orderInfo = await doGet(url);
                    props.setGroupOrderList(orderInfo);
                    console.log(JSON.stringify(orderInfo));
                    Toast.show(response.meg);
                } else {
                    Toast.show(response.meg);
                }
            },
        })
    }

    return (
        <div style={{width: '90%', marginLeft: '5%'}}>
            <Card title={ '跟团号: ' + props.info.groupId} extra={'订单编号：' + props.info.orderId} >
            <List>
                <List.Item
                    prefix={<Avatar src={""} />}
                    description={'下单时间: ' + dayjs(props.info.orderFinishTime).format("YYYY年MM月DD日 HH:mm:ss")}
                    extra={        
                    <Button size='small' style={{borderColor: 'green'}}>
                        <Space>
                          <MessageOutline color='green' fontSize={20} />
                        </Space>
                    </Button>}
                >
                    团购爱好者
                    <Tag style={{marginLeft: '10px'}} color={orderTagColor[props.info.orderStatus]}>{orderStatuses[props.info.orderStatus]}</Tag>
                </List.Item>
            </List>

            <Collapse>
                <Collapse.Panel title={<div style={{fontSize: 15}}>购买的商品</div>} key={1}>
                <List header="">
                    <Space direction='vertical' block>
                        {
                            props.info.orderitemList.map((item, index) => {
                                return <OrderItem item={item} />
                            })
                        }
                        <List.Item extra={
                            <div>共计
                                <span style={{fontWeight: 'bold', fontSize: '16px', color: 'red'}}>￥{IntToPrice(sum(props.info.orderitemList))}</span>
                                , 实付
                                <span style={{fontWeight: 'bold', fontSize: '16px', color: 'green'}}>￥{IntToPrice(sum(props.info.orderitemList))}</span>
                            </div>
                        }>

                        </List.Item>
                    </Space>
                    </List>
                </Collapse.Panel>

                <Collapse.Panel title={<div style={{fontSize: 15}}>物流信息</div>} key={2}>
                <List header="">
                    <List.Item prefix={text('快递单号')} extra={text("312092345856650")} />
                    <List.Item prefix={text('收件人')} extra={text("团购爱好者")} />
                    <List.Item prefix={text('联系电话')} extra={text(props.info.tel)} />
                    {
                        props.info.address && ((props.info.address.length > 10)?
                        <List.Item prefix={text('收货地址')}>
                            <TextArea readOnly autoSize disabled style={{'--font-size': '14px'}} value={props.info.address} />
                        </List.Item> : 
                        <List.Item prefix={text('收货地址')} extra={text(props.info.address)}>
                        </List.Item>)
                    }
                </List>
                </Collapse.Panel>

            </Collapse>
            
            <div className="footer2" onClick={e => e.stopPropagation()}>
            {
                (props.info.orderStatus < 4)?
                <Space block>
                    <Button
                        color='primary'
                        onClick={() => {setVisible(true)}}
                        size='mini'
                    >
                        修改物流信息
                    </Button>

                    {
                    (props.info.orderStatus == 1) &&
                    <Button
                        color='primary'
                        onClick={() => {setVisible(true)}}
                        size='mini'
                    >
                        发货
                    </Button>
                    }

                    <Button
                        color='primary'
                        onClick={() => {cancelOrder()}}
                        size='mini'
                    >
                        取消订单
                    </Button>

                    <Button
                        color='primary'
                        onClick={() => {}}
                        size='mini'
                    >
                        退款
                    </Button>
                </Space> : 
                <Space block>
                <Button
                    color='danger'
                    onClick={() => {}}
                    size='mini'
                >
                    删除记录
                </Button>
            </Space>
            }
            </div>

            <Popup visible={visible} onMaskClick={()=>{setVisible(false)}}>
                <div style={{ height: '80vh', overflowY: 'scroll' }}>
                <Form
                    layout='horizontal'
                    onFinish={(values)=>{ 
                        console.log(JSON.stringify(values));
                        setVisible(false);
                        form.resetFields();
                    }}
                    footer={
                    <Button block type='submit' color='primary' size='large'>
                        修改信息
                    </Button>
                    }
                    form={form}
                >
                    <Form.Header>请输入物流信息</Form.Header>
                    <Form.Item name='expressID' label='快递单号' initialValue={''}>
                        <Input onChange={console.log} placeholder='请输入快递单号' />
                    </Form.Item>
                    <Form.Item name='consignee' label='收货人' rules={[{ required: true, message: '收货人不能为空' }]} initialValue={"团购爱好者"}>
                        <Input placeholder='请输入收货人' />
                    </Form.Item>
                    <Form.Item name='phone' label='电话' initialValue={'12345678901'}>
                        <Input placeholder='请输入电话' />
                    </Form.Item>
                    <Form.Item name='address' label='地址' help='不超过300字' initialValue={'上海交通大学东川路800号上海交通大学闵行校区快递中心菜鸟驿站'}>
                        <TextArea placeholder='请输入收获地址' maxLength={300} autoSize={{minRows: 4, maxRows: 12}} />
                    </Form.Item>
                </Form>
                </div>
            </Popup>

            </Card>
        </div>
    );
}

const OrderItem = (props) => {
    const itemPrice = props.item.itemPrice;
    const itemBuynum = props.item.itemBuynum;

    return (
        <List.Item
        width='100%'
        style={{flex: 1}}
        prefix={<div className='imagesContainer'><Image src={props.item.itemImage} /></div>}
        description={<div><span style={{fontWeight: 'bold'}}>￥{IntToPrice(itemPrice)}</span> x {itemBuynum}</div>}
        extra={<div style={{width: '100%', fontSize: 20, fontWeight: 700, color: 'red'}}>￥{IntToPrice(Number(itemPrice) * itemBuynum)}</div>}
        >
            {props.item.itemName}
        
        </List.Item>
    );
}