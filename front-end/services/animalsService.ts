import api from "./api";

const animalsService = {
  getAll: async () => {
    const response = await api.get("/animals-registration");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/animals-registration/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/animals-registration", data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/animals-registration/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/animals-registration/${id}`);
    return response.data;
  },
};

export default animalsService;