import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PayNow = () => {
  const [name, setName] = useState("");
  const [cardNum, setNumber] = useState("");
  const [cvv, setCcv] = useState("");
  const navigate = useNavigate(); // For navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment is Done");
    navigate("/bookedticket"); // Redirect to BookedTickets page after payment
  };

  return (
    <div>
      <h1 className="Heading">Fill Payment Details</h1>
      <div className="payment-buttons">
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
      <h1 style={{ textAlign: "center", marginBottom: "50px", fontSize: "40px" }}>Enter Credit Card Details</h1>
      <div className="credit-card">
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/credit-card-3d-icon-download-in-png-blend-fbx-gltf-file-formats--atm-debit-payment-banking-money-pack-finance-icons-4755619.png"
          alt="credit-card"
        />
        <form onSubmit={handleSubmit} className="authForm">
          <label>
            Number on Card:
            <input
              type="password"
              value={cardNum}
              placeholder="Enter Card Number"
              onChange={(e) => {
                setNumber(e.target.value);
              }}
            />
          </label>
          <label>
            Name of Cardholder:
            <input
              type="text"
              value={name}
              placeholder="Enter Card Holder Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <label>
            CVV:
            <input
              type="password"
              value={cvv}
              placeholder="CVV"
              onChange={(e) => {
                setCcv(e.target.value);
              }}
            />
          </label>
          <button type="submit">Pay</button>
        </form>
      </div>
    </div>
  );
};

export default PayNow;