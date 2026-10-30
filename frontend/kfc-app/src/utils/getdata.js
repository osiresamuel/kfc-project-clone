import api from "./api";

export const getdata= async (url)=>{
  const { data } = await api.get(url);
  return data;
};