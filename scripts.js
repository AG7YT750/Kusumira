// Example: cart button click feedback
document.querySelectorAll('.product-card .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Added to cart!');
  });
});

// brand_dashboard
function addProduct(){
  const formData = new FormData();
  formData.append("name", document.getElementById("pname").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("image", document.getElementById("image").files[0]);

  fetch("http://localhost:8080/add-product", {
    method: "POST",
    body: formData
  })
  .then(res => res.text())
  .then(() => alert("Product added ✅"));
}