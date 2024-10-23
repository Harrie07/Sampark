import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LodgeGrievance.css';

function LodgeGrievance(props) {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [grievanceData, setGrievanceData] = useState({
    complaintName: '',
    description: '',
    category: '',
    attachments: [],
    location: ''
  });

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSendOtp = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }) // Ensure mobileNumber is correctly populated
      });
  
      if (response.ok) {
        console.log('OTP sent successfully');
        setIsOtpSent(true); // Set OTP as sent
      } else {
        console.error('Error sending OTP'); // Log error if response not OK
      }
    } catch (error) {
      console.error('Error sending OTP:', error); // Log any network or other errors
    }
  };
  

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp })
      });

      if (response.ok) {
        console.log('OTP verified successfully');
        setIsOtpVerified(true);
      } else {
        console.error('Incorrect OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const handleGrievanceChange = (event) => {
    const { name, value } = event.target;
    setGrievanceData({ ...grievanceData, [name]: value });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validAttachments = files.filter(file => file.size <= 200 * 1024); // 200KB limit
    setGrievanceData({ ...grievanceData, attachments: validAttachments });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGrievanceData({
            ...grievanceData,
            location: `${position.coords.latitude}, ${position.coords.longitude}`
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting grievance data:', grievanceData); // Prevent default form submission

    try {
      const response = await fetch('http://localhost:5000/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grievanceData), // Use the entire grievanceData state
      });

      if (!response.ok) {
        throw new Error('Failed to submit grievance');
      }

      const result = await response.json();
      console.log('Grievance submitted successfully:', result);
      // Resetting the form after submission
      setGrievanceData({
        complaintName: '',
        description: '',
        category: '',
        attachments: [],
        location: ''
      });
    } catch (error) {
      console.error('Error submitting grievance:', error);
    }
  };

  return (
    <div className="lodge-grievance-page">
      <header>
        <div className="hamburger-menu" onClick={() => navigate('/')}>
          ☰ {/* Hamburger icon */}
        </div>
        <div className="logo">
          <img src="logo.svg" alt="Sampark Logo" />
        </div>
      </header>

      <main>
        <div className="lodge-grievance-container">
          <h2 className="grievance-heading">Lodge Your Grievance</h2>

          {!isOtpVerified && (
            <div className="otp-verification">
              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number:</label>
                <input
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  required
                />
                <button onClick={handleSendOtp} disabled={isOtpSent}>
                  {isOtpSent ? 'OTP Sent' : 'Send OTP'}
                </button>
              </div>

              {isOtpSent && (
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP:</label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    required
                  />
                  <button onClick={handleVerifyOtp}>Verify OTP</button>
                </div>
              )}
            </div>
          )}

          {isOtpVerified && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="complaintName">Complaint Name:</label>
                <input
                  type="text"
                  id="complaintName"
                  name="complaintName"
                  value={grievanceData.complaintName}
                  onChange={handleGrievanceChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Grievance Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={grievanceData.description}
                  onChange={handleGrievanceChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={grievanceData.category}
                  onChange={handleGrievanceChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="potholes">Potholes</option>
                  <option value="traffic">Traffic</option>
                  {/* Add more categories */}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="attachments">Attachments (optional):</label>
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  multiple
                  onChange={handleFileChange}
                />
                <p className="file-size-limit">Maximum file size: 200KB</p>
              </div>

              <div className="form-group">
                <button type="button" onClick={getLocation}>
                  Get My Location
                </button>
                {grievanceData.location && <p>Location: {grievanceData.location}</p>}
              </div>

              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default LodgeGrievance;



