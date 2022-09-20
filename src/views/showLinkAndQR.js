import React from 'react';
import QRCode from 'qrcode.react';
import { Button, Space, Toast, Input, Icon } from 'antd-mobile';
import { LinkOutline } from 'antd-mobile-icons';
import copy from 'copy-to-clipboard';

export default (props) => {
    const linkUrl = 'http://tuanhaowu.com:3000/goods_view?groupId=' + props.groupId;

    const handleDownloadQR = () => {
        let qr = document.getElementById('qrCode');
        let dataUrl = qr.toDataURL("image/png");
        let blob = dataURLToBlob(dataUrl);
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', '二维码');
        a.setAttribute('target', '_blank');
        let clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('click', true, true);
        a.dispatchEvent(clickEvent);
    }

    const dataURLToBlob = (dataUrl) => {
        let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    }

    const handleCopyLink = () => {
        copy(linkUrl);
        Toast.show('复制成功');
    }

    return (
        <div>
            <Space direction='vertical' justify='center' block align='center'>
                <QRCode id='qrCode' value={linkUrl} size={300} fgColor='#000000' />
                <input  id='link' value={linkUrl} disabled={true} style={{fontSize: 22, borderWidth: 2, borderRadius: 5}} />
                <Space block justify='center'>
                    <Button size='large' color='primary' onClick={handleCopyLink}>复制链接</Button>
                    <Button size='large' color='primary' onClick={handleDownloadQR}>保存二维码</Button>
                </Space>
            </Space>
        </div>
    );
}