// Small helper around fetch that attaches the login token and handles errors.
const API = {
  token() {
    return localStorage.getItem("wtf_token");
  },
  setToken(t) {
    localStorage.setItem("wtf_token", t);
  },
  clear() {
    localStorage.removeItem("wtf_token");
    localStorage.removeItem("wtf_name");
  },
  async request(method, url, body) {
    const headers = { "Content-Type": "application/json" };
    const t = this.token();
    if (t) headers.Authorization = "Bearer " + t;
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.status === 401) {
      this.clear();
      if (!location.pathname.endsWith("login.html")) location.href = "/login.html";
      throw new Error("Not signed in");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
  },
  get(url) {
    return this.request("GET", url);
  },
  post(url, body) {
    return this.request("POST", url, body);
  }
};
