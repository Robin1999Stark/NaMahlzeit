interface UserData {
    username: string;
    password?: string;
    email: string;
    birthday?: string | null;
    profile_picture?: string | null;
    last_login?: string | null;
    date_joined?: string | null;
}

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

    static fromJSON(jsonData: UserData, token: string): User {

        const birthday = jsonData.birthday ? new Date(jsonData.birthday) : undefined;
        const lastLogin = jsonData.last_login ? new Date(jsonData.last_login) : undefined;
        const dateJoined = jsonData.date_joined ? new Date(jsonData.date_joined) : undefined;

        return new User(
            jsonData.username,
            jsonData.password ?? '',
            token,
            jsonData.email,
            birthday,
            jsonData.profile_picture ?? undefined,
            dateJoined,
            lastLogin
        );
    }
}