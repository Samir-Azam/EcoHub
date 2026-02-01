// In development, use proxy (/api). In production, set VITE_API_URL to your backend URL.
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "/api";

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  // Make the HTTP request using fetch
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    const error = new Error(data.message || res.statusText);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),

  auth: {
    register: (name, email, password) =>
      api.post("/auth/register", { name, email, password }),
    login: (email, password) => api.post("/auth/login", { email, password }),
    me: (token) =>
      request("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
  },
  brands: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api.get(`/brands${q ? `?${q}` : ""}`);
    },
    get: (slug) => api.get(`/brands/${slug}`),
  },
  products: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api.get(`/products${q ? `?${q}` : ""}`);
    },
    get: (slug) => api.get(`/products/${slug}`),
  },
  categories: {
    list: () => api.get("/categories"),
    get: (slug) => api.get(`/categories/${slug}`),
  },
  carbon: {
    calculate: (data) => {
      const token = (localStorage.getItem("ecohub_token") || "").trim();
      if (!token) {
        throw new Error("Not authenticated. Please log in.");
      }
      return request("/carbon/calculate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
    },
    getMyEmissions: () => {
      const token = (localStorage.getItem("ecohub_token") || "").trim();
      return request("/carbon/my-emissions", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    },
    getPredictions: (months = 12) => {
      const token = (localStorage.getItem("ecohub_token") || "").trim();
      return request(`/carbon/predictions?months=${months}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    },
    getLatest: () => {
      const token = (localStorage.getItem("ecohub_token") || "").trim();
      return request("/carbon/latest", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    },
    getStats: () => {
      const token = (localStorage.getItem("ecohub_token") || "").trim();
      return request("/carbon/stats", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    },
    getRankings: (week) => {
      const token = (localStorage.getItem("ecohub_token") || "").trim();
      const query = week ? `?week=${week}` : "";
      return request(`/carbon/rankings${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    },
    getMonthlyRewards: (month) => {
      const token = (localStorage.getItem("ecohub_token") || "").trim();
      const query = month ? `?month=${month}` : "";
      return request(`/carbon/monthly-rewards${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    },
  },
};
