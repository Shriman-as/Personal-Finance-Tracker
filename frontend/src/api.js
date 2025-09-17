import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

export const addTransaction = (payload) => axios.post(`${API_BASE}/transactions/`, payload);
export const listTransactions = () => axios.get(`${API_BASE}/transactions/`);
export const deleteTransaction = (id) => axios.delete(`${API_BASE}/transactions/${id}`);
export const reclassifyTransaction = (id, category) => axios.patch(`${API_BASE}/transactions/${id}/reclassify`, { category });
export const getSummary = () => axios.get(`${API_BASE}/transactions/summary`);
