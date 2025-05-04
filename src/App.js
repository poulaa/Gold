import React, { useEffect, useState } from 'react';
import './App.css'; 

function App() {
  const [goldPrice, setGoldPrice] = useState(null);
  const [silverPrice, setSilverPrice] = useState(null);
  const [prevGoldPrice, setPrevGoldPrice] = useState(null);
  const [prevSilverPrice, setPrevSilverPrice] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [grams, setGrams] = useState("");
  const [convertedGold, setConvertedGold] = useState(null);
  const [convertedSilver, setConvertedSilver] = useState(null);

  const API_KEY = "goldapi-2uu4e4isma9sd8il-io";

  const fetchPrices = async () => {
    try {
      const headers = {
        "x-access-token": API_KEY,
        "Content-Type": "application/json",
      };

      const goldRes = await fetch(`https://www.goldapi.io/api/XAU/${currency}`, { headers });
      const goldData = await goldRes.json();

      const silverRes = await fetch(`https://www.goldapi.io/api/XAG/${currency}`, { headers });
      const silverData = await silverRes.json();

      setPrevGoldPrice(goldPrice);
      setPrevSilverPrice(silverPrice);
      setGoldPrice(goldData.price);
      setSilverPrice(silverData.price);
    } catch (err) {
      console.error("Error fetching prices:", err);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [currency]);

  const handleConvert = () => {
    if (!grams || isNaN(grams)) return;
    const gramsToOunces = grams / 31.1035;
    setConvertedGold((goldPrice * gramsToOunces).toFixed(2));
    setConvertedSilver((silverPrice * gramsToOunces).toFixed(2));
  };

  const getArrow = (current, previous) => {
    if (previous == null) return "";
    if (current > previous) return "⬆️";
    if (current < previous) return "⬇️";
    return "➡️";
  };

  return (
    <div className="container my-5">
      <div className="bg-white rounded shadow p-4 p-md-5">
        <h1 className="display-5 fw-bold text-gold mb-4">Poula’s Live Gold & Silver Tracker</h1>

        {/* Currency Dropdown */}
        <div className="mb-4">
          <label htmlFor="currency" className="form-label fw-semibold">Currency</label>
          <select
            id="currency"
            className="form-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="EGP">EGP</option>
          </select>
        </div>

        {/* Prices */}
        <h4 className="mb-3">Current Prices</h4>
        <p>
          <strong>Gold ({currency}):</strong>{" "}
          {goldPrice ? `${goldPrice} ${getArrow(goldPrice, prevGoldPrice)}` : "Loading..."}
        </p>
        <p>
          <strong>Silver ({currency}):</strong>{" "}
          {silverPrice ? `${silverPrice} ${getArrow(silverPrice, prevSilverPrice)}` : "Loading..."}
        </p>

        {/* Conversion */}
        <h4 className="mt-4 mb-3">Convert Grams to {currency}</h4>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Enter grams"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
          <button className="btn btn-gold" onClick={handleConvert}>
            Convert
          </button>
        </div>

        {convertedGold && (
  <div className="mt-3">
    <div className="border-gold bg-light rounded p-3 shadow-sm">
      <p><strong>{grams}g Gold</strong> ≈ {convertedGold} {currency}</p>
      <p><strong>{grams}g Silver</strong> ≈ {convertedSilver} {currency}</p>
    </div>
  </div>
)}

      </div>

      <footer className="text-center mt-4 text-muted small">
        &copy; Crafted by Poula.
      </footer>
    </div>
  );
}

export default App;
