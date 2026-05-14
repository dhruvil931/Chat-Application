import { httpClient } from "../config/axios";

export const createRoomApi = async (roomDetail) => {
  const response = await httpClient.post("/api/v1/rooms", roomDetail);
  return response.data;
};

export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};

export const getMessagesApi = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?page=${page}&size=${size}`,
  );
  return response.data;
};
