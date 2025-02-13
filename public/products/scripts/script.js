let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchProduct');
  const categoryFilter = document.getElementById('categoryFilter');
  const productList = document.getElementById('product-list');

  // Fetch products function
  async function fetchProducts() {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        window.location.href = '../index.html';
        return;
      }

      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.data) {
        allProducts = data.data;
        filterProducts();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Filter products function
  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;

    const filteredProducts = allProducts.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);
      
      const matchesCategory = 
        categoryValue === 'all' || 
        product.category.toLowerCase() === categoryValue.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    document.getElementById('total-products-count').textContent = filteredProducts.length;
    displayProducts(filteredProducts);
  }

  // Display products function
  function displayProducts(products) {
    productList.innerHTML = products.map(product => `
      <tr class="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
        <td class="py-4 px-4">
          <img src="http://localhost:3000/uploads/${product.image}" alt="${product.name}" class="product-image">
        </td>
        <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.name}</td>
        <td class="py-4 px-4 description text-gray-900 dark:text-gray-300">${product.description}</td>
        <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.category}</td>
        <td class="py-4 px-4 text-gray-900 dark:text-gray-300">$${product.price}</td>
        <td class="py-4 px-4 text-gray-900 dark:text-gray-300">$${product.salePrice || 'N/A'}</td>
        <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</td>
        <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.colors.join(', ')}</td>
        <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.sizes.join(', ')}</td>
        <td class="py-4 px-4 text-center">
          <button onclick="editProduct('${product._id}')" 
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline mr-2">
            Edit
          </button>
          <button onclick="deleteProduct('${product._id}')"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline">
            Delete
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Add event listeners
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);

  // Initial fetch
  fetchProducts();
});

// Edit product function
function editProduct(id) {
  // Implement edit functionality
  console.log('Edit product:', id);
}

// Delete product function
function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    const token = localStorage.getItem('adminToken');
    fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      } else {
        alert('Failed to delete product');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error deleting product');
    });
  }
} 