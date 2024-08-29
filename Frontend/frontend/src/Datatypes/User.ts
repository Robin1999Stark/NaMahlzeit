export class User {
    username: string;
    pw: string;
    email: string;
    constructor(username: string, pw: string, email: string) {
        this.username = username;
        this.pw = pw;
        this.email = email;
    }
    static fromJSON(jsonData: any): User {
        return new User(jsonData.username, jsonData.password, jsonData.email);
    }
}