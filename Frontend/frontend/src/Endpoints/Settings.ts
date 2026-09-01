import axios from 'axios';

export const BASE_URL = '/api'
export const BASE_URL_LOC = '/api'

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export async function fetchCsrfToken() {
    const response = await instance.get("/get_csrf_token");
    return response.data.csrfToken;
}
