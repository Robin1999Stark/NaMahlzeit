import axios, { AxiosResponse } from 'axios';
import { User } from '../Datatypes/User';
import { BASE_URL, fetchCsrfToken } from './Settings';

export async function getUserByUserName(name: string, pw: string): Promise<User | null> {

    try {
        const csrfToken = await fetchCsrfToken();
        await axios.post(BASE_URL + '/users/login', {
            username: name,
            password: pw,
        }, {
            withCredentials: true,
            headers: { 'X-CSRFToken': csrfToken },
        });
        return await getCurrentUser();
    } catch (error) {
        console.error('Failed to login:', error);
        return null;
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await axios.get(BASE_URL + '/users/me', {
            withCredentials: true,
        });
        return User.fromJSON(response.data, '');
    } catch (error) {
        if (axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)) {
            return null;
        }
        throw error;
    }
}

interface CreatUserInterface {
    username: string,
    password1: string,
    password2: string,
    email: string,
    birthday: Date,
    profilePicture: string | null
}

export async function createUser({
    username, password1, password2, email, birthday, profilePicture
}: CreatUserInterface): Promise<AxiosResponse | null> {
    try {
        const path = BASE_URL + '/users/register'

        const data = {
            username: username,
            email: email,
            password1: password1,
            password2: password2,
            birthday: new Date(birthday).toLocaleDateString('en-CA'),
            profilepicture: profilePicture
        }
        const csrfToken = await fetchCsrfToken();
        const response = await axios.post(path, data, {
            withCredentials: true,
            headers: {
                'X-CSRFToken': csrfToken || '',
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 201) {
            console.error('Failed to create user:', response.status, response.data);
        }
        return response;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}

export const UserService = { getUserByUserName, getCurrentUser, createUser };

export async function fetchUserData(token: string) {
    try {
        const path = BASE_URL + '/users/me'

        const response = await axios.get(path, {
            headers: {
                Authorization: `Token ${token}`,
                'X-CSRFToken': await fetchCsrfToken() || '',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
    }
}
