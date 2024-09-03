import axios from 'axios';

export const BASE_URL = 'https://foodplaner-demo.robin-stark.com/api'

export async function fetchCsrfToken() {
    const response = await axios.get(BASE_URL + "/get_csrf_token");
    return response.data.csrfToken;
}
