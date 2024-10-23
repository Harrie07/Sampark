import React, { useEffect, useState } from 'react';

function AdminDashboard() {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/grievances');
      const data = await response.json();
      setGrievances(data);
    } catch (error) {
      console.error('Error fetching grievances:', error);
    }
  };

  const updateGrievanceStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/grievance/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchGrievances(); // Refresh grievances after update
    } catch (error) {
      console.error('Error updating grievance status:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Complaint Name</th>
            <th>User</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grievances.map(grievance => (
            <tr key={grievance._id}>
              <td>{grievance.complaintName}</td>
              <td>{grievance.user.username}</td>
              <td>{grievance.status}</td>
              <td>
                <select
                  value={grievance.status}
                  onChange={(e) => updateGrievanceStatus(grievance._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;

