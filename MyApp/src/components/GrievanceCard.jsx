import React from 'react';

const GrievanceCard = ({ grievance, onEdit, onDelete }) => {
  const formattedDate = new Date(grievance.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const statusClass = grievance.status === 'Resolved' ? 'status-badge resolved' : 'status-badge pending';

  return (
    <div className="grievance-card animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
            {grievance.title}
          </h3>
          <p className="card-meta">
            ID: <code>{grievance._id}</code> &nbsp;·&nbsp; {grievance.category} &nbsp;·&nbsp; {formattedDate}
          </p>
        </div>
        <span className={statusClass}>{grievance.status}</span>
      </div>

      <p className="description">{grievance.description}</p>

      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(grievance)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(grievance._id)}>Delete</button>
      </div>
    </div>
  );
};

export default GrievanceCard;
