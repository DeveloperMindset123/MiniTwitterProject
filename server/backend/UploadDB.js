import { MongoClient } from 'mongodb';
import { performance } from 'perf_hooks';
import { mongoUri } from '../../server/server.mjs';

const POSTS_COLLECTION = 'posts';

export class Post {
    constructor(userId, bodyText, hashTags, videoId = null, imageId = null, time = performance.now()) {
        this.userId = userId;
        this.bodyText = bodyText;
        this.hashTags = hashTags;
        this.videoId = videoId;
        this.imageId = imageId;
        this.time = time;
        this.postId = GetUniqueId();
        this.likes = 0;
        this.reports = 0;
        this.views = 0;
    }
}

export async function SaveNewPost(uniquePost) {
  try {
    const client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db('Project 0'); // Replace with your database name
    const collection = db.collection(POSTS_COLLECTION);

    await collection.insertOne(uniquePost);

    await client.close();
  } catch (err) {
    console.error('Error saving new post:', err);
  }
}

export async function UpdatePostCounter(postId, type) {
    try {
    const client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db('Project 0'); // Replace with your database name
    const collection = db.collection(POSTS_COLLECTION);

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

export async function GetUniqueId() {
    try {
    const client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db('Project 0'); // Replace with your database name
    const collection = db.collection(POSTS_COLLECTION);

    let uniqueId;
    do {
        uniqueId = Math.floor(Math.random() * 100000);
    } while (await collection.findOne({ postId: uniqueId }));

    await client.close();
    return uniqueId;
    } catch (err) {
    console.error('Error generating unique ID:', err);
    }
}

// Usage examples:
// SaveNewPost(new Post('1', "Fahad's first post", ['firstpost', '1', '2']));
// UpdatePostCounter(2, 'like');
