const DATE = new Date(); // uses UTC time - ooordinated universal time
export class Post {
    constructor(userId, bodyText, hashTags, videoId = null, imageId = null) {
        this.userId = userId;
        this.bodyText = bodyText;
        this.hashTags = hashTags;
        this.videoId = videoId;
        this.imageId = imageId;
        this.time = DATE;
        this.likes = 0;
        this.reports = 0;
        this.views = 0;
    }
}
export class User{ // userId generated by `_id` by mongoDb
    constructor(admin, corpo, trendy, normal, userName, cash, picture, bio, following, interests, password){
        this.admin = admin;
        this.corpo = corpo;
        this.trendy = trendy;
        this.normal = normal;
        this.userName = userName;
        this.cash = cash;
        this.picture = picture;
        this.bio = bio;
        this.following = following;
        this.likes = 0;
        this.interests = interests;
        this.password = hash(password);
    }
    updateWith(otherUser) {
        Object.assign(this, otherUser);
    }
    hash(text) {
        const hash = crypto.createHash('sha256');
        hash.update(text);
        return hash.digest('hex');
    }
}
// Usage examples:
// SaveNewPost(new Post('1', "Fahad's first post", ['firstpost', '1', '2']));
// UpdatePostCounter(2, 'like');
