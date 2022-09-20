import React, { useState } from 'react';
import { Card, Space, Button, Image, Form, Input, Tag } from 'antd-mobile';
import { ShopbagOutline } from 'antd-mobile-icons';
import { PriceToInt, IntToPrice } from '../utils/transformPrice';
import { ToYYYYMMDD, ToStandard } from '../utils/transformTime';
import AddItemPopup from './addItemPopup';

const ProductItemList = (props) => {
    const index = props.index;
    const items = props.items;
    const itemInfo = items[index];
    const setItems = props.setItems;
    const [modifyVisible, setModifyVisible] = useState(false);

    const modifyItem = (item) => {
        let itemList = items;
        item["itemPrice"] = PriceToInt(item["itemPrice"]);
        itemList[index] = item;
        setItems(itemList);
    }

    let item = itemInfo;
    if(item["skStartTime"] != null) item["skStartTime"] = ToStandard(item["skStartTime"]);
    if(item["skEndTime"] != null) item["skEndTime"] = ToStandard(item["skEndTime"]);
    if(item["itemImage"] != null) item["itemImage"] = [{url: item["itemImage"]}];
    console.log(item);

    return  (
        <div style={{width: '90%', marginLeft: '5%'}}>
        <Card
          title={
            <div style={{ fontWeight: 'normal' }}>
              <ShopbagOutline style={{ marginRight: '4px', color: '#1677ff' }} />
                  商品{Number(index) + 1}: {item.itemName}
              { (item.itemSeckill)? <Tag color='danger' style={{marginLeft: '5px'}}>秒杀商品</Tag> : <></> }
            </div>
          }
          style={{ borderRadius: '16px', borderColor: 'red', borderBlockColor: 'red', borderWidth: 2, borderBlockWidth: 2 }}
        >

          <Form layout='horizontal' style={{'--font-size': '10px'}}>
              <Form.Item label='商品价格' style={{fontSize: '15px', height: '36px'}}>
                  <Input value={IntToPrice(item.itemPrice)}  style={{fontSize: '15px'}} disabled={true} />
              </Form.Item>
              <Form.Item label='商品库存' style={{fontSize: '15px', height: '36px'}}>
                  <Input value={item.itemStock} disabled={true} />
              </Form.Item>
              <Form.Item label='商品描述' style={{fontSize: '15px' }}>
                  <textarea autoSize readOnly disabled value={item.itemDescription} style={{'--text-align': 'left', borderWidth: 0, backgroundColor: 'white'}} />
              </Form.Item>
              {
                (item.itemSeckill)? 
                <>
                  <Form.Item label='秒杀开始' style={{fontSize: '15px', height: '36px'}}>
                      <Input value={ToYYYYMMDD(item.skStartTime)}  style={{fontSize: '15px'}} disabled={true} />
                  </Form.Item>
                  <Form.Item label='秒杀截止' style={{fontSize: '15px', height: '36px'}}>
                      <Input value={ToYYYYMMDD(item.skEndTime)}  style={{fontSize: '15px'}}  disabled={true} />
                  </Form.Item>
                </> : <></>
              }
              <Form.Item label='商品图片' style={{fontSize: '15px'}}>
                <div className="imagesContainer">
                  <Space wrap>
                      {
                          item.itemImage && item.itemImage.map((itemSrc, index)=>{
                              console.log(item.itemImage);
                              console.log(itemSrc);
                              return <Image src={itemSrc.url} />
                          })
                      }
                  </Space>
                </div>
              </Form.Item>
          </Form>

          <div className="footer2" onClick={e => e.stopPropagation()}>
            <Space>
              <Button color='primary' size='mini' onClick={() => {}}> 修改商品 </Button>
              <Button color='primary' size='mini' onClick={() => {             
                    let itemList = items;
                    itemList.splice(index, 1);
                    console.log(itemList);
                    setItems([...itemList]); 
                  }}
              >
                  删除商品
              </Button>
            </Space>
          </div>
        </Card>

        <AddItemPopup visible={modifyVisible} setVisible={setModifyVisible} onFinish={modifyItem} command="modify" item={item} />

        <div style={{height: '10px', backgroundColor: 'lightblue'}}></div>
        </div>
    );
}

export default ProductItemList;