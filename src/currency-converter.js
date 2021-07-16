import React, { useState } from 'react';
import './currency-converter.css';
import { Jumbotron, Button, Form, Col, Spinner, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import ListCurrency from './list-currency';
import axios from 'axios';

function CurrencyConverter() {

  const FIXER_URL = 'http://data.fixer.io/api/latest?access_key=eba7130a5b2d720ce43eb5fcddd47cc3';

  const [valueTo, setValueTo] = useState('1');
  const [currencyFrom, setCurrencyFrom] = useState('BRL');
  const [currencyTo, setCurrencyTo] = useState('USD');
  const [showSpinner, setShowSpinner] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [conversionResult, setConversionResult] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  function handleValueTo (event) {
    setValueTo(event.target.value.replace(/\D/g, ''));
  }

  function handleCurrencyFrom (event) {
    setCurrencyFrom(event.target.value);
  }

  function handleCurrencyTo (event) {
    setCurrencyTo(event.target.value);
  }

  function handleCloseModal (event) {
    setValueTo('1');
    setCurrencyFrom('BRL');
    setCurrencyTo('USD');
    setFormValidated(false);
    setShowModal(false);
  }

  function convert (event) {
    event.preventDefault();
    setFormValidated(true);
    if (event.currentTarget.checkValidity() === true) {
      setShowSpinner(true);
      axios.get(FIXER_URL)
        .then(res => {
          const price = getPrice(res.data);
          if (price) {
            setConversionResult(`${valueTo} ${currencyFrom} = ${price} ${currencyTo}`);
            setShowModal(true);
            setShowSpinner(false);
            setShowErrorMessage(false);
          } else {
            showError();
          }
        }).catch(err => showError());
    } 
  }

  function getPrice (priceDatas) {
    if (!priceDatas || priceDatas.success !== true ) {
      return false;
    }
    const priceFrom = priceDatas.rates[currencyFrom];
    const priceTo = priceDatas.rates[currencyTo];
    const price = (1 / priceFrom * priceTo) * valueTo;
    return price.toFixed(2);
  }

  function showError() {
    setShowErrorMessage(true);
    setShowSpinner(false  )
  }

  return (
    <div className="text-center">
      <h1>
        Currency Converter
      </h1>
      <Alert variant="danger" show={showErrorMessage}>
        ERROR geting convesion data! Please try again.
      </Alert>
      <Jumbotron className="form-style">
        <Form onSubmit={convert} noValidate validated={formValidated}>
          <Form.Row className="d-flex">
            <Col sm="3">
              <Form.Control 
                placeholder="0"
                value={valueTo}
                onChange={handleValueTo}
                required
              />
            </Col>
            <Col sm="3">
              <Form.Control as="select"
                value={currencyFrom}
                onChange={handleCurrencyFrom}
              >
                <ListCurrency />
              </Form.Control>
            </Col>
            <Col sm="1" className="text-center" style={{paddingTop: '5px'}}>
              <FontAwesomeIcon 
                icon={faAngleDoubleRight}
              />
            </Col>
            <Col sm="3">
              <Form.Control as="select"
                value={currencyTo}
                onChange={handleCurrencyTo}
              >
                <ListCurrency />
              </Form.Control>
            </Col>
            <Col sm="2">
              <Button 
                variant="success"
                type="submit"
                data-testid="btn-convert"
              >
                <span className={showSpinner ? null : 'hidden'}>
                  <Spinner animation="border" size="sm" />
                </span>
                <span className={showSpinner ? 'hidden' : null}>
                  Convert
                </span>
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <Modal show={showModal} onHide={handleCloseModal} data-testid="modal">
          <Modal.Header closeButton>
            <Modal.Title>Conversion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {conversionResult}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleCloseModal}>
              New conversion
            </Button>
          </Modal.Footer>
        </Modal>
      </Jumbotron>
    </div>
  );
}

export default CurrencyConverter;
