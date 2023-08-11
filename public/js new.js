document.addEventListener("DOMContentLoaded", () => {
  const assetForm = document.getElementById("assetForm");
  const assetTableBody = document.getElementById("assetTableBody");
  const searchInput = document.getElementById("searchInput");

  fetchProducts();

  assetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("assetName").value,
      amount: parseFloat(document.getElementById("assetAmount").value),
      type: document.getElementById("assetType").value,
    };

    const assetId = document.getElementById("assetId").value;
    if (assetId) {
      updateProduct(assetId, data);
    } else {
      addNewProduct(data);
    }
  });

  function resetForm() {
    document.getElementById("assetId").value = "";
    document.getElementById("assetName").value = "";
    document.getElementById("assetAmount").value = "";
    document.getElementById("assetType").value = "Kas Masuk";
    document.getElementById("submitButton").textContent = "Tambahkan";
  }

  searchInput.addEventListener("input", (e) => {
    const searchQuery = e.target.value;
    const categoryFilter = document.getElementById("filterType").value;
    fetchProducts(searchQuery, categoryFilter);
  });

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
                              <button class="btn btn-warning btn-sm edit-btn" data-id="${product.id}">Edit</button>
                              <button class="btn btn-danger btn-sm delete-btn" data-id="${product.id}">Delete</button>
                          </td>
                      </tr>
                  `;
        }
        assetTableBody.innerHTML = tableRows;

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

  document
    .getElementById("clearDataButton")
    .addEventListener("click", clearData);

  function clearData() {
    const isConfirmed = confirm(
      "Apakah kamu yakin ingin menghapus semua data?"
    );

    if (isConfirmed) {
      fetch(`/products`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Semua produk telah dihapus") {
            assetTableBody.innerHTML = "";
            document.getElementById("totalCashIn").innerText = "Rp 0";
            document.getElementById("totalCashOut").innerText = "Rp 0";
            document.getElementById("balanceCash").innerText = "Rp 0";
            alert("Semua data telah dihapus");
          } else {
            console.error("Failed to clear data from server.");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  assetTableBody.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("edit-btn")) {
      const productId = event.target.getAttribute("data-id");
      editProduct(productId);
    } else if (event.target && event.target.classList.contains("delete-btn")) {
      const productId = event.target.getAttribute("data-id");
      deleteProduct(productId);
    }
  });

  function editProduct(id) {
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
  }

  function deleteProduct(id) {
    const isConfirmed = confirm("Apakah kamu yakin ingin menghapus data ini?");
    if (isConfirmed) {
      fetch(`/products/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          fetchProducts();
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  function updateProduct(assetId, data) {
    fetch(`/products/${assetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        resetForm();
        fetchProducts();
      })
      .catch((error) => console.error("Error:", error));
  }

  function addNewProduct(data) {
    fetch("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        resetForm();
        fetchProducts();
      })
      .catch((error) => console.error("Error:", error));
  }
});
