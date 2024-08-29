export class User {
    username: string;
    pw: string;
    token: string;
    email: string;
    birthday?: Date;
    profilePicture?: string;
    lastLogin?: Date;
    dateJoined?: Date;

    constructor(username: string, pw: string, token: string, email: string, birthday?: Date, profilePicture?: string, dateJoined?: Date, lastLogin?: Date) {
        this.username = username;
        this.pw = pw;
        this.token = token;
        this.email = email;
        this.birthday = birthday;
        this.profilePicture = profilePicture;
        this.dateJoined = dateJoined;
        this.lastLogin = lastLogin;
    }

    static fromJSON(jsonData: any, token: string): User {

        const birthday = jsonData.birthday ? new Date(jsonData.birthday) : undefined;
        const lastLogin = jsonData.birthday ? new Date(jsonData.last_login) : undefined;
        const dateJoined = jsonData.birthday ? new Date(jsonData.date_joined) : undefined;

        return new User(
            jsonData.username,
            jsonData.password,
            token,
            jsonData.email,
            birthday,
            jsonData.profilePicture,
            lastLogin,
            dateJoined
        );
    }
}