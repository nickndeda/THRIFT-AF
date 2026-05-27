import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const getProducts = async () => {
  return axios.get(`${API_BASE}/api/products`)
}

export default { getProducts }