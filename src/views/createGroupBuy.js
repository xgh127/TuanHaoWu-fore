import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  TextArea,
  DatePicker,
  Space,
  Toast,
  Selector,
} from 'antd-mobile'
import { AddOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import Header from '../components/header'
import ProductItem from '../components/productItem'
import AddItemPopup from '../components/addItemPopup'
import { PriceToInt } from '../utils/transformPrice'
import { doJSONPost } from '../utils/ajax'
import { ToYYYYMMDD } from '../utils/transformTime'

export default (props) => {
  const navigate = useNavigate();

  const goBack = () => {
      console.log(window.history.length);
      console.log("回退");
      console.log(window.history.length);
      navigate('/admin', { replace: true });
  }

  useEffect(()=>{
    window.history.pushState(null, null);
    window.addEventListener('popstate', goBack);
    console.log("监听");
    return () => {console.log("移除"); window.removeEventListener('popstate', goBack) };
  }, []);

  const onFinish = async (values) => {
    console.log(values);
    console.log(JSON.stringify(values));
    for(let i = 0; i < items.length; ++i) {
      if(!items[i].itemSecKill)   continue;
      if(items[i].skStartTime < values["startTime"]) {
        Toast.show('商品' + (Number(i) + 1) + '的秒杀开始时间不能早于团购开始时间' );
        return;
      }
      if(items[i].skEndTime > values["endTime"]) {
        Toast.show('商品' + (Number(i) + 1) + '的秒杀结束时间不能晚于团购结束时间' );
        return;
      }
    }

    let _items = items;

    for(let i = 0; i < items.length; ++i) {
      if(!items[i].itemSeckill)   continue;
      _items[i]["skStartTime"] = ToYYYYMMDD(items[i].skStartTime);
      _items[i]["skEndTime"] = ToYYYYMMDD(items[i].skEndTime);
    }

    console.log("hhhhh" + _items);

    values["items"] = _items;
    values["groupLeader"] = props.user.name;
    let [logisticWay] = values["logistics"];
    values["logistics"] = logisticWay;
    values["startTime"] = ToYYYYMMDD(values["startTime"]);
    values["endTime"] = ToYYYYMMDD(values["endTime"]);
    console.log(values);
    console.log(JSON.stringify(values));
    let responseJSON = await doJSONPost("/createGroup", values);
    Toast.show({
      content: responseJSON.msg,
      afterClose: () => {
          window.history.back();
          goBack();
      },
      icon: 'success'
    });
  }

  const [startPickerVisible, setStartPickerVisible] = useState(false)
  const [endPickerVisible, setEndPickerVisible] = useState(false)

  const [popupVisible, setPopupVisible] = useState(false);

  const [items, setItems] = useState([])

  const addItem = (newItem) => {
    let itemList = items;
    newItem["itemPrice"] = PriceToInt(newItem["itemPrice"]);
    itemList.push(newItem);
    setItems(itemList);
  }

  const modifyItem = (itemList) => {
    setItems(itemList);
  }

  const [groupBuyForm] = Form.useForm();

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

  return (
    <div style={{flex: 1}}>
      <Header onBack={() => { window.history.back(); goBack() }} title='新建团购' />
      <Form layout="horizontal" onFinish={v=>onFinish(v)} footer={
          <Button block type='submit' color='primary' size='large'>
            提交
          </Button>
        }
        mode='card'
        form={groupBuyForm}
      >
        <Form.Header>新建团购</Form.Header>

        <Form.Item name='groupTitle' label='标题' rules={[{ required: true, message: '标题不能为空' }]}>
          <Input placeholder='请输入团购活动标题' />
        </Form.Item>

        <Form.Item name='groupDescription' label='描述'>
          <TextArea placeholder='请输入团购活动内容' autoSize={{minRows: 3, maxRows: 8}} />
        </Form.Item>

        <Form.Item name='startTime' label='开始时间' trigger='onConfirm' onClick={() => { setStartPickerVisible(true) }}
        rules={[{required: true, message: '请选择开始时间'}, { validator: (rule, value=null)=>{
            const endTime = groupBuyForm.getFieldValue('endTime');  
            if(endTime && value > endTime)   return new Promise((resolve, reject) => reject('开始时间不能晚于结束时间'));
            return Promise.resolve();
        }}]} dependencies={['endTime']}>
          <DatePicker visible={startPickerVisible} precision='second' onClose={() => { setStartPickerVisible(false) }} min={new Date()}>
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
        }}]} dependencies={['startTime']}>
          <DatePicker visible={endPickerVisible} precision='second' onClose={() => { setEndPickerVisible(false) }} min={new Date()}>
            {value =>
              value ? ToYYYYMMDD(value) : '请选择时间'
            }
          </DatePicker>
        </Form.Item>

        <Form.Item name='logistics' label='物流方式' trigger='onConfirm' rules={[{required: true, message: '请选择物流方式'}]}>
          <Selector
            options={logisticOptions}
            onChange={(v)=>{groupBuyForm.setFieldsValue({logistics: v})}}
          />
        </Form.Item>

        <Button block type='button' onClick={()=>{setPopupVisible(true)}}>
          <Space>
            <AddOutline />
            <span>添加商品</span>
          </Space>
        </Button>
      </Form>

      <AddItemPopup visible={popupVisible} setVisible={setPopupVisible} onFinish={addItem} command="add" />

      {
          items.map((item, index)=>{
              console.log(item);
              return <ProductItem index={index} items={items} setItems={modifyItem} />
          })
      }
    </div>
  )
}