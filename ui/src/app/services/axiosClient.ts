import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

const baseURL = 'http://localhost:3232';
const axiosClient = axios.create({
    baseURL,
});

export default axiosClient;
