import axios, { AxiosResponse } from 'axios';
import { User } from '../Datatypes/User';
import { BASE_URL } from './Settings';

export namespace UserService {

    export async function getUserByUserName(name: string, pw: string): Promise<User | null> {

        let userData = null;
        let user = null;
        const path = BASE_URL + '/users/login'
        try {
            const response = await axios.post(path, {
                username: name,
                password: pw,
            });
            const { token } = response.data;

            if (!token) {
                console.error('No token received');
                return null;
            }
            // Store the token in the browser's local storage or a state management library
            localStorage.setItem('authToken', token);

            // Fetch additional user data after successful login
            userData = await fetchUserData(token);

            user = User.fromJSON(userData, token);
            return user;

        } catch (error) {
            console.error('Failed to Login ' + error)
            return null;
        }
    }

    export async function getUserDataFromToken(token: string): Promise<User | null> {

        let user = null;
        const path = BASE_URL + '/users/me-from-token'
        try {
            const response = await axios.get(path, {
                headers: { Authorization: `Bearer ${token}` },
            });

            user = User.fromJSON(response.data, token);
            return user;

        } catch (error) {
            console.error('Failed to Login ' + error)
            return null;
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

            const response = await axios.post(path, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 201) {
            } else {
                console.error('Failed to create user:', response.status, response.data);
            }
            return response;
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

}

export async function fetchUserData(token: string) {
    try {
        const path = BASE_URL + '/users/me'

        const response = await axios.get(path, {
            headers: {
                Authorization: `Token ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
    }
};


export async function getUser(username: string, pw: string): Promise<any> {

    let userData = null;
    try {
        const path = BASE_URL + '/users/login'

        const response = await axios.post(path, {
            username: username,
            password: pw,
        });
        const { token } = response.data;

        // Store the token in the browser's local storage or a state management library
        localStorage.setItem('authToken', token);

        // Fetch additional user data after successful login
        userData = await fetchUserData(token);

    } catch (error) {
        console.error('Failed to Login ' + error)
    }
    return userData;
}