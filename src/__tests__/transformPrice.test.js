import { PriceToInt, IntToPrice } from "../utils/transformPrice";

test("Price to int", () => {
    expect(PriceToInt('9')).toBe(900);
    expect(PriceToInt('9.0')).toBe(900);
    expect(PriceToInt('9.00')).toBe(900);
    expect(PriceToInt('9.9')).toBe(990);
    expect(PriceToInt('9.90')).toBe(990);
    expect(PriceToInt('9.99')).toBe(999);
    expect(PriceToInt('9.09')).toBe(909);
    expect(PriceToInt('0.9')).toBe(90);
    expect(PriceToInt('0.99')).toBe(99);
    expect(PriceToInt('0.09')).toBe(9);
    expect(PriceToInt('90.09')).toBe(9009);
})

test("Int to price", () => {
    expect(IntToPrice(900)).toBe('9.00');
    expect(IntToPrice(990)).toBe('9.90');
    expect(IntToPrice(999)).toBe('9.99');
    expect(IntToPrice(909)).toBe('9.09');
    expect(IntToPrice(90)).toBe('0.90');
    expect(IntToPrice(99)).toBe('0.99');
    expect(IntToPrice(9)).toBe('0.09');
    expect(IntToPrice(9009)).toBe('90.09');
})