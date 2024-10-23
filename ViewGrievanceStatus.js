import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewGrievanceStatus.css';

function ViewGrievanceStatus(props) {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);  // State to track loading
  const [error, setError] = useState(null);  // State to track any errors

  // Toggle menu
  const toggleMenu = () => {
    props.setMenuOpen(!props.isMenuOpen);
    navigate('/'); // Navigate back to homepage when menu is toggled
  };
  useEffect(() => {
    const fetchGrievances = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/grievances');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch grievances: ${errorText}`);
            }
            const data = await response.json();
            setGrievances(data);  // Store the fetched grievances in the state
        } catch (error) {
            console.error('Error fetching grievances:', error.message);
        }
    };

    fetchGrievances();
}, []);  // Run this effect once when the component loads


  return (
    <div className="grievance-status-view">
      <header>
        <div className="hamburger-menu" onClick={toggleMenu}>
          ☰ {/* Hamburger icon */}
        </div>
        <div className="logo">
          <img src="logo.svg" alt="Sampark Logo" />
        </div>
      </header>

      <main>
        <div className="grievance-status-container">
          <h2 className="grievance-heading">View Your Grievance Status</h2>
          {loading && <p>Loading grievances...</p>} {/* Show loading message */}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Display error message */}

          {grievances.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Complaint Date</th>
                  <th>Complaint Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map((grievance, index) => (
                  <tr key={index}>
                    <td>{grievance.complaintDate || 'N/A'}</td> {/* Default to 'N/A' if field is missing */}
                    <td>{grievance.description || 'N/A'}</td>
                    <td>{grievance.status || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No grievances found.</p>
          )}
        </div>
      </main>

      <footer>
        <p>Copyright 2024 @Sampark</p>
      </footer>
    </div>
  );
}

export default ViewGrievanceStatus;


