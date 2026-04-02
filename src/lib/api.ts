import axios from "axios";

const BASE_URL = "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("krushi_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear the stored token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("krushi_token");
      localStorage.removeItem("krushi_user");
      // Redirect to home — let ProtectedRoute handle navigation
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => api.post("/auth/register", data).then((r) => r.data),

  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),

  me: () => api.get("/auth/me").then((r) => r.data.user),
};

// ── JOBS ──────────────────────────────────────────────────────────────────────
export const jobsApi = {
  list: (params?: { status?: string; q?: string; location?: string }) =>
    api.get("/jobs", { params }).then((r) => r.data),

  get: (id: string) => api.get(`/jobs/${id}`).then((r) => r.data),

  create: (data: {
    title: string;
    description: string;
    location: string;
    wages: string | number;
    duration: string | number;
  }) => api.post("/jobs", data).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/jobs/${id}/status`, { status }).then((r) => r.data),

  delete: (id: string) => api.delete(`/jobs/${id}`).then((r) => r.data),
};

// ── WORKERS ───────────────────────────────────────────────────────────────────
export const workersApi = {
  list: (params?: { available?: string; q?: string }) =>
    api.get("/workers", { params }).then((r) => r.data),

  get: (id: string) => api.get(`/workers/${id}`).then((r) => r.data),

  toggleAvailability: (available: boolean) =>
    api.patch("/workers/availability", { available }).then((r) => r.data),
};

// ── EQUIPMENT ─────────────────────────────────────────────────────────────────
export const equipmentApi = {
  list: (params?: { available?: string; q?: string; ownerId?: string }) =>
    api.get("/equipment", { params }).then((r) => r.data),

  get: (id: string) => api.get(`/equipment/${id}`).then((r) => r.data),

  create: (data: {
    name: string;
    type: string;
    description: string;
    ratePerDay: string | number;
    location: string;
    image?: string;
  }) => api.post("/equipment", data).then((r) => r.data),

  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/equipment/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/equipment/${id}`).then((r) => r.data),
};

// ── APPLICATIONS ──────────────────────────────────────────────────────────────
export const applicationsApi = {
  apply: (jobId: string) => api.post("/applications", { jobId }).then((r) => r.data),

  myApplications: () => api.get("/applications/my").then((r) => r.data),

  updateStatus: (id: string, status: "accepted" | "rejected") =>
    api.patch(`/applications/${id}`, { status }).then((r) => r.data),
};

// ── ACTIVITY ──────────────────────────────────────────────────────────────────
export const activityApi = {
  list: () => api.get("/activity").then((r) => r.data),
};

// ── PROFILE ───────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => api.get("/profile").then((r) => r.data),

  update: (data: Record<string, unknown>) =>
    api.patch("/profile", data).then((r) => r.data),
};
