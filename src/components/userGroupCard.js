import {useNavigate} from "react-router-dom";
import {Avatar, Button, Card, List, Space, TextArea} from "antd-mobile";
import {RightOutline} from "antd-mobile-icons";
import React from "react";
import {IntToPrice} from "../utils/transformPrice";

export default (props)=>{
    const navigate = useNavigate()
    const groupInfo = props.groupInfo
    const searchText = props.txt

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

    return(
        <div style={{borderRadius: '36px'}}>
            <Card
                title={
                    <div style={{ fontWeight: 'normal' }}>
                        {groupInfo.groupTitle}
                    </div>
                }
                className='cardItem'
                extra={
                    <RightOutline />
                }
                onHeaderClick={()=>{
                    navigate('/goods_view', {
                        replace: true,
                        state: { groupInfo:groupInfo, back:'/search', backState: {txt: searchText}  } }
                    )
                }}
                style={{ borderRadius: '36px', alignItems: 'center', marginBottom: '5px', marginTop: '5px' }}
            >
                <List>
                    <List.Item prefix={'发起人'}>{groupInfo.groupLeader}</List.Item>
                    <List.Item prefix={'起止时间'} >
                        <Space direction={"vertical"}>
                            {groupInfo.startTime}
                            {groupInfo.endTime}
                        </Space>
                    </List.Item>
                    <List.Item prefix={'物流方式'} >
                        <Logistics logistics={groupInfo.logistics}/>
                    </List.Item>
                    {/*<List.Item prefix={'活动内容'} extra={*/}
                    {/*    <TextArea autoSize={{minRows: 0, maxRows: 20}} readOnly disabled  style={{'--font-size': '14px'}} />*/}
                    {/*}></List.Item>*/}
                    <List.Item>
                        <List>
                            {
                                groupInfo.items.map((item)=>{
                                    return(
                                        <List.Item prefix={<Avatar src={item.itemImage} />}
                                                   extra={<Space>¥{IntToPrice(item.itemPrice)}</Space>}>
                                            {item.itemName}
                                        </List.Item>
                                    )
                                })
                            }
                        </List>
                    </List.Item>
                </List>
            </Card>
            <div style={{height: '10px', backgroundColor: 'lightblue'}}>
            </div>
        </div>
    )
}
