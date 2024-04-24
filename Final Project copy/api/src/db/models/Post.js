module.exports = class Post {
    id = null;
    userId = null;
    datetime = null;
    text = null;

    constructor(data) {
        this.id = data.post_id;
        this.userId = data.user_id;
        this.datetime = data.post_datetime;
        this.text = data.post_text;
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            datetime: this.datetime,
            text: this.text
        }
    }
};