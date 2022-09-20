import {Card} from 'antd';
import {AutoCenter, Image, List, Swiper} from "antd-mobile";

const { Meta } = Card;

const ShopCard = (props) => {
    const items = props.groupInfo.items.map((item, index)=>(
        <Swiper.Item key={index}>
            <Image src={item.itemImage}/>
        </Swiper.Item>
    ))
    return (
        <>
        <Swiper>{items}</Swiper>
        <List>
            <List.Item description={props.groupInfo.groupLeader}>
                <AutoCenter>{props.groupInfo.groupTitle}</AutoCenter>
            </List.Item>
        </List>
        </>
    );
}
export default ShopCard;
