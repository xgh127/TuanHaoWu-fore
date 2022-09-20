export function PriceToInt(price) {
    let index = price.indexOf('.');
    if (index != -1) {
        let intPart = price.substr(0, index);
        let floatPart = price.substr(index + 1);
        if (floatPart.length < 2) floatPart = floatPart + '0';
        return Number(Number(intPart) * 100 + Number(floatPart));
    }
    return Number(price) * 100;
}

export function IntToPrice(price) {
    return (Number(price) / 100).toFixed(2);
}