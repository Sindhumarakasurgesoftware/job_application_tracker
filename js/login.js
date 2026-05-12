function login() {
  const name = document.getElementById("username").value;
  const password = document.getElementById("pin").value;

  // ✅ FIXED CREDENTIALS
  const validName = "Sindhu";
  const validPassword = "1234";

  if (!name || !password) {
    alert("Please enter name and password");
    return;
  }

    // Check credentials
    if (name === validName && password === validPassword) {

  // Save user details
  localStorage.setItem("user", JSON.stringify({
    name: name,
    loggedIn: true
  }));

  // Redirect to dashboard
 // window.location.href = "index.html";
    window.open("index.html", "_blank");
    } else {
    document.getElementById("error").innerText =
      "Invalid name or password";
  }

}
