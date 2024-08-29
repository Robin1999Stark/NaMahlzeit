import axios from 'axios';
import { User } from '../Datatypes/User';

const BASE_URL = 'http://localhost:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})


async function getCsrfToken() {
    try {
        const response = await instance.get('/get_csrf_token');
        const token = response.data.csrfToken;
        return token;
    } catch (error) {
        console.error('Error fetching CSRF token', error);
        return null;
    }
}

export namespace UserService {
    export async function login(name: string, pw: string) {

    }



    export async function getUserByID(id: string) {

    }

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

            // Store the token in the browser's local storage or a state management library
            localStorage.setItem('authToken', token);

            // Fetch additional user data after successful login
            userData = await fetchUserData(token);

            user = new User(name, pw, userData)

        } catch (error) {
            console.error('Failed to Login ' + error)
        }
        return user;
    }


    export async function createUser(email: string, username: string, password1: string, password2: string, firstName: string, lastName: string, birthday: Date, profilePictureURL: string) {
        try {
            const csrfToken = await getCsrfToken();
            const path = BASE_URL + '/users/register'

            if (csrfToken === null)
                throw new Error('CSRF token is null');
            email = "r.s.mar@gmx.de"
            username = "peter123"
            password1 = "passwort123"
            password2 = "passwort123"
            firstName = "Peter"
            lastName = "Lustig"
            birthday = new Date("1999-04-04")
            const response = await axios.post(path, {
                email,
                username,
                password1,
                password2,
                firstName,
                lastName,
                birthday,
            }, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json', // Add this line to specify JSON content type
                },
            });
            // Handle the response here
            if (response.status === 201) {
                // User created successfully
                console.log('User created:', response.data);
            } else {
                // Handle other status codes if needed
                console.error('Failed to create user:', response.status, response.data);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error creating user:', error);
        }
    }


    export async function updateUser(id: string, user: User) {

    }


    export async function deleteUser(id: string) {

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
        // Handle error if user data retrieval fails
        console.error('Failed to fetch user data:', error);
        return null;
    }
};


export async function getUser(username: string, pw: string): Promise<any> {

    let userData = null;
    console.log(username, pw)
    try {
        const path = BASE_URL + '/users/login'
        console.log(path)

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