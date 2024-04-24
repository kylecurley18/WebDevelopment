module.exports = class User {
    id = null;
    first_name = null;
    last_name = null;
    username = null;
    email = null;
    salt = null;
    password = null;
    num_parks = null;

    constructor(data) {
        this.id = data.usr_id;
        this.first_name = data.usr_first_name;
        this.last_name = data.usr_last_name;
        this.username = data.usr_username;
        this.email = data.usr_email;
        this.salt = data.usr_salt;
        this.password = data.usr_password;
        this.num_parks = data.usr_num_parks;
    }

    toJSON() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            username: this.username,
            email: this.email,
            num_parks: this.num_parks
        }
    }
};