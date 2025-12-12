// src/pages/Companies.jsx
import React, { useEffect, useState } from 'react';
import api from '../api'; // adjust path if different, e.g. '../api/index'

export default function Companies() {
  const [companies, setCompanies] = useState([]); // safe default - never undefined
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the api instance so baseURL + token are handled
        const res = await api.get('/companies?page=1&limit=8');
        // determine the payload shape safely
        const payload = res?.data ?? {};
        // common shapes: { companies: [...] } or { data: [...] } or just [...]
        let items = [];
        if (Array.isArray(payload)) items = payload;
        else if (Array.isArray(payload.companies)) items = payload.companies;
        else if (Array.isArray(payload.data)) items = payload.data;
        else if (Array.isArray(payload.items)) items = payload.items;
        else if (payload.success && Array.isArray(payload.result)) items = payload.result;
        else if (payload.results && Array.isArray(payload.results)) items = payload.results;
        else if (payload.companies === undefined && payload.data === undefined) {
          // fallback: maybe the server returns object with pagination
          // attempt to find first array inside payload
          const foundArray = Object.values(payload).find(v => Array.isArray(v));
          items = foundArray || [];
        }

        if (mounted) setCompanies(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error('Error fetching companies', err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCompanies();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading companies…</div>;
  if (error) return <div className="p-6 text-red-600">Error loading companies: {error?.message ?? 'Unknown error'}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Companies</h1>

      { (companies || []).length === 0 ? (
        <div className="rounded p-6 shadow bg-white">No companies found.</div>
      ) : (
        <div className="grid gap-4">
          {companies.map(c => (
            <div key={c.id ?? c.company_name} className="p-4 bg-white rounded shadow">
              <div className="font-medium">{c.company_name ?? c.name}</div>
              <div className="text-sm text-gray-500">{c.city ?? c.address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
