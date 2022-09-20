import React, { useState, useEffect } from 'react';
import ProductItemList from '../components/productItemList';
import Header from '../components/header';
import { useLocation, useNavigate } from 'react-router-dom';
import { AddOutline } from 'antd-mobile-icons';
import AddItemPopup from '../components/addItemPopup';

export default () => {
    // const items = [
    //     {"itemName":"深入理解计算机系统","itemStock":5,"itemPrice":"13560","itemSecKill": false, "itemImage":[{"url":"blob:http://localhost:3000/62ca8118-caed-4cda-a789-e729fa3e8b6f"}],"itemDescription":"hhhhhh"},
    //     {"itemName":"Java编程思想","itemStock":5,"itemPrice":"11200","itemSecKill": false, "itemImage":[{"url":"blob:http://localhost:3000/62ca8118-caed-4cda-a789-e729fa3e8b6f"}],"itemDescription":"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhjjjjjjjjjj"},
    // ];
    //const [items, setItems] = useState([]);

    const [popupVisible, setPopupVisible] = useState(false)

    const modifyItem = () => {

    }

    const location = useLocation();

    const items = location.state.items;
    // useEffect(() => {
    //     console.log(location);
    //     const fetchData = async() => {
    //         let response = await doGet('/searchGroupItemByGroupID/' + location.state.groupId);
    //         console.log(response);
    //         setItems(response);
    //     }
    //     fetchData();
    // }, [])

    const navigate = useNavigate();
    
    const goBack = () => {
        console.log("回退");
        navigate('/admin', { replace: true });
    }
  
    useEffect(()=>{
      window.history.pushState(null, null);
      window.addEventListener('popstate', goBack);
      console.log("监听");
      return () => {console.log("移除"); window.removeEventListener('popstate', goBack) };
    }, []);

    return (
        <div style={{flex: 1}}>

            <Header title='团购商品' onBack={ () => { window.history.back(); goBack(); }} right={
                <div><AddOutline fontSize={20} onClick={()=>{setPopupVisible(true)}} /></div>
            } />

            <div style={{height: '10px', backgroundColor: 'lightblue'}}></div>
            {
                items.map((item, index)=>{
                    //console.log(item);
                    return <ProductItemList index={index} items={items} setItems={modifyItem} />
                })
            }

            <AddItemPopup visible={popupVisible} setVisible={setPopupVisible} onFinish={(v)=>{}} command="add" />
        </div>
    );
}