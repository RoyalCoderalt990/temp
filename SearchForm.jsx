import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../src/App.css";

const SearchForm = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);

  const handleFromCityChange = (e) => {
    setFromCity(e.target.value);
  };

  const handleToCityChange = (e) => {
    setToCity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post(
        "http://localhost:8080/bus/search",
        {
          from: fromCity,
          to: toCity,
        },
        config
      );
      setBuses(response.data);
      setLoading(true);
    } catch (error) {
      alert("Error fetching buses: " + error.message);
    }
  };

  return (
    <div>
      <div className="background"></div>
      <div className="content">
        <div className="image">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/052/073/386/small_2x/a-sleek-and-modern-bus-races-energetically-down-an-expansive-expressway-during-a-vibrant-sunset-symbolizing-the-concept-of-fastpaced-travel-and-capturing-the-dynamic-essence-of-urban-movement-photo.jpg"
            alt="Bus Image 1"
          />
          <img
            src="https://falcontourtravel.com/wp-content/uploads/2023/09/40-passenger-Charter-bus-710x350.jpg"
            alt="Bus Image 2"
          />
        </div>
        <h1 className="booking">Book your tickets smoothly!</h1>
        <form className="searchForm" onSubmit={handleSubmit}>
          <label>
            From:
            <input
              type="text"
              value={fromCity}
              onChange={handleFromCityChange}
            />
          </label>
          <label>
            To:
            <input type="text" value={toCity} onChange={handleToCityChange} />
          </label>
          <button type="submit">Search</button>
        </form>
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
                  <th>VIEW</th>
                </tr>
              </thead>
              <tbody
                style={{
                  textAlign: "center",
                }}
              >
                {buses.map((item, index) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.from}</td>
                    <td>{item.to}</td>
                    <td>
                      {/* Navigate to the seatbook page with the busId as a URL parameter */}
                      <Link to={`/seatbook/${item._id}`}>
                        <button>View</button>
                      </Link>
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

export default SearchForm;