import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components
import axios from 'axios';
import { User } from './components/UploadDB';
import { GetUser, UpdateUser } from './components/UploadDB';

const Payment = ({ userId, amount }) => {
  console.log('Payment page has userId:', userId);
  const [cardHolder, setCardHolder] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [cvv, setCvv] = useState("");
  const [cash, setCash] = useState(0);
  const [username, setUsername] = useState(userId)

  // handle all the different fields
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
  const handleCashChange = (e) => {
    setCash(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    if(cvv.length === 3 && expirationDate.length === 5 &&  cardNumber.length ===19){
      //first get user -> then update & post
        GetUser({ userId })
        .then(user => {
          if (!user) {
            throw new Error('No user found');
          }
          //  update cash amount
          const updatedUser = user;
          user.cash += cash;
          console.log('User:', updatedUser.cash);
         // update user with new cash amount
          return UpdateUser({ 'oldUser': user.userName, 'newUser': updatedUser });
        })
        .then(updatedUserData => {
          console.log('User updated successfully:', updatedUserData);
          return updatedUserData;
        })
        .catch(error => {
          console.error('An error occurred:', error);
        });


      const response = axios.post('http://localhost:4000/api/update-user', cash);
      console.log(response);
      alert("Payment Successful!\n Thank you very much!")
      document.location.href = '/';
    }else{
      alert("Try again")
    }

  };

  // i just wanted to see the user's name
  GetUser({ userId })
        .then(user => {
          if (!user) {
            throw new Error('No user found');
          }
          setUsername(user.userName);
        })

  return (
    <div className="payment-form-container"> {/* You might want to add some custom styling */}
      <div className="payment-form-header">
        <h2>Payment Information</h2>
        <h3>Payment for userId: {username}</h3>
      </div>
      <div className="payment-form-body">
        {/* Payment form */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="cardHolder">
            <Form.Label>Cardholder Name</Form.Label>
            <Form.Control type="text" placeholder="Enter cardholder name" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <Form.Control type="text" placeholder="Enter card number" value={cardNumber} onChange={handleCardNumberChange} maxLength='19' required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="expirationDate">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control type="text" placeholder="MM/YY" value={expirationDate} onChange={handleExpirationDateChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cvv">
            <Form.Label>CVV</Form.Label>
            <Form.Control type="text" placeholder="Enter CVV" value={cvv} onChange={handleCVVChange} maxLength="3" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Payment Amount (min $1)</Form.Label>
            <Form.Control type="number" placeholder="Enter Payment Amount" value={cash} onChange={handleCashChange} required />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit Payment
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Payment;