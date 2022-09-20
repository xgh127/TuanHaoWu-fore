import {useNavigate} from "react-router-dom";
import Header from "../components/header";
import {
    AutoCenter, Avatar,
    Button,
    Card,
    Divider, DotLoading,
    Form,
    ImageUploader,
    InfiniteScroll,
    Input,
    List,
    Popup,
    Space,
    Stepper,
    TextArea
} from "antd-mobile";
import {AddCircleOutline, RightOutline, LocationFill} from "antd-mobile-icons";
import {mockUpload} from "../utils/imageUpload";
import {Modal} from "antd";
import ShowLinkAndQR from "./showLinkAndQR";
import {useEffect, useState} from "react";
import {sleep} from "antd-mobile/es/utils/sleep";
import React from "react";
import {doGet} from "../utils/ajax";
import {IntToPrice} from "../utils/transformPrice";

export default () => {
    const navigate = useNavigate();

    const [hasMore, setHasMore] = useState(true)
    const [info, setInfo] = useState([])
    const [allInfo, setAllInfo] = useState([])

    useEffect(()=>{
        async function fetchHistory(){
            let response = await doGet('/searchAllGroup')
            console.log(response.length)
            if(response.length < 4){
                setHasMore(false)
                setInfo(response)
            }
            else {
                let p_info = []
                let p_allInfo = []
                response.map((group,index)=>{
                    if(p_info.length<4) p_info.push(group)
                    else p_allInfo.push(group)
                })
                setInfo(p_info)
                setAllInfo(p_allInfo)
            }
        }
        fetchHistory()
    },[])

    async function loadMore(){
        await sleep(4000)
        let newInfo = []
        allInfo.map((group,index)=>{
            if(newInfo.length>4) return;
            newInfo.push(group)
            allInfo.pop()
        })

        setInfo(info => [...info, ...newInfo])
        if(allInfo.length === 0)
            setHasMore(false)
    }

    const InfiniteScrollContent = ({ hasMore }) => {
        return (
            <>
            {hasMore ?
                (<>
                <span>Loading</span>
                <DotLoading />
                </>) :
                (<Divider>没有更多了</Divider>)}
        </>
        );
    };

    return (
        <div style={{flex: 1}}>
            <Header back='' backArrow={false} title='我的团购' />
            <div style={{marginLeft: '5px', marginRight: '5px'}}>
                <Button block size={"large"} style={{borderColor: 'purple', marginTop: '10px',
                    borderRadius:'8px', lineHeight:"48px"} }
                    onClick={()=>{}}>
                    <Space style={{ '--gap': '10%' }} justify={"center"}>
                        <LocationFill fontSize={48}/>
                        <h2 style={{ marginBlockStart: 0, marginBlockEnd: 0, marginBottom: 0 }}>查看附近团购</h2>
                        <RightOutline fontSize={48}/>
                    </Space>
                </Button>
                <Divider> </Divider>
                <Button block  size={"large"}
                        type='button' onClick={() => navigate('/follow', {})} style={{borderColor: 'blue', marginTop: '10px'}}>
                    <Space>
                        <AddCircleOutline />
                        <span>新的跟团</span>
                    </Space>
                </Button>
                <List header='浏览历史' style={{borderColor: 'red'}}>
                    {
                        info.map((info)=>{
                            return(
                                <UserGroupBuy groupInfo={info}/>
                            )
                        })
                    }
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} >
                    <InfiniteScrollContent hasMore={hasMore}/>
                </InfiniteScroll>
            </div>
            <div style={{height: '50px', backgroundColor: 'lightblue'}}></div>
        </div>
    );
}

const UserGroupBuy =(props)=>{
    const navigate = useNavigate()
    const groupInfo = props.groupInfo

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
                        state: { groupInfo:groupInfo, back:'/user', backState: null  } }
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

