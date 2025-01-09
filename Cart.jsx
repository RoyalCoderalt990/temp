import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(false);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    async function fetchCart() {
      let user = JSON.parse(localStorage.getItem("user"));
      let token = user.token;
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const seats = await axios.post(
          `http://localhost:8080/cart`,
          {
            userId: user._id,
          },
          config
        );
        setCart(seats.data);
        setLoading(true);
      } catch (error) {
        alert(error.message);
      }
    }
    fetchCart();
  }, [book]);

  async function bookSeat(id) {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user.token;
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.post(`http://localhost:8080/book/${id}`, { userId: user._id }, config);
      alert("Proceed to payment");
      navigate("/pay"); // Redirect to PayNow after booking
    } catch (error) {
      alert(error.message);
    }
  }

  async function cancelSeat(id) {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user.token;
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.delete(`http://localhost:8080/cart/${id}`, config);
      setBook(!book);
      alert("Ticket has been deleted from the cart");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <h1 className="Heading">Tickets in My Cart</h1>
      <div className="cart-background"></div>
      <div className="cart-content">
        <div className="cart-buttons">
          <Link to="/bookedticket">
            <button>Your Booked Tickets</button>
          </Link>
          <Link to="/seatbook">
            <button>Seats Available</button>
          </Link>
        </div>

        <h1 style={{ textAlign: "center", marginTop: "100px", fontSize: "40px" }}>BOOK YOUR TICKETS</h1>

        <div className="Table">
          {loading && (
            <table>
              <thead style={{ background: "blue", color: "white" }}>
                <tr>
                  <th>BUSNAME</th>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>SEAT NO</th>
                  <th>PRICE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td>{item.busId.name}</td>
                    <td>{item.busId.from}</td>
                    <td>{item.busId.to}</td>
                    <td>{item.seatNo}</td>
                    <td>{item.busId.price}</td>
                    <td>
                      <div className="action">
                        <button
                          className="book"
                          onClick={() => {
                            bookSeat(item._id);
                          }}
                        >
                          Book
                        </button>
                        <button
                          className="cancel"
                          onClick={() => {
                            cancelSeat(item._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;