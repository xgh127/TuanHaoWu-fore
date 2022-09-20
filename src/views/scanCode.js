import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoCenter, Space } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import { BrowserMultiFormatReader } from '@zxing/library';
import { doGet } from '../utils/ajax';
import Header from '../components/header';

export default () => {
    const navigate = useNavigate();
    const codeReader = new BrowserMultiFormatReader();
    useEffect(() => {
        openScan()
    }, [])

    const goBack = () => {
        console.log("回退");
        navigate('/me', { replace: true });
    }
  
    useEffect(()=>{
      window.history.pushState(null, null);
      window.addEventListener('popstate', goBack);
      console.log("监听");
      return () => {console.log("移除"); window.removeEventListener('popstate', goBack) };
    }, []);

    async function openScan() {
        codeReader.listVideoInputDevices().then((videoInputDevices) => {
            let firstDeviceId = videoInputDevices[0].deviceId;
            codeReader.decodeFromVideoDevice(((videoInputDevices.length > 2)? null : firstDeviceId), 'video', (result, err) => {
                if(result) {
                    console.log(result);
                    codeReader.stopContinuousDecode();
                    result = result.text;
                    let dst = result.substring(result.lastIndexOf('/'), result.indexOf('?'));
                    let groupId = result.substring(result.indexOf('=') + 1);
                    const getData = async() => {
                        let group = await doGet('/searchGroupByGroupId/' + groupId);
                        navigate(dst, { state: { groupInfo: group, back: '/scan', backState: null }, replace: true });
                    }
                    getData();
                }
                if(err) {
                    console.log(err);
                }
            })
        }).catch(err=>{
            console.error(err);
            alert(err);
            navigate("/me", {})
        })
    }
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    const min = (a, b) => { return (a < b)? a : b; }
    const size = min(width, height);

    return (
        <div style={{flex: 1}}>
            <Space direction='vertical' block>
                <Header title="扫一扫" onBack={()=>{ window.history.back(); goBack(); }} backArrow={<LeftOutline />} />
                <AutoCenter style={{borderRadius: 24}}>
                    <div className='overlayContent' style={{borderRadius: 24}}>
                        <video id="video" className='overlayContent' style={{width: min(width, height), height: min(width, height) * 0.8, borderRadius: 24}} />
                    </div>
                </AutoCenter>
            </Space>
        </div>
    );
}