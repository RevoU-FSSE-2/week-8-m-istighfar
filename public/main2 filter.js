document.addEventListener("DOMContentLoaded", () => {
  const assetForm = document.getElementById("assetForm");
  const assetTableBody = document.getElementById("assetTableBody");
  const searchInput = document.getElementById("searchInput");

  // Load all products on page load
  fetchProducts();

  // Submit product form
  assetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("assetName").value,
      amount: parseFloat(document.getElementById("assetAmount").value),
      type: document.getElementById("assetType").value,
    };

    const assetId = document.getElementById("assetId").value;
    if (assetId) {
      // Update product API call
      fetch(`/products/${assetId}`, {
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
    document.getElementById("assetId").value = "";
    document.getElementById("assetName").value = "";
    document.getElementById("assetAmount").value = "";
    document.getElementById("assetType").value = "Kas Masuk";
    document.getElementById("submitButton").textContent = "Tambahkan";
  }

  // Search products
  // Search products
  searchInput.addEventListener("input", (e) => {
    const searchQuery = e.target.value;
    const categoryFilter = document.getElementById("filterType").value;
    fetchProducts(searchQuery, categoryFilter);
  });

  // Add event listener for category filter change
  document.getElementById("filterType").addEventListener("change", (e) => {
    const categoryFilter = e.target.value;
    const searchQuery = searchInput.value;
    fetchProducts(searchQuery, categoryFilter);
  });

  function fetchProducts(searchQuery = "", categoryFilter = "") {
    fetch(`/products?name=${searchQuery}&type=${categoryFilter}`)
      .then((response) => response.json())
      .then((data) => {
        let tableRows = "";
        for (let product of data.products) {
          tableRows += `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.amount}</td>
                        <td>${product.type}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    </tr>
                `;
        }
        assetTableBody.innerHTML = tableRows;

        // Update the total amounts and balance on the frontend
        document.getElementById(
          "totalCashIn"
        ).innerText = `Rp ${data.totalCashIn}`;
        document.getElementById(
          "totalCashOut"
        ).innerText = `Rp ${data.totalCashOut}`;
        document.getElementById("balanceCash").innerText = `Rp ${data.balance}`;
      })
      .catch((error) => console.error("Error:", error));
  }

  //Clear all data
  document
    .getElementById("clearDataButton")
    .addEventListener("click", function () {
      clearData();
    });

  function clearData() {
    // Clear the frontend data
    document.getElementById("assetTableBody").innerHTML = "";
  }

  window.editProduct = function (id) {
    // Fetch product and populate form for editing
    fetch(`/products/${id}`)
      .then((response) => response.json())
      .then((product) => {
        document.getElementById("assetId").value = product.id;
        document.getElementById("assetName").value = product.name;
        document.getElementById("assetAmount").value = product.amount;
        document.getElementById("assetType").value = product.type;
        document.getElementById("submitButton").textContent = "Edit";
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
        })
        .catch((error) => console.error("Error:", error));
    }
  };
});
