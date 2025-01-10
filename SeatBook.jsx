import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../../src/App.css";
import "../../src/components/style.css";

const SeatBook = () => {
  const { busId } = useParams(); // Extract busId from URL
  const [seatsofbus, setSeatsofBus] = useState([]);
  const [chooseSeat, setChooseSeat] = useState();
  const [fromTo, setFromTo] = useState("");
  const [availableSeatsCount, setAvailableSeatsCount] = useState(0);
  const [cartSeats, setCartSeats] = useState([]);

  useEffect(() => {
    async function fetchSeats() {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      try {
        // Fetch seats using busId from the URL
        console.log("Bus ID from URL:", busId); // Log the busId for debugging
        const seats = await axios.get(
          `http://localhost:8080/bus/search/${busId}`,
          config
        );

        let ob = seats.data.seats; // Seats object fetched from the server
        let arr = [];
        let availableCount = 0;

        for (let x in ob) {
          let object = {};
          object["number"] = x; // Seat number
          object[`${x}`] = ob[x]; // Seat status (true/false)
          arr.push(object);
          if (!ob[x]) {
            availableCount++; // Increment available seats count
          }
        }

        setSeatsofBus(arr); // Update state with seats array
        setAvailableSeatsCount(availableCount); // Update available seats count
        setFromTo(`${seats.data.from} to ${seats.data.to}`); // Set route details (from-to)
      } catch (error) {
        alert(error.message); // Show error message in case of a failure
      }
    }

    fetchSeats();
  }, [busId, chooseSeat]); // Re-fetch seats whenever busId or chooseSeat changes

  // Function to add a seat to the cart
  const addToCart = async (sno) => {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user?.token;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Check if the seat is already booked
    const seat = seatsofbus.find((seat) => seat.number === sno);
    if (seat && seat[`${sno}`]) {
      alert("This seat is already booked!");
      return;
    }

    // Check if the seat is already in the cart
    if (cartSeats.includes(sno)) {
      alert("This seat is already added to your cart!");
      return;
    }

    try {
      const cart = await axios.post(
        "http://localhost:8080/cart/add",
        {
          userId: user._id,
          busId: busId, // Use busId from URL
          seatNo: sno,
        },
        config
      );
      setCartSeats((prev) => [...prev, sno]); // Add seat to cart
      alert("Ticket is added to cart!");
    } catch (error) {
      alert(error.message); // Show error in case of failure
    }
  };

  return (
    <div>
      <div className="background-seatbook"></div>
      <div className="content-seatbook">
        <h1 className="Heading">
          <span className="movingText">
            Beyond luxury, into the extraordinary!
          </span>
        </h1>
        <div className="top-section">
          <h1 className="available">
            {availableSeatsCount} SEATS AVAILABLE from {fromTo}!
          </h1>
          <Link to="/cart">
            <button>My Cart</button>
          </Link>
        </div>

        <div className="sections">
          <div className="image-bus">
            <img
              src="https://img.freepik.com/premium-photo/moving-forward-bus-travels-road-embracing-travel-time-ambiance-vertical-mobile-wallpaper_896558-10503.jpg?w=360"
              alt="Bus"
            />
          </div>

          <div className="seatcontainer">
            {seatsofbus.map((element, index) => (
              <div key={index + 1}>
                <div className="button-class">
                  <button className="seatNo">Seat No: {index + 1}</button>
                  <button
                    type="button"
                    onClick={() => {
                      setChooseSeat(element.number);
                      addToCart(element.number);
                    }}
                  >
                    {element[`${index + 1}`] ? (
                      <p
                        style={{
                          background: "red",
                          color: "white",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        Booked
                      </p>
                    ) : (
                      <p style={{ color: "green" }}>Available</p>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBook;