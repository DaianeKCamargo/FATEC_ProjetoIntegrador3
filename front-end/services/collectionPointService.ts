import api from "./api";

const collectionPointService = {
    create: async (data: any) => {
        const response = await api.post("/collection-point", data);
        return response.data;
    },
};

export default collectionPointService;