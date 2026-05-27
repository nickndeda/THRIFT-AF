import axios from 'axios'
import { products as staticProducts } from '../data/products'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

const transformLocalProducts = (items) => {
  return items.map((product) => ({
    ...product,
    image: `/${encodeURIComponent(product.image)}`
  }))
}

export const getProducts = async () => {
  try {
    return await axios.get(`${API_BASE}/api/products`)
  } catch (error) {
    console.error('Product API fetch failed, using local fallback:', error)
    return { data: transformLocalProducts(staticProducts) }
  }
}

export default { getProducts }