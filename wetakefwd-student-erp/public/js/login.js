// If already signed in, skip straight to the dashboard.
if (API.token()) location.href = "/";

const err = document.getElementById("err");
const u = document.getElementById("u");
const p = document.getElementById("p");
const btn = document.getElementById("signin");

function showError(msg) {
  err.textContent = msg;
  err.classList.add("show");
}

async function signIn() {
  err.classList.remove("show");
  const username = u.value.trim();
  const password = p.value;
  if (!username || !password) return showError("Enter your username and password.");
  btn.textContent = "Signing in…";
  btn.disabled = true;
  try {
    const data = await API.post("/api/login", { username, password });
    API.setToken(data.token);
    localStorage.setItem("wtf_name", data.name);
    location.href = "/";
  } catch (e) {
    showError(e.message);
    btn.textContent = "Sign in";
    btn.disabled = false;
  }
}

btn.addEventListener("click", signIn);
[u, p].forEach((el) =>
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") signIn();
  })
);
