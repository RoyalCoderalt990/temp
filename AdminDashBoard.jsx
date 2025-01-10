import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [newBus, setNewBus] = useState({
    name: "",
    from: "",
    to: "",
    price: "",
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all buses
  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/admin/bus/all");
      setBuses(response.data);
    } catch (error) {
      alert("Failed to fetch buses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new bus
  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/admin/bus/create", newBus);
      alert("Bus created successfully!");
      setBuses([...buses, response.data]);
      setNewBus({ name: "", from: "", to: "", price: "" });
    } catch (error) {
      alert("Failed to add bus: " + error.message);
    }
  };

  // Fetch a bus's ticket details
  const fetchBusDetails = async (busId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/admin/bus/bookings/${busId}`);
      setSelectedBus(response.data);
      console.log(response.data)
    } catch (error) {
      alert("Failed to fetch bus details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset a bus (clear all bookings)
  const handleResetBus = async (busId) => {
    try {
      await axios.put(`http://localhost:8080/admin/bus/reset/${busId}`);
      alert("Bus reset successfully!");
      fetchBuses(); // Refresh the bus list
    } catch (error) {
      alert("Failed to reset bus: " + error.message);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Add New Bus */}
      <div className="add-bus-form">
        <h2>Create New Bus</h2>
        <form onSubmit={handleAddBus}>
          <input
            type="text"
            placeholder="Bus Name"
            value={newBus.name}
            onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="From"
            value={newBus.from}
            onChange={(e) => setNewBus({ ...newBus, from: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="To"
            value={newBus.to}
            onChange={(e) => setNewBus({ ...newBus, to: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newBus.price}
            onChange={(e) => setNewBus({ ...newBus, price: e.target.value })}
            required
          />
          <button type="submit">Add Bus</button>
        </form>
      </div>

      {/* Bus List */}
      <div className="bus-list">
        <h2>All Buses</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {buses.map((bus) => (
              <li key={bus._id}>
                <span>
                  <strong>{bus.name}</strong> - {bus.from} to {bus.to} (${bus.price})
                </span>
                <button onClick={() => fetchBusDetails(bus._id)}>View Details</button>
                <button onClick={() => handleResetBus(bus._id)}>Reset Bus</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Bus Details */}
      {selectedBus && (
        <div className="bus-details">
          <h2>Bus Details</h2>
          <p>
            <strong>Name:</strong> {selectedBus.businfo.name}
          </p>
          <p>
            <strong>From:</strong> {selectedBus.businfo.from}
          </p>
          <p>
            <strong>To:</strong> {selectedBus.businfo.to}
          </p>
          <p>
            <strong>Price:</strong> ${selectedBus.businfo.price}
          </p>

          <h3>Booked Seats</h3>
          <ul>
            {(selectedBus.bookings && selectedBus.bookings.length) > 0 ? (
              selectedBus.bookings.map((booking, index) => (
                <li key={index}>
                  <span>
                    Seat No: {booking.seatNo} - {booking.user.name} ({booking.user.email})
                  </span>
                </li>
              ))
            ) : (
              <p>No seats booked yet.</p>
            )}
          </ul>

          <h3>Seat Availability</h3>
          <div className="seat-availability">
            {Object.entries(selectedBus.businfo.seats).map(([seat, isAvailable]) => (
              <div key={seat} className="seat">
                <span>Seat {seat}</span>
                <span>{isAvailable ? "Booked" : "Available"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;