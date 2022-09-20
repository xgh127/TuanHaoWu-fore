import React from 'react';
import { TabBar } from 'antd-mobile';
import { useLocation, useNavigate, MemoryRouter as Router } from 'react-router-dom'
import { AppOutline, EditSOutline, UnorderedListOutline, UserOutline, ShopbagOutline } from 'antd-mobile-icons'

const Bottom = (props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { pathname } = location

    const setRouteActive = (value) => {
        navigate(value, {})
    }

    if(props.role === '团长') {
        const tabs = [
          {
            key: '/home',
            title: '首页',
            icon: <AppOutline />,
          },
          {
            key: '/admin',
            title: '团购管理',
            icon: <EditSOutline />,
          },
          {
            key: '/order',
            title: '订单管理',
            icon: <UnorderedListOutline />,
          },
          {
            key: '/me',
            title: '个人中心',
            icon: <UserOutline />,
          },
        ]

        if(pathname === '/home' || pathname === '/admin' || pathname === '/order' || pathname === '/me') {
            return (
                <div className="app_bottom">
                    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)} style={{flex: 1}}>
                        {tabs.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                        ))}
                    </TabBar>
                </div>
            )
        } else {
            return <></>;
        }
    } else if(props.role === '团员') {
          const tabs = [
            {
              key: '/home',
              title: '首页',
              icon: <AppOutline />,
            },
            {
              key: '/user',
              title: '跟团',
              icon: <ShopbagOutline />,
            },
            {
              key: '/user_order',
              title: '我的订单',
              icon: <UnorderedListOutline />,
            },

            {
              key: '/me',
              title: '个人中心',
              icon: <UserOutline />,
            },
          ]

          if(pathname === '/home' || pathname === '/user' || pathname === '/user_order' || pathname === '/me') {
              return (
                  <div className="app_bottom">
                      <TabBar activeKey={pathname} onChange={value => setRouteActive(value)} style={{flex: 1}}>
                          {tabs.map(item => (
                          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                          ))}
                      </TabBar>
                  </div>
              )
          } else {
              return <></>;
          }
    } else {
          const tabs = [
            {
              key: '/home',
              title: '首页',
              icon: <AppOutline />,
            },
            {
              key: '/me',
              title: '个人中心',
              icon: <UserOutline />,
            },
          ]
          if(pathname === '/home' || pathname === '/me') {
            return (
                <div className="app_bottom">
                    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)} style={{flex: 1}}>
                        {tabs.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                        ))}
                    </TabBar>
                </div>
            )
          } else {
              return <></>;
          }
    }
}

export default Bottom;
