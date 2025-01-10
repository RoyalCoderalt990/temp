import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate ,Link} from 'react-router-dom';
const AllBookeTicket = () => {
  const [bookedTicket, setBookedTicket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [book,setBook]=useState(false)
  useEffect(() => {
    async function fetcBookedTicket() {
      let user = JSON.parse(localStorage.getItem("user"));
      let token = user.token;
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const tickets = await axios.post(
          `http://localhost:8080/book`,
          {
            userId: user._id,
          },
          config
        );
        setBookedTicket(tickets.data);
        setLoading(true);
        console.log(tickets.data);
      } catch (error) {
        alert(error.message);
      }
    }

    fetcBookedTicket();
  }, [book]);

  async function cancelTicket(id) {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user.token;
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const cancelTicket = await axios.delete(
        `http://localhost:8080/book/${id}`,
        config
      );
      if(book){
        setBook(false)
      }else{
        setBook(true)
      }
      alert("Ticket has been Cancelled");
    } catch (error) {
      alert(error.message);
    }
  }
  console.log(bookedTicket);
  return (
    <div>
      <h1 className="Heading">All Booked Tickets</h1>
      <div className="bookedTickets-background"></div>
      <div className="bookedTickets-content">
      <div className="bookedTickets-buttons">
      <Link to="/"><button>Home</button></Link>
      <Link to="/cart"><button>My cart</button></Link>
      {/* <Link to="/seatbook"><button>Seat Available</button></Link> */}
      </div>
      <h1 style={{textAlign: "center", marginTop: "100px", fontSize: "40px"}}>HURRAY! READY, SET, GO!</h1>
      <div className="Table">
        {loading && (
          <table>
            <thead
              style={{
                background: "blue",
                color: "white",
              }}
            >
              <tr>
                <th>BUSNAME</th>
                <th>FROM</th>
                <th>TO</th>
                <th>SEAT NO</th>
                <th>PRICE</th>
                <th>AVAILABLE SEATS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody
              style={{
                textAlign: "center",
              }}
            >
              {bookedTicket.map((item) => {
                  const totalSeats = 20; // Assuming each bus has 20 seats; replace with dynamic data if available
                  const bookedSeats = Object.keys(item.busId.seats || {}).filter(
                    (seat) => item.busId.seats[seat]
                  ).length;
                  const availableSeats = totalSeats - bookedSeats;

                  return (
                    <tr key={item._id}>
                      <td>{item.busId.name}</td>
                      <td>{item.busId.from}</td>
                      <td>{item.busId.to}</td>
                      <td>{item.seatNo}</td>
                      <td>{item.busId.price}</td>
                      <td>
                        {availableSeats}
                        <br />
                        <Link to={`/seatbook/${item.busId._id}`}>
                          <button>View</button>
                        </Link>
                      </td>
                      <td>
                    <div className="action">
                    
                      <button
                        className="cancel"
                        onClick={() => {
                          cancelTicket(item._id);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </div>
  );
};

export default AllBookeTicket;