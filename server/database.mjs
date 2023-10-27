import { MongoClient } from 'mongodb';
import { performance } from 'perf_hooks';
import fs from 'fs';
const DATE = new Date(); // uses UTC time - ooordinated universal time
const POSTS = 'posts';
const DBNAME = 'deadBird';

export function mongoUri(){
    const filePath = 'mongoUri.json';
    try {
        const jsonContent = fs.readFileSync(filePath, 'utf8');
        const config = JSON.parse(jsonContent);

        return config.uri;
    } catch (err) {
        console.error('Error reading or parsing the JSON file:', err);
    }
}
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

export async function SaveNewPost(uniquePost) {
    try {
        const client = new MongoClient(mongoUri(), { useUnifiedTopology: true });
        await client.connect();

        const db = client.db(DBNAME); // Replace with your database name
        const collection = db.collection(POSTS);

        await collection.insertOne(uniquePost);

        await client.close();
    } catch (err) {
        console.error('Error saving new post:', err);
    }
}

export async function UpdatePostCounter(postId, type) {
    try {
        const client = new MongoClient(mongoUri(), { useUnifiedTopology: true });
        await client.connect();

        const db = client.db(DBNAME); // Replace with your database name
        const collection = db.collection(POSTS);

        const postObject = await collection.findOne({ postId });

        if (!postObject) {
            console.error('Post not found!');
            return;
        }

        switch (type) {
            case 'like':
            postObject.likes++;
            break;
            case 'report':
            postObject.reports++;
            break;
            case 'view':
            postObject.views++;
            break;
            default:
            console.error('Invalid Update Command Type!');
        }

        await collection.updateOne({ postId }, { $set: postObject });

        await client.close();
    } catch (err) {
        console.error('Error updating post counter:', err);
    }
}
'Usage examples:'
// SaveNewPost(new Post('1', "Fahad's first post", ['firstpost', '1', '2']));
// UpdatePostCounter(2, 'like');
