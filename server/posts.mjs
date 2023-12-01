import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
const POSTS = 'posts';
const DBNAME = 'deadBird';
import dotenv from 'dotenv/config'; // even tho its gray its needed
const MONGOURI = process.env.MONOGODB;
import moment from 'moment-timezone';

function convertTimeZone(date, targetTimeZone) {
    const var1 = moment(date).tz(targetTimeZone).format('LLLL');
    return var1;
}
const DATE = convertTimeZone(new Date(), 'America/New_York');

/**
 * 
 * @returns {String} array of banned words
 */
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
/**
 * universal object used to store post data
 * 
 * likes, dislikes, reports, & views set to 0 by default
 * 
 * time and unique object ID generated automatically
 * @constructor userId, bodyText, hashTags, videoId = null, imageId = null
 */
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
/**
 * Saves posts to mongoDB "deadBird" under collection "posts"
 * 
 * If <3 banned words are detected, it filters them into '*' of the same length
 * 
 * If >3 banned words are detected, post will not save, returns `false`
 * @param {uniquePost} uniquePost 
 * @returns {null} null
 */
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
        const client = new MongoClient(MONGOURI);
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
        // console.log(postId, type);
        const client = new MongoClient(MONGOURI);
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
        const client = new MongoClient(MONGOURI);
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
        const client = new MongoClient(MONGOURI);
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

/**
 * Takes in array of hashtags & returns array of posts with said hashtag
 * @async 
 * @function Search
 * @param {hashTags} hashTag 
 * @returns {Promise<Array>} A promise that resolves to an array of relevant posts.
*/
export async function Search(hashtag){ // takes array of hashtags as input
    try {
        const client = new MongoClient(MONGOURI);
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
/**
 * Any message with >10 reads, #likes - #dislikes>3
 * will be fetched
 *
 * @async
 * @function FetchTrending
 * @returns {Promise<Array>} A promise that resolves to an array of trending posts.
 */
export async function FetchTrending(){    
    try {
        const client = new MongoClient(MONGOURI);
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