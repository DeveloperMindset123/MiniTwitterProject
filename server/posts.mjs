import { MongoClient, ObjectId } from 'mongodb';
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
function getBannedWords(){
    const filePath = 'bannedWords.json';
    try {
        const jsonContent = fs.readFileSync(filePath, 'utf8');
        const config = JSON.parse(jsonContent);

        return config.banned;
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
        this.dislikes = 0;
        this.reports = 0;
        this.views = 0;
    }
}
export async function SaveNewPost(uniquePost) {
    const BANNEDWORDS = getBannedWords();
    // fitler
    function filterText(text) {
        let counter = 0;
        const filteredText = text.replace(/\b\w+\b/g, (match) => {
            if (BANNEDWORDS.includes(match.toLowerCase())) {
                counter++;
                return '*'.repeat(match.length);
            }
            return match;
        });

        return { counter, filteredText };
    }
    if(filterText(uniquePost.bodyText).counter >2){
        console.log("Too many banned words!");
        return false;
    } else{
        uniquePost.bodyText = filterText(uniquePost.bodyText).filteredText;
    }

    try {
        const client = new MongoClient(mongoUri());
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(POSTS);

        await collection.insertOne(uniquePost);

        await client.close();
    } catch (err) {
        console.error('Error saving new post:', err);
    }
}
export async function UpdatePostCounter(postId, type) {
    try {
        const client = new MongoClient(mongoUri());
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(POSTS);

        const postObject = await collection.findOne({ '_id': new ObjectId(postId) });

        if (!postObject) {
            console.error('Post not found!');
            return;
        }

        switch (type) {
            case 'like':
            postObject.likes++;
            break;
            case 'dislike':
            postObject.dislikes++;
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

        await collection.updateOne({ '_id': new ObjectId(postId) }, { $set: postObject });

        await client.close();
    } catch (err) {
        console.error('Error updating post counter:', err);
    }
}
export async function FetchPosts(){
    try {
        const client = new MongoClient(mongoUri());
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(POSTS);

        const posts = await collection.find({}).toArray();

        if (!posts) {
            console.error('Post not found!');
            return;
        }

        await client.close();
        return posts;
    } catch (err) {
        console.error('Error fetching posts:', err);
    }
}
export async function DeletePost(postId){
    try {
        const client = new MongoClient(mongoUri());
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(POSTS);

        const query = { '_id': new ObjectId(postId) };
        const post = await collection.findOne(query);

        if (!post) {
            console.error('Post not found!');
            await client.close();
            return false;
        }

        // delete logic
        await collection.deleteOne(query);

        await client.close();
        return;
    }catch(err){
        console.error('Error deleting post' + err);
        return false;
    }
}

// Search Functions
export async function Search(hashTags){ // takes array of hashtags as input
    try {
        const client = new MongoClient(mongoUri());
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(POSTS);
        const query = {
            hashTags: { $all: hashTags }
        };
        const posts = await collection.find(query).toArray();

        if (!posts) {
            console.error('Post not found!');
            return;
        }

        await client.close();
        return posts;
    } catch (err) {
        console.error('Error fetching posts:', err);
    }
}
export async function FetchTrending(){
    // logic:
    // Any message with >10 reads, #likes - #dislikes>3
    // will be promoted to “trendy post” shown in the 
    // 'trending tab'.
    
    try {
        const client = new MongoClient(mongoUri());
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(POSTS);
        const query = {
            $expr: { $gt: [{ $subtract: ["$likes", "$dislikes"] }, 3] }
        };
        const posts = await collection.find(query).toArray();

        if (!posts) {
            console.error('Post not found!');
            return;
        }

        await client.close();
        return posts;
    } catch (err) {
        console.error('Error fetching posts:', err);
    }
}
'Usage examples:'
// SaveNewPost(new Post('1', "Fahad's first post", ['firstpost', '1', '2']));
// UpdatePostCounter(2, 'like');
// console.log(await FetchPosts());
// DeletePost(65306);
// console.log(await FetchTrending());