import React from 'react';
import { NavBar } from 'antd-mobile';

const Header = (props) => {
    return (
        <div className="app_top" style={{backgroundColor: '#e5e5e5', flex: 1}}>
            <NavBar onBack={props.onBack} back={props.back} backArrow={props.backArrow} right={props.right}>{props.title}</NavBar>
        </div>
    );
}

export default Header;