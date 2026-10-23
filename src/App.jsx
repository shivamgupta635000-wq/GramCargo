import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Save shipments in browser
  const [shipments, setShipments] = useState(() => {
    try {
      const saved = localStorage.getItem("gramcargo_shipments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "gramcargo_shipments",
        JSON.stringify(shipments)
      );
    } catch (error) {
      console.error("Could not save shipments:", error);
    }
  }, [shipments]);

  // Shipment form states
  const [product, setProduct] = useState("");
  const [weight, setWeight] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");

  // Vehicle states
  const [vehicleType, setVehicleType] = useState("1000");
  const [customCapacity, setCustomCapacity] = useState("");

  // Transport calculator states
  const [distance, setDistance] = useState("");
  const [costPerKm, setCostPerKm] = useState("25");
  const [individualCost, setIndividualCost] = useState("1200");

  // Add shipment
  function addShipment(e) {
    e.preventDefault();

    const newShipment = {
      id: Date.now(),
      product: product.trim(),
      weight: Number(weight),
      pickup: pickup.trim(),
      destination: destination.trim(),
    };

    setShipments((previous) => [...previous, newShipment]);

    setProduct("");
    setWeight("");
    setPickup("");
    setDestination("");
    setMessage("Shipment successfully added!");
  }

  // Remove shipment
  function removeShipment(id) {
    setShipments((previous) =>
      previous.filter((shipment) => shipment.id !== id)
    );
    setMessage("Shipment removed successfully!");
  }

  // Vehicle capacity
  const selectedCapacity =
    vehicleType === "custom"
      ? Number(customCapacity)
      : Number(vehicleType);

  const validCapacity =
    Number.isFinite(selectedCapacity) && selectedCapacity > 0;

  // Group shipments with matching pickup and destination
  const groupedShipments = Object.values(
    shipments.reduce((groups, shipment) => {
      const routeKey =
        `${shipment.pickup.trim().toLowerCase()}::${shipment.destination
          .trim()
          .toLowerCase()}`;

      if (!groups[routeKey]) {
        groups[routeKey] = {
          pickup: shipment.pickup.trim(),
          destination: shipment.destination.trim(),
          shipments: [],
          totalWeight: 0,
        };
      }

      groups[routeKey].shipments.push(shipment);
      groups[routeKey].totalWeight += Number(shipment.weight);

      return groups;
    }, {})
  );

  // Transport cost calculation
  const validDistance =
    distance.trim() !== "" &&
    Number.isFinite(Number(distance)) &&
    Number(distance) > 0;

  const validCost =
    costPerKm.trim() !== "" &&
    Number.isFinite(Number(costPerKm)) &&
    Number(costPerKm) >= 0;

  const transportCost =
    validDistance && validCost
      ? Number(distance) * Number(costPerKm)
      : null;

  // Shared transport savings estimate
  const validIndividualCost =
    individualCost.trim() !== "" &&
    Number.isFinite(Number(individualCost)) &&
    Number(individualCost) >= 0;

  const validSavingsInputs =
    shipments.length > 0 &&
    transportCost !== null &&
    validIndividualCost;

  const individualTotal =
    validSavingsInputs
      ? Number(individualCost) * shipments.length
      : null;

  const estimatedSavings =
    validSavingsInputs
      ? individualTotal - transportCost
      : null;

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <a href="#home" className="logo">
          <span className="logo-icon">G</span>
          GramCargo
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#planner">Planner</a>
          <a href="#savings">Savings</a>
          <a href="#about">About Us</a>
        </div>

        <a href="#planner" className="nav-button">
          Get Started →
        </a>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="live-dot"></span>
              SMART RURAL LOGISTICS
            </div>

            <h1>
              Connecting Rural India,
              <span> One Smart Route at a Time.</span>
            </h1>

            <p className="hero-description">
              Helping rural entrepreneurs and farmers plan smarter
              deliveries, group shipments and estimate transportation costs.
            </p>

            <div className="hero-actions">
              <a href="#planner" className="primary-button">
                Start Planning →
              </a>

              <a href="#features" className="secondary-button">
                Explore Features
              </a>
            </div>

            <div className="trust-note">
              <span>✓</span>
              Built for rural communities and local businesses
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-header">
                <div>
                  <span className="small-label">
                    YOUR LOGISTICS OVERVIEW
                  </span>
                  <h3>Smart Delivery Plan</h3>
                </div>

                <span className="status-pill">● Demo</span>
              </div>

              <div className="route-map">
                <div className="route-line"></div>

                <div className="route-point point-one">
                  <span>1</span>
                </div>

                <div className="route-point point-two">
                  <span>2</span>
                </div>

                <div className="route-point point-three">
                  <span>3</span>
                </div>

                <div className="map-label label-one">Village</div>
                <div className="map-label label-two">Hub</div>
                <div className="map-label label-three">Market</div>

                <div className="truck-icon">🚚</div>
                <div className="field-icon field-one">🌾</div>
                <div className="field-icon field-two">🌳</div>
              </div>

              <div className="route-summary">
                <div>
                  <span className="summary-icon">📍</span>
                  <div>
                    <strong>Smart Route</strong>
                    <small>Village → Hub → Market</small>
                  </div>
                </div>

                <span className="route-arrow">↗</span>
              </div>

              <div className="visual-footer">
                <span>Designed for smarter deliveries</span>
                <span>GramCargo</span>
              </div>
            </div>

            <div className="floating-note">
              <span className="floating-icon">📦</span>
              <div>
                <strong>Load Grouping</strong>
                <small>Plan compatible shipments together</small>
              </div>
            </div>
          </div>
        </section>
        {/* FEATURES SECTION */}
        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-tag">WHAT WE DO</span>
            <h2>Logistics made simpler.</h2>
            <p>
              Practical tools to help rural businesses move goods smarter.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon green">📦</div>
              <h3>Smart Load Grouping</h3>
              <p>
                Group shipments travelling along the same route and
                check vehicle capacity.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon blue">🚚</div>
              <h3>Vehicle Planning</h3>
              <p>
                Compare shipment weight with vehicle capacity before
                planning a trip.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon orange">₹</div>
              <h3>Cost Estimation</h3>
              <p>
                Estimate transport costs and compare them with
                individual shipment expenses.
              </p>
            </article>
          </div>
        </section>

        {/* SHIPMENT PLANNER */}
        <section className="planner-section" id="planner">
          <div className="planner-intro">
            <span className="section-tag">SHIPMENT PLANNER</span>
            <h2>Plan your next delivery.</h2>
            <p>
              Enter shipment details to create your delivery list.
              Add multiple shipments and review them below.
            </p>
          </div>

          <form className="shipment-form" onSubmit={addShipment}>
            <label>
              Product name
              <input
                type="text"
                placeholder="e.g. Wheat, Rice, Vegetables"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              />
            </label>

            <label>
              Weight (kg)
              <input
                type="number"
                placeholder="e.g. 250"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </label>

            <label>
              Pickup village
              <input
                type="text"
                placeholder="Enter pickup village"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
              />
            </label>

            <label>
              Destination
              <input
                type="text"
                placeholder="Enter destination market"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </label>

            <button className="primary-button" type="submit">
              + Add Shipment
            </button>

            {message && (
              <p className="success-message" role="status">
                {message}
              </p>
            )}
          </form>

          {/* SHIPMENT LIST */}
          <div className="shipment-list">
            <div className="shipment-list-heading">
              <h3>Your Shipments</h3>
              <span>{shipments.length} total</span>
            </div>

            {shipments.length === 0 ? (
              <p className="empty-message">
                No shipments yet. Add your first shipment above.
              </p>
            ) : (
              shipments.map((shipment) => (
                <article
                  className="shipment-item"
                  key={shipment.id}
                >
                  <div className="shipment-product">
                    <span className="shipment-icon">📦</span>

                    <div>
                      <strong>{shipment.product}</strong>
                      <p>{shipment.weight} kg</p>
                    </div>
                  </div>

                  <div className="shipment-route">
                    <span>{shipment.pickup}</span>
                    <span className="route-separator">→</span>
                    <span>{shipment.destination}</span>
                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeShipment(shipment.id)}
                  >
                    Remove
                  </button>
                </article>
              ))
            )}
          </div>

          {/* SMART LOAD GROUPING */}
          <div className="smart-grouping">
            <div className="smart-heading">
              <span className="section-tag">SMART LOAD GROUPING</span>
              <h3>Find the best shared trip</h3>
              <p>
                Choose a vehicle capacity to check which shipments
                on the same route can travel together.
              </p>
            </div>

            <div className="vehicle-controls">
              <label>
                Select vehicle capacity
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="500">Mini vehicle — 500 kg</option>
                  <option value="1000">Medium vehicle — 1,000 kg</option>
                  <option value="2000">Large vehicle — 2,000 kg</option>
                  <option value="custom">Custom capacity</option>
                </select>
              </label>

              {vehicleType === "custom" && (
                <label>
                  Custom capacity (kg)
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Enter capacity in kg"
                    value={customCapacity}
                    onChange={(e) => setCustomCapacity(e.target.value)}
                  />
                </label>
              )}
            </div>

            {vehicleType === "custom" && !validCapacity && (
              <p className="capacity-warning">
                Please enter a valid capacity greater than zero.
              </p>
            )}

            <div className="group-results">
              <h4>Suggested shipment groups</h4>

              {groupedShipments.length === 0 ? (
                <p className="empty-message">
                  Add shipments above to see grouping suggestions.
                </p>
              ) : (
                groupedShipments.map((group, index) => {
                  const fits =
                    validCapacity &&
                    group.totalWeight <= selectedCapacity;

                  return (
                    <article
                      className="group-card"
                      key={`${group.pickup}-${group.destination}`}
                    >
                      <div className="group-card-header">
                        <div>
                          <span className="group-number">
                            ROUTE {index + 1}
                          </span>

                          <h4>
                            {group.pickup} → {group.destination}
                          </h4>
                        </div>

                        {validCapacity && (
                          <span
                            className={`capacity-status ${
                              fits ? "fits" : "overload"
                            }`}
                          >
                            {fits
                              ? "Within capacity"
                              : "Capacity exceeded"}
                          </span>
                        )}
                      </div>

                      <div className="group-stats">
                        <div>
                          <span>Shipments</span>
                          <strong>{group.shipments.length}</strong>
                        </div>

                        <div>
                          <span>Total load</span>
                          <strong>
                            {Number(group.totalWeight.toFixed(2))} kg
                          </strong>
                        </div>

                        <div>
                          <span>Vehicle capacity</span>
                          <strong>
                            {validCapacity
                              ? `${selectedCapacity} kg`
                              : "Not set"}
                          </strong>
                        </div>
                      </div>

                      <div className="group-products">
                        {group.shipments.map((item) => (
                          <div
                            className="group-product"
                            key={item.id}
                          >
                            <span>📦 {item.product}</span>
                            <span>{item.weight} kg</span>
                          </div>
                        ))}
                      </div>

                      {!validCapacity ? (
                        <p className="capacity-warning">
                          Enter a valid vehicle capacity to check this group.
                        </p>
                      ) : fits ? (
                        <p className="capacity-success">
                          This route's total load fits within the
                          selected vehicle's capacity.
                        </p>
                      ) : (
                        <p className="capacity-warning">
                          This load exceeds vehicle capacity. Use a larger
                          vehicle or plan multiple trips.
                        </p>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
        {/* TRANSPORT COST CALCULATOR */}
        <section className="cost-section" id="cost-calculator">
          <div className="cost-container">
            <span className="section-tag">TRANSPORT ESTIMATOR</span>

            <h2>Calculate Your Transport Cost</h2>

            <p>
              Estimate the one-way cost of transporting your shipments.
            </p>

            <div className="cost-form">
              <label>
                Distance (in kilometres)
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="Enter distance, e.g. 40"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </label>

              <label>
                Vehicle cost per kilometre (₹)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter cost per km"
                  value={costPerKm}
                  onChange={(e) => setCostPerKm(e.target.value)}
                />
              </label>
            </div>

            <div className="cost-result">
              <span>Estimated one-way transport cost</span>

              <h3>
                {transportCost !== null
                  ? `₹${transportCost.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}`
                  : "Enter distance and cost"}
              </h3>

              <p>
                Estimate only. Actual charges may vary by vehicle,
                fuel, loading, unloading and other expenses.
              </p>
            </div>
          </div>
        </section>

        {/* SHARED TRANSPORT SAVINGS */}
        <section className="savings-section" id="savings">
          <div className="savings-container">
            <span className="section-tag">SAVE MORE TOGETHER</span>

            <h2>Shared Transport Savings</h2>

            <p>
              Compare the estimated cost of individual transport
              with the cost of sharing one trip.
            </p>

            <div className="savings-input">
              <label>
                Individual transport cost per shipment (₹)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter individual cost"
                  value={individualCost}
                  onChange={(e) => setIndividualCost(e.target.value)}
                />
              </label>
            </div>

            <div className="savings-results">
              <div className="savings-stat">
                <span>Shipments counted</span>
                <strong>{shipments.length}</strong>
              </div>

              <div className="savings-stat">
                <span>Individual total cost</span>
                <strong>
                  {individualTotal !== null
                    ? `₹${individualTotal.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}`
                    : "—"}
                </strong>
              </div>

              <div className="savings-stat">
                <span>Shared trip estimate</span>
                <strong>
                  {transportCost !== null
                    ? `₹${transportCost.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}`
                    : "—"}
                </strong>
              </div>

              <div className="savings-highlight">
                <span>
                  {estimatedSavings !== null && estimatedSavings >= 0
                    ? "Potential total savings"
                    : "Estimated cost difference"}
                </span>

                <h3>
                  {estimatedSavings !== null
                    ? `${estimatedSavings < 0 ? "−" : ""}₹${Math.abs(
                        estimatedSavings
                      ).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}`
                    : "Add shipments and route details"}
                </h3>

                <p>
                  This is a basic estimate, not a guaranteed saving.
                  It assumes one shared trip can carry all shipments.
                  Check route compatibility, vehicle capacity and actual
                  transport charges before making a booking.
                </p>

                {estimatedSavings !== null &&
                  estimatedSavings < 0 && (
                    <p className="capacity-warning">
                      The estimated shared trip costs more than the
                      combined individual costs.
                    </p>
                  )}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="about">
          <span className="section-tag">OUR MISSION</span>

          <h2>Better logistics. Stronger rural communities.</h2>

          <p>
            GramCargo aims to make rural transportation more organized,
            accessible and cost-conscious for farmers and entrepreneurs.
            By planning compatible shipments together, communities can
            explore better ways to transport their goods.
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <a href="#home" className="logo footer-logo">
          <span className="logo-icon">G</span>
          GramCargo
        </a>

        <p>Smarter logistics for a stronger rural India.</p>

        <span>© 2026 GramCargo · Idea Lab Project</span>
      </footer>
    </div>
  );
}

export default App;