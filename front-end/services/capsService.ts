import api from "./api";

const capsService = {
  getAll: async () => {
    const response = await api.get("/caps-registration");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/caps-registration/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/caps-registration", data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/caps-registration/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/caps-registration/${id}`);
    return response.data;
  },
};

export default capsService;