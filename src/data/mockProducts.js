const img = '/images/products/placeholder.jpg'

export const mockProducts = [
  {
    id: 'P001', name: 'Example Pajama', category: 'pajamas',
    description: 'Mock description.', price: 800, salePrice: 650,
    images: [img], colors: ['Black', 'Pink'], sizes: ['S', 'M', 'L', 'XL'],
    material: 'Cotton', stock: 10,
    isNewArrival: true, isBestSeller: false, isOnSale: true,
  },
  {
    id: 'P002', name: 'Example Pajama Set', category: 'pajamas',
    description: 'Mock description.', price: 950, salePrice: null,
    images: [img], colors: ['White', 'Blue'], sizes: ['S', 'M', 'L'],
    material: 'Satin', stock: 5,
    isNewArrival: false, isBestSeller: true, isOnSale: false,
  },
  {
    id: 'P003', name: 'Example Abaya', category: 'abayas',
    description: 'Mock description.', price: 1500, salePrice: 1200,
    images: [img], colors: ['Black'], sizes: ['M', 'L', 'XL'],
    material: 'Crepe', stock: 8,
    isNewArrival: true, isBestSeller: true, isOnSale: true,
  },
  {
    id: 'P004', name: 'Example Abaya Open', category: 'abayas',
    description: 'Mock description.', price: 1700, salePrice: null,
    images: [img], colors: ['Black', 'Beige'], sizes: ['S', 'M', 'L'],
    material: 'Linen', stock: 0,
    isNewArrival: false, isBestSeller: false, isOnSale: false,
  },
  {
    id: 'P005', name: 'Example T-Shirt', category: 'casual-wear',
    description: 'Mock description.', price: 400, salePrice: null,
    images: [img], colors: ['White', 'Black', 'Green'], sizes: ['S', 'M', 'L', 'XL'],
    material: 'Cotton', stock: 20,
    isNewArrival: true, isBestSeller: false, isOnSale: false,
  },
  {
    id: 'P006', name: 'Example Hoodie', category: 'casual-wear',
    description: 'Mock description.', price: 900, salePrice: 700,
    images: [img], colors: ['Gray', 'Black'], sizes: ['M', 'L', 'XL'],
    material: 'Fleece', stock: 3,
    isNewArrival: false, isBestSeller: true, isOnSale: true,
  },
]