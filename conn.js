// ✅ Send data to backend instead of localStorage
fetch("http://localhost:3000/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value
  })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    showToast(`✅ Account created! Welcome 🎉`, 3000);
    setTimeout(() => {
      window.location.href = './index.html';
    }, 2000);
  } else {
    showToast(`⚠️ ${data.message}`);
  }
})
.catch(err => {
  console.error(err);
  showToast("❌ Server error!");
});