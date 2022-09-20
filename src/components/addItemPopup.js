import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  TextArea,
  DatePicker,
  ImageUploader,
  Stepper,
  Popup,
  Checkbox,
} from 'antd-mobile'
import { imageUpload } from '../utils/imageUpload'
import dayjs from 'dayjs'
import { IntToPrice } from '../utils/transformPrice'

export default (props) => {
    const [form] = Form.useForm();
    const visible = props.visible;
    const setVisible = props.setVisible;

    const [secKillStartPickerVisible, setSecKillStartPickerVisible] = useState(false);
    const [secKillEndPickerVisible, setSecKillEndPickerVisible] = useState(false);

    const flag = (props.command === 'add');

    const [secKill, setSecKill] = useState(flag? false : props.item.itemSeckill);

    if(!flag)   console.log(props.item.itemImage);

    return (
        <Popup visible={visible} onMaskClick={()=>{setVisible(false)}}>
            <div style={{ height: '80vh', overflowY: 'scroll' }}>
                <Form
                    layout='horizontal'
                    onFinish={(values)=>{ 
                        setVisible(false);
                        if(flag) {
                            setSecKill(false);
                            form.resetFields();
                        } else  form.setFieldsValue(values);
                        props.onFinish(values);
                    }}
                    footer={
                        <Button block type='submit' color='primary' size='large'>
                            { flag? '添加' : '修改' }
                        </Button>
                    }
                    form={form}
                >
                    <Form.Header>请输入商品信息</Form.Header>

                    <Form.Item name='itemName' label='商品名称' rules={[{ required: true, message: '商品名称不能为空' }]} initialValue={flag? '' : props.item.itemName}>
                        <Input placeholder='请输入商品名称' />
                    </Form.Item>

                    <Form.Item name='itemStock' label='商品库存' rules={[{ required: true, message: '商品库存不能为空' }]} initialValue={flag? 1 : props.item.itemStock}>
                        <Stepper min={1} />
                    </Form.Item>

                    <Form.Item name='itemPrice' label='商品价格' initialValue={flag? '' : IntToPrice(props.item.itemPrice)} rules={[
                        {
                            required: true,
                            pattern: new RegExp(/^(([1-9]\d*)|\d)(\.\d{1,2})?$/, 'g'),
                            message: '请输入正确的金额',
                        },
                    ]}>
                        <Input placeholder='请输入商品价格' />
                    </Form.Item>

                    <Form.Item name='itemSeckill' label='商品秒杀' initialValue={flag? false : props.item.itemSeckill}>
                        <Checkbox style={{'--icon-size': '18px'}} onChange={v=>{ setSecKill(v) }} defaultChecked={flag? false : props.item.itemSeckill}>秒杀</Checkbox>
                    </Form.Item>

                    {
                        (secKill)?
                        <>
                            <Form.Item name='skStartTime' label='开始时间' trigger='onConfirm' onClick={() => { setSecKillStartPickerVisible(true) }} 
                                initialValue={flag? null : props.item.skStartTime}
                                rules={[{required: true, message: '请选择秒杀开始时间'}, { validator: (rule, value=null)=>{
                                    const endTime = form.getFieldValue('skEndTime');  
                                    if(endTime && value && value > endTime)   return new Promise((resolve, reject) => reject('开始时间不能晚于结束时间'));
                                    return Promise.resolve();
                                }}]} dependencies={['skEndTime']}>
                                <DatePicker visible={secKillStartPickerVisible} precision='second' onClose={() => { setSecKillStartPickerVisible(false) }} min={new Date()}>
                                    {
                                        value =>value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '请选择秒杀开始时间'
                                    }
                                </DatePicker>
                            </Form.Item>
                    
                            <Form.Item name='skEndTime' label='截止时间' trigger='onConfirm' onClick={() => { setSecKillEndPickerVisible(true) }}
                                initialValue={flag? null : props.item.skEndTime}
                                rules={[{required: true, message: '请选择秒杀截止时间'}, { validator: (rule, value=null)=>{
                                    const startTime = form.getFieldValue('skStartTime');
                                    if(startTime&& value && value < startTime)   return new Promise((resolve, reject) => reject('结束时间不能早于开始时间'));
                                    return Promise.resolve();
                                  }}]} dependencies={['skStartTime']}>
                                <DatePicker visible={secKillEndPickerVisible} precision='second' onClose={() => { setSecKillEndPickerVisible(false) }} min={new Date()}>
                                    {
                                        value =>value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '请选择秒杀截止时间'
                                    }
                                </DatePicker>
                            </Form.Item>
                        </> : <></>
                    }
                    <Form.Item name='itemImage' label='商品图片' initialValue={flag? [] : props.item.itemImage}>
                        <ImageUploader
                            upload={imageUpload}
                        />
                    </Form.Item>
                    <Form.Item name='itemDescription' label='商品描述' help='不超过300字' initialValue={flag? '' : props.item.itemDescription}>
                        <TextArea placeholder='请输入商品描述' maxLength={300} autoSize={{minRows: 4, maxRows: 12}} />
                    </Form.Item>
                </Form>
            </div>
        </Popup>
    );
}