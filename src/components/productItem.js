import React, { useState } from 'react';
import { Card, Space, Button, Image, Form, Input, Tag } from 'antd-mobile';
import { ShopbagOutline } from 'antd-mobile-icons';
import { PriceToInt, IntToPrice } from '../utils/transformPrice';
import { ToYYYYMMDD } from '../utils/transformTime';
import AddItemPopup from './addItemPopup';

const ProductItem = (props) => {
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

    return  (
        <div style={{width: '90%', marginLeft: '5%'}}>
        <Card
          title={
            <div style={{ fontWeight: 'normal' }}>
              <ShopbagOutline style={{ marginRight: '4px', color: '#1677ff' }} />
                  商品{Number(index) + 1}: {itemInfo.itemName}
              { (itemInfo.itemSeckill)? <Tag color='danger' style={{marginLeft: '5px'}}>秒杀商品</Tag> : <></> }
            </div>
          }
          style={{ borderRadius: '16px', borderColor: 'red', borderBlockColor: 'red', borderWidth: 2, borderBlockWidth: 2 }}
        >

          <Form layout='horizontal' style={{'--font-size': '10px'}}>
              <Form.Item label='商品价格' style={{fontSize: '15px', height: '36px'}}>
                  <Input value={IntToPrice(itemInfo.itemPrice)}  style={{fontSize: '15px'}} disabled={true} />
              </Form.Item>

              <Form.Item label='商品库存' style={{fontSize: '15px', height: '36px'}}>
                  <Input value={itemInfo.itemStock} disabled={true} />
              </Form.Item>

              <Form.Item label='商品描述' style={{fontSize: '15px' }}>
                  <textarea autoSize readOnly disabled value={itemInfo.itemDescription} style={{'--text-align': 'left', borderWidth: 0, backgroundColor: 'white'}} />
              </Form.Item>

              {
                (itemInfo.itemSeckill)? 
                <>
                  <Form.Item label='秒杀开始' style={{fontSize: '15px', height: '36px'}}>
                      <Input value={ToYYYYMMDD(itemInfo.skStartTime)}  style={{fontSize: '15px'}} disabled={true} />
                  </Form.Item>
                  
                  <Form.Item label='秒杀截止' style={{fontSize: '15px', height: '36px'}}>
                      <Input value={ToYYYYMMDD(itemInfo.skEndTime)}  style={{fontSize: '15px'}}  disabled={true} />
                  </Form.Item>
                </> : <></>
              }

              <Form.Item label='商品图片' style={{fontSize: '15px'}}>
                <div className="imagesContainer">
                  <Space wrap>
                    {
                      itemInfo.itemImage.map((itemSrc, index)=>{
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
              <Button color='primary' size='mini' onClick={() => setModifyVisible(true)}> 修改商品 </Button>
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

        <AddItemPopup visible={modifyVisible} setVisible={setModifyVisible} onFinish={modifyItem} command="modify" item={itemInfo} />

        <div style={{height: '10px', backgroundColor: 'lightblue'}}></div>
        </div>
    );
}

export default ProductItem;