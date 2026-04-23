import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import GrievanceForm from '../components/GrievanceForm';
import GrievanceCard from '../components/GrievanceCard';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [editingGrievance, setEditingGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGrievances = async (searchQuery = '', type = 'title') => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/grievances';

      if (searchQuery) {
        if (type === 'id') {
          if (searchQuery.length === 24 && /^[0-9a-fA-F]{24}$/.test(searchQuery)) {
            url = `http://localhost:5000/api/grievances/${searchQuery}`;
          } else {
            setGrievances([]);
            setLoading(false);
            return;
          }
        } else {
          url = `http://localhost:5000/api/grievances/search?title=${searchQuery}`;
        }
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGrievances(searchQuery && type === 'id' ? [res.data] : res.data);
    } catch (error) {
      if (error.response?.status === 404) setGrievances([]);
      else console.error('Failed to fetch grievances', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGrievances(); }, [token]);

  const handleSearch = (e) => { e.preventDefault(); fetchGrievances(search, searchType); };
  const handleClearSearch = () => { setSearch(''); fetchGrievances('', searchType); };
  const openAddModal = () => { setEditingGrievance(null); setIsModalOpen(true); };
  const openEditModal = (g) => { setEditingGrievance(g); setIsModalOpen(true); };
  const closeModal = () => { setEditingGrievance(null); setIsModalOpen(false); };

  const handleSubmit = async (data) => {
    try {
      if (editingGrievance) {
        await axios.put(`http://localhost:5000/api/grievances/${editingGrievance._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/grievances', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchGrievances();
    } catch (error) {
      console.error('Failed to save grievance', error);
      alert('Error saving grievance. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await axios.delete(`http://localhost:5000/api/grievances/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchGrievances();
      } catch (error) {
        console.error('Failed to delete grievance', error);
      }
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <GrievanceForm
              onSubmit={handleSubmit}
              initialData={editingGrievance}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      <div className="animate-fade-in">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Student Grievance Portal</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Welcome back, <strong>{user?.name}</strong>
            </p>
          </div>
          <button
            onClick={logout}
            style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1.5px solid #fecaca' }}
          >
            Logout
          </button>
        </header>

        {/* Main Content - two-column on wide screen */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* Left sidebar: Stats summary */}
          <aside>
            <div className="panel" style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Summary
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{grievances.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pending</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#92400e' }}>
                    {grievances.filter(g => g.status === 'Pending').length}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Resolved</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#065f46' }}>
                    {grievances.filter(g => g.status === 'Resolved').length}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right main: search + list */}
          <main>
            {/* Search Bar */}
            <div className="search-bar">
              <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '0.625rem' }}>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="title">By Title</option>
                  <option value="id">By ID</option>
                </select>
                <input
                  type="text"
                  placeholder={searchType === 'id' ? 'Paste 24-char ObjectId…' : 'Search by title…'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>
              {search && (
                <button className="btn-secondary" onClick={handleClearSearch}>
                  Clear
                </button>
              )}
            </div>

            {/* Grievances list */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Grievances
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{grievances.length} record{grievances.length !== 1 ? 's' : ''}</span>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>Loading…</p>
            ) : grievances.length === 0 ? (
              <div className="empty-state">
                <p>No grievances found. Click <strong>+</strong> to submit one.</p>
              </div>
            ) : (
              grievances.map(g => (
                <GrievanceCard key={g._id} grievance={g} onEdit={openEditModal} onDelete={handleDelete} />
              ))
            )}
          </main>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fab-button" onClick={openAddModal} title="Submit new grievance">
        +
      </button>
    </>
  );
};

export default Dashboard;
