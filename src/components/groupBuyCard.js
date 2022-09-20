import React, { useState } from 'react';
import { Modal } from 'antd';
import { Card, Button, Space, Form, Input, TextArea, DatePicker, Selector, Tag, List, Dialog, Toast } from 'antd-mobile';
import { RightOutline, SystemQRcodeOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import ShowLinkAndQR from '../views/showLinkAndQR';
import { doGet, doJSONPost } from '../utils/ajax';
import { ToYYYYMMDD } from '../utils/transformTime';
import 'antd/dist/antd.css';

export default (props) => {
    const navigate = useNavigate();
    const [qrVisible, setQRVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [startPickerVisible, setStartPickerVisible] = useState(false)
    const [endPickerVisible, setEndPickerVisible] = useState(false)
    const [groupBuyForm] = Form.useForm();
    
    const text = (txt) => {
        return <div style={{fontSize: 14}}>{txt}</div>;
    }

    const modifyGroupBuy = async (values) => {
        values["groupId"] = props.info.groupId;
        values["groupLeader"] = props.info.groupLeader;
        let [logisticWay] = values["logistics"];
        values["logistics"] = logisticWay;
        values["startTime"] = ToYYYYMMDD(values["startTime"]);
        values["endTime"] = ToYYYYMMDD(values["endTime"]);

        let response = await doJSONPost("/changeGroupInfo", values);

        props.setGroupBuyList(response.value);
        console.log("response " + JSON.stringify(response));
        if(response.key.status == 0) {
            Toast.show({
            content: "修改成功",
            icon: 'success',
            });
        }
    }

    const handleCancel = () => {
        Dialog.confirm({
            content: '您确定要取消 ' + props.info.groupTitle + " 吗?",
            confirmText: <div style={{color: 'red', fontWeight: 'bold'}}>取消</div>,
            onConfirm: () => deleteGroupBuy(),
        })
    }

    const deleteGroupBuy = async () => {
        console.log("取消中");
        let response = await doGet("/cancelGroup/" + props.info.groupId);
        let groupInfo = await doGet('/searchGroupByGroupLeader/' + props.info.groupLeader);
        props.setGroupBuyList(groupInfo);
        if(response.status == 1) {
            Toast.show("取消团购成功");
        } else {
            Toast.show(response.meg);
        }
    }

    const logisticOptions = [
        {
          label: '快递',
          value: 1,
        },
        {
          label: '同城配送',
          value: 2,
        },
        {
          label: '顾客自提',
          value: 3,
        },
        {
          label: '无物流',
          value: 4,
        },
    ]

    const logisticsWays = ['快递', '同城配送', '顾客自提', '无物流'];

    return (
        <div style={{borderRadius: '36px'}}>
            <Card
                title={
                    <div style={{ fontWeight: 'bold' }}>
                        {props.info.groupTitle}
                        {
                            (!props.info.status)?
                            <Tag color='default' style={{marginLeft: '5px'}}>已取消</Tag> :
                            (new Date(props.info.startTime) > new Date())?
                            <Tag color='primary' style={{marginLeft: '5px'}}>未开始</Tag> :
                            (new Date(props.info.endTime) > new Date())?
                            <Tag color='success' style={{marginLeft: '5px'}}>进行中</Tag> :
                            <Tag color='danger' style={{marginLeft: '5px'}}>已结束</Tag>
                        }
                    </div>
                }
                className='cardItem'
                extra={
                    <RightOutline />
                }
                onHeaderClick={()=>{navigate('/view', { replace: false, state: { items: props.info.items } })}}
                style={{ 'borderRadius': '36px', alignItems: 'center', marginBottom: '5px', marginTop: '5px' }}
            >
                <List>
                    <List.Item prefix={text('起始时间')} extra={text(props.info.startTime)}></List.Item>
                    <List.Item prefix={text('结束时间')} extra={text(props.info.endTime)}></List.Item>
                    <List.Item prefix={text('物流方式')} extra={text(logisticsWays[props.info.logistics - 1])}></List.Item>
                    <List.Item prefix={text('活动内容')} extra={
                        (props.info.groupDescription === null || props.info.groupDescription.length < 12)? text(props.info.groupDescription) :
                        <TextArea autoSize={{minRows: 0, maxRows: 20}} readOnly disabled value={props.info.groupDescription} style={{'--font-size': '14px'}} />
                    }></List.Item>
                </List>

                <div className="footer2" onClick={e => e.stopPropagation()}>
                    {
                        (props.info.status)?
                        <Space direction='horizontal'>
                            <Button color='primary' size='mini' onClick={() => setQRVisible(true)}>
                                <SystemQRcodeOutline />
                            </Button>
                            <Button color='primary' size='mini' onClick={() => setModalVisible(true)}>修改信息</Button>
                            { new Date(props.info.endTime) > new Date()  &&  <Button color='primary' size='mini' onClick={() => setQRVisible(true)}>提前结束</Button> }
                            <Button color='primary' size='mini' onClick={() => handleCancel()}>取消</Button>
                        </Space> : 
                        <Space direction='horizontal'>
                            <Button color='danger' size='mini' onClick={() => {}}>删除记录</Button>
                        </Space>
                    }
                </div>
            </Card>

            <Modal
                title="链接和二维码"
                visible={qrVisible}
                okText="确认"
                cancelText="取消"
                onCancel={() => { setQRVisible(false); }}
                onOk={() => { setQRVisible(false); }}
                footer={()=>{}}
            >
                <ShowLinkAndQR groupId={props.info.groupId} />
            </Modal>

            <Modal
                title="修改团购信息"
                visible={modalVisible}
                okText="确认"
                cancelText="取消"
                onCancel={() => { setModalVisible(false); }}
                onOk={() => { setModalVisible(false); }}
                footer={()=>{}}
            >
                
                <Form layout="horizontal" onFinish={(values)=>{ setModalVisible(false); modifyGroupBuy(values); }} 
                    footer={
                        <Button block type='submit' color='primary' size='large'>
                            修改
                        </Button>
                    }
                    mode='card'
                    form={groupBuyForm}
                >
                    <Form.Header>修改团购信息</Form.Header>

                    <Form.Item name='groupTitle' label='标题' initialValue={props.info.groupTitle} rules={[{ required: true, message: '标题不能为空' }]}>
                        <Input placeholder='请输入团购活动标题' />
                    </Form.Item>

                    <Form.Item name='groupDescription' label='描述' initialValue={props.info.groupDescription}>
                        <TextArea placeholder='请输入团购活动内容' autoSize={{minRows: 3, maxRows: 8}} />
                    </Form.Item>

                    <Form.Item name='startTime' label='开始时间' trigger='onConfirm' onClick={() => { setStartPickerVisible(true) }}
                    rules={[{required: true, message: '请选择开始时间'}, { validator: (rule, value=null)=>{
                        const endTime = groupBuyForm.getFieldValue('endTime');  
                        if(endTime && value > endTime)   return new Promise((resolve, reject) => reject('开始时间不能晚于结束时间'));
                        return Promise.resolve();
                    }}]} dependencies={['endTime']} initialValue={new Date(props.info.startTime)}>
                        <DatePicker format={'YYYY-MM-DD HH:mm:ss'} visible={startPickerVisible} precision='second' onClose={() => { setStartPickerVisible(false) }} min={new Date()}>
                            {value =>
                            value ? ToYYYYMMDD(value) : '请选择时间'
                            }
                        </DatePicker>
                    </Form.Item>

                    <Form.Item name='endTime' label='截止时间' trigger='onConfirm' onClick={() => { setEndPickerVisible(true) }}
                    rules={[{required: true, message: '请选择截止时间'}, { validator: (rule, value=null)=>{
                    const startTime = groupBuyForm.getFieldValue('startTime');
                    if(startTime && value < startTime)   return new Promise((resolve, reject) => reject('结束时间不能早于开始时间'));
                    return Promise.resolve();
                    }}]} dependencies={['startTime']} initialValue={new Date(props.info.endTime)}>
                        <DatePicker visible={endPickerVisible} precision='second' onClose={() => { setEndPickerVisible(false) }} min={new Date()}>
                            {value =>
                            value ? ToYYYYMMDD(value) : '请选择时间'
                            }
                        </DatePicker>
                    </Form.Item>

                    <Form.Item name='logistics' label='物流方式' initialValue={[props.info.logistics]} trigger='onConfirm' rules={[{required: true, message: '请选择物流方式'}]}>
                        <Selector
                            options={logisticOptions}
                            onChange={(v)=>{groupBuyForm.setFieldsValue({logistics: v})}}
                        />
                    </Form.Item>

                    </Form>
            </Modal>

            <div style={{height: '10px', backgroundColor: 'lightblue'}}>
            </div>
        </div>
    );
}