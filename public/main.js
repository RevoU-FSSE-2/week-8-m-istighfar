document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const productTableBody = document.getElementById("productTableBody");
  const searchInput = document.getElementById("searchInput");

  // Load all products on page load
  fetchProducts();

  // Submit product form
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("productName").value,
      price: parseFloat(document.getElementById("productPrice").value),
      category: document.getElementById("productCategory").value,
    };

    const productId = document.getElementById("productId").value;
    if (productId) {
      // Update product API call
      fetch(`/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((product) => {
          // Reset form values
          resetForm();

          fetchProducts();
        })
        .catch((error) => console.error("Error:", error));
    } else {
      // Add new product API call
      fetch("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((product) => {
          // Reset form values
          resetForm();

          fetchProducts();
        })
        .catch((error) => console.error("Error:", error));
    }
  });

  // reset
  function resetForm() {
    document.getElementById("productId").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("submitButton").textContent = "Add Product";
  }

  // Search products
  searchInput.addEventListener("input", (e) => {
    const searchQuery = e.target.value;
    fetchProducts(searchQuery);
  });

  function fetchProducts(searchQuery = "") {
    fetch(`/products?name=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        productTableBody.innerHTML = data.products
          .map(
            (product) => `
                  <tr>
                      <td>${product.id}</td>
                      <td>${product.name}</td>
                      <td>${product.price}</td>
                      <td>${product.category}</td>
                      <td>
                          <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Edit</button>
                          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
                      </td>
                  </tr>
              `
          )
          .join("");
      })
      .catch((error) => console.error("Error:", error));
  }

  window.editProduct = function (id) {
    // Fetch product and populate form for editing
    fetch(`/products/${id}`)
      .then((response) => response.json())
      .then((product) => {
        document.getElementById("productId").value = product.id;
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productCategory").value = product.category;
        document.getElementById("submitButton").textContent = "Update Product";
      })
      .catch((error) => console.error("Error:", error));
  };

  window.deleteProduct = function (id) {
    // Ask the user for confirmation
    const isConfirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    // If the user confirms, proceed with the delete
    if (isConfirmed) {
      fetch(`/products/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          fetchProducts();
          alert("Product deleted successfully!");
        })
        .catch((error) => console.error("Error:", error));
    }
  };
});
