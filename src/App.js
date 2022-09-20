import React, { useEffect, useState } from 'react'
import { SearchBar, Swiper, Toast, Space } from 'antd-mobile'
import { Route, Routes, MemoryRouter as Router } from 'react-router-dom'
import Bottom from './components/bottom'
import AdminGroupBuy from './views/adminGroupBuy'
import CreateGroupBuy from './views/createGroupBuy'
import './App.less'
import 'antd-mobile/es/global/global.css'
import ViewProducts from './views/viewProducts'
import Header from './components/header'
import OrderView from './views/orderView'
import PersonalCenter from './views/personCenter'
import SwitchRole from './views/switchRole'
import PersonInfo from './views/personInfo'
import ScanCode from './views/scanCode'
import HomeView from "./views/homeView";
import UserGroupBuy from "./views/userGroupBuy";
import FollowGroupBuy from "./views/followGroupBuy";
import UserOrderManager from "./views/userOrderManager";
import LoginView from './views/loginView';
import RegisterView from './views/registerView'
import PayOrderView from "./views/payOrderView";
import SearchResultView from "./views/searchResultView";
import ViewGoods from "./views/viewGoods";

export default () => {
  const [role, setRole] = useState();
  const [user, setUser] = useState();
  const [groupBuyList, setGroupBuyList] = useState([]);
  const [groupOrderList, setGroupOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState('');
  useEffect(()=>{
    let userInfo = localStorage.getItem("user");
    if(userInfo == null) {
      setUser(null);
      setLoading(false);
    } else {
      setUser(JSON.parse(userInfo));
      setRole(localStorage.getItem("role"));
      setLoading(false);
    }
    console.log(userInfo);
  }, []);
  if(loading) {
      return <></>;
  } else {
    return (
      <Router initialEntries={[(user === null)? '/login' : '/home']}>
        <div className="app_app">
          <div className="app_body">
            <Routes>
              <Route path='/home' element={<HomeView link={link} setLink={setLink} />} /> {/*首页*/}
              <Route path='search' element={<SearchResultView />} /> {/*搜索页*/}
              <Route path='/admin' element={<AdminGroupBuy user={user} groupBuyList={groupBuyList} setGroupBuyList={setGroupBuyList} />} />
              <Route path='/me' element={<PersonalCenter role={role} user={user} setUser={setUser} />} />
              <Route path='/create' element={<CreateGroupBuy user={user} />} />
              <Route path='/view' element={<ViewProducts />} />
              <Route path='/goods_view' element={<ViewGoods />} />  {/*商品详情页（下订单）*/}
              <Route path='/order' element={<OrderView user={user} groupOrderList={groupOrderList} setGroupOrderList={setGroupOrderList} />} />
              <Route path='/switch' element={<SwitchRole role={role} setRole={setRole} />} />
              <Route path='/info' element={<PersonInfo user={user} setRole={setRole} setUser={setUser} />} />
              <Route path='/scan' element={<ScanCode />} />
              <Route path='/user' element={<UserGroupBuy />} /> {/*团购历史? 查找具体团购*/}
              <Route path='/follow' element={<FollowGroupBuy />} /> {/*单团购选购*/}
              <Route path='/user_order' element={<UserOrderManager />} /> {/*订单界面*/}
              <Route path='/pay' element={<PayOrderView/>} />
              <Route path='/login' element={<LoginView setRole={setRole} setUser={setUser} />} />
              <Route path='/register' element={<RegisterView />} />
            </Routes>
          </div>
          <Bottom role={role} />
        </div>
      </Router>
    );
  }
}

const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']

const items = colors.map((color, index) => (
  <Swiper.Item key={index}>
    <div
      className="content"
      style={{ background: color }}
      onClick={() => {
        Toast.show(`你点击了卡片 ${index + 1}`)
      }}
    >
      {index + 1}
    </div>
  </Swiper.Item>
))


