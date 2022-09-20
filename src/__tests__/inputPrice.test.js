import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CreateGroupBuy from '../views/createGroupBuy';
import { MemoryRouter as Router } from 'react-router-dom';

describe("Input price", () => {
    const correctInputs = ["9", "9.9", "9.99", "9.0", "9.00", "9.90", "0", "0.9", "0.99", "0.90", "0.09", "90", "90.99"];
    
    for(let i = 0; i < correctInputs.length; ++i) {
        test("Input correct price " + correctInputs[i], async () => {
            render(<Router><CreateGroupBuy /></Router>);
            const buttonElement = screen.getByText('添加商品');
            act(() => { userEvent.click(buttonElement) });
            const inputElement = screen.getByPlaceholderText('请输入商品价格');
            act(() => { userEvent.type(inputElement, correctInputs[i]) });
            try {
                await screen.findByText("请输入正确的金额");
                expect(false).toBe(true);
            } catch(e) {
                expect(true).toBe(true);
            }
        })
    }

    const wrongInputs = ["9.", "9.999", "9.990", "9.000", "9.900", "-9", "-9.9", "-9.99", "?", "9.?"];
    for(let i = 0; i < wrongInputs.length; ++i) {
        test("Input wrong price " + wrongInputs[i], async () => {
            render(<Router><CreateGroupBuy /></Router>);
            const buttonElement = screen.getByText('添加商品');
            act(() => { userEvent.click(buttonElement) });
            const inputElement = screen.getByPlaceholderText('请输入商品价格');
            act(() => { userEvent.type(inputElement, wrongInputs[i]) });
            try {
                await screen.findByText("请输入正确的金额");
                expect(false).toBe(false);
            } catch(e) {
                expect(true).toBe(false);
            }
        })
    }
})