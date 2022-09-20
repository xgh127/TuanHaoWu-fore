import React, {useEffect, useState} from "react";
import useForceUpdate from "antd/es/_util/hooks/useForceUpdate"

export default (props)=>{
    const [mss, setMss] = useState(props.time)

    useEffect(()=>{
        const _timer= setInterval(() => {
            console.log(mss)
            setMss(prevState => parseInt(prevState - 1000))
        }, 1000);

        return ()=> {clearInterval(_timer)};
    },[])

    function PrefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }

        let days = parseInt(mss / (1000 * 60 * 60 * 24));
        let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = parseInt((mss % (1000 * 60)) / 1000);
        if(days !== 0)
            return days + " 天 " + PrefixInteger(hours,2) + " : "
                + PrefixInteger(minutes,2) + " : "
                + PrefixInteger(seconds,2);
        return PrefixInteger(hours,2) + " : "
            + PrefixInteger(minutes,2) + " : "
            + PrefixInteger(seconds,2);
}
