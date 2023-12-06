import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components

const PaymentModal = ({ showPayMentModal, setShowPayMentModal }) => {

  const [cardHolder, setCardHolder] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [cvv, setCvv] = useState("")

  const handleCardNumberChange = (e) =>{
    const value = e.target.value.replace(/[^0-9/]/g, '');
    const formattedInput = value.replace(/(\d{4})(\d{0,4})(\d{0,4})(\d{0,4}).*/, '$1 $2 $3 $4');
    setCardNumber(formattedInput)
  }

  const handleExpirationDateChange = (e) => {
    // Allow only numeric characters and "/"
    const value = e.target.value.replace(/[^0-9/]/g, '');
    // Format the input as MM/YY
    if (value.length <= 2) {
      setExpirationDate(value);
    } 
    else if (value.length <= 5) {
      const month = value.slice(0, 2);
      const year = value.slice(3);
      setExpirationDate(`${month}/${year}`);
    }
  };

  const handleCVVChange = (e) => {
    setCvv(e.target.value)
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    if(cvv.length === 3 && expirationDate.length === 5 &&  cardNumber.length ===19){
      alert("ok")
      setShowPayMentModal(false)
      // Handle form submission logic here
      // You may want to send payment information to a server for processing
    }else{
      alert("Try again")
    }

  };

  return (
    <Modal show={showPayMentModal} onHide={setShowPayMentModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Payment Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Payment form */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="cardHolder">
            <Form.Label>Cardholder Name</Form.Label>
            <Form.Control type="text" placeholder="Enter cardholder name" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <Form.Control type="text" placeholder="Enter card number" value ={cardNumber} onChange={handleCardNumberChange} maxLength='19' required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="expirationDate">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control type="text" placeholder="MM/YY" value={expirationDate} onChange={handleExpirationDateChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cvv">
            <Form.Label>CVV</Form.Label>
            <Form.Control type="text" placeholder="Enter CVV" value={cvv} onChange={handleCVVChange} maxLength="3" required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit Payment
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;