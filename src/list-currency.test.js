import React from 'react';
import ReactDOM from 'react-dom';
import ListCurrency from './list-currency';

describe('Currency listing component test', () => {

    it('must render the componet without errors', () => {
        const div = document.createElement('div');
        ReactDOM.render(<ListCurrency />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});