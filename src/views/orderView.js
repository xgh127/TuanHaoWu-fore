import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/header';
import { SearchBar, Space, Dropdown, Radio, Card } from 'antd-mobile';
import OrderCard from '../components/orderCard';
import { doGet } from '../utils/ajax';

export default (props) => {
    const [sort, setSort] = useState('排序');
    const [orderState, setOrderState] = useState("全部订单");
    const [moreSelect, setMoreSelect] = useState("更多筛选");
    const [groupOrderList, setGroupOrderList] = useState(props.groupOrderList);

    const ref = useRef(null);

    useEffect(() => {
        const getData = async() => {
            let url = "/getOrdersForGroupLeader/" + props.user.userid;
            console.log(url);
            let orderInfo = await doGet(url);
            setGroupOrderList(orderInfo);
            props.setGroupOrderList(orderInfo);
            console.log(orderInfo);
        }
        getData();
    }, []);

    return (
        <div style={{flex: 1}}>
            <Header title='订单管理' backArrow={false} />

            <Space direction='vertical' justify='center' block>

                <SearchBar
                    placeholder='请输入内容'
                    style={{ '--background': '#ffffff', marginTop: '10px' }}
                />

                <Dropdown ref={ref}>
                    <Dropdown.Item key='sorter' title={sort}>
                        <div style={{ padding: 12 }}>
                            <Radio.Group defaultValue='default' value={sort} onChange={(val)=>{setSort(val); ref.current?.close();}}>
                                <Space direction='vertical' block>
                                <Radio block value='时间最近'>
                                    时间最近
                                </Radio>
                                <Radio block value='时间最远'>
                                    时间最远
                                </Radio>
                                <Radio block value='综合排序'>
                                    综合排序
                                </Radio>
                                </Space>
                            </Radio.Group>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item key='bizop' title={orderState}>
                        <div style={{ padding: 12 }}>
                            <Radio.Group defaultValue='default' value={orderState} onChange={(val)=>{setOrderState(val); ref.current?.close();}}>
                                <Space direction='vertical' block>
                                <Radio block value='全部订单'>
                                    全部订单
                                </Radio>
                                <Radio block value='已支付'>
                                    已支付
                                </Radio>
                                <Radio block value='已发货'>
                                    已发货
                                </Radio>
                                <Radio block value='待收货'>
                                    待收货
                                </Radio>
                                <Radio block value='已收货'>
                                    已收货
                                </Radio>
                                </Space>
                            </Radio.Group>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item key='more' title={moreSelect}>
                        <div style={{ padding: 12 }}>
                            <Radio.Group defaultValue='default' value={moreSelect} onChange={(val)=>{setMoreSelect(val); ref.current?.close()}}>
                                <Space direction='vertical' block>
                                <Radio block value='最近7天'>
                                    最近7天
                                </Radio>
                                <Radio block value='最近一个月'>
                                    最近一个月
                                </Radio>
                                <Radio block value='最近三个月'>
                                    最近三个月
                                </Radio>
                                <Radio block value='最近半年'>
                                    最近半年
                                </Radio>
                                <Radio block value='最近半年之前'>
                                    最近半年之前
                                </Radio>
                                </Space>
                            </Radio.Group>
                        </div>
                    </Dropdown.Item>
                </Dropdown>

                {
                    groupOrderList.map((item, index) => {
                        return <OrderCard info={item} index={index} userid={props.user.userid} setGroupOrderList={v => { setGroupOrderList(v); props.setGroupOrderList(v); }} />;
                    })
                }

            </Space>
            <div style={{height: '80px', backgroundColor: 'lightblue'}}></div>
        </div>
    );
}