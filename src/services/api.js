import { mockProducts } from '../data/mockProducts'
import { mockSettings } from '../data/mockSettings'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProducts() {
  await delay()
  return mockProducts
}

export async function getProductById(id) {
  await delay()
  const product = mockProducts.find((p) => p.id === id)
  if (!product) throw new Error('Product not found')
  return product
}

export async function getSettings() {
  await delay()
  return mockSettings
}

// مؤقت: رقم الأوردر هيرجع من الـ Backend بعدين
export async function createOrder(order) {
  await delay(500)
  return {
    ...order,
    id: `ORD-${Date.now()}`,
    status: 'Pending',
    date: new Date().toISOString(),
  }
}

export async function sendContactMessage(msg) {
  await delay()
  console.log('Contact message (mock):', msg)
  return { success: true }
}

export async function subscribeNewsletter(email) {
  await delay()
  console.log('Newsletter subscription (mock):', email)
  return { success: true }
}



