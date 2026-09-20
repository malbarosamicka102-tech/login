const API_URL = "http://localhost:5000";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const message = document.getElementById("message");
const registerMessage = document.getElementById("registerMessage");

showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Login failed.";
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } catch (error) {
    message.textContent = "Unable to reach the server.";
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  registerMessage.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      registerMessage.textContent = data.message || "Registration failed.";
      return;
    }

    registerMessage.textContent = "Registration successful. You can now log in.";
    registerForm.reset();
    setTimeout(() => {
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    }, 1200);
  } catch (error) {
    registerMessage.textContent = "Unable to reach the server.";
  }
});
