import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import NewArrivals from './pages/NewArrivals'
import Sale from './pages/Sale'
import ProductDetails from './pages/ProductDetails'
import SearchResults from './pages/SearchResults'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import ShippingReturns from './pages/ShippingReturns'

function App() {
  return (
    <>
      {/* TODO: <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
      </Routes>
      {/* TODO: <Footer /> و <ChatbotButton /> */}
    </>
  )
}

export default App