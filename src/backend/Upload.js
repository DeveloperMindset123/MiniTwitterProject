/* eslint-disable no-unused-vars */
import fs from 'fs';
import { unminify } from './unMinify.js';
import { error } from 'console';
const POSTPATH = './posts.json';

export class Post{
    constructor(userId, bodyText, hashTags, videoId = null, imageId = null, time = performance.now()){
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
export function UpdatePostCounter(postId, type) {
    const postsJsonObject = JSON.parse(fs.readFileSync(POSTPATH, 'utf8'));
    const postObject = postsJsonObject.find(post => post.postId === postId);

    if (!postObject) {
        console.error('Post not found!');
        return;
    }
    switch(type){
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
            console.error("Invalid Update Command Type!");
    }
    // console.log(postObject);

    postsJsonObject[postObject.postId] = postObject;
    fs.writeFileSync(POSTPATH, JSON.stringify(postsJsonObject, null, 2), 'utf8');
}
export function GetUniqueId() {
    const postsJsonObject = JSON.parse(fs.readFileSync(POSTPATH, 'utf8'));

    // Create a set of all the existing post IDs.
    const existingPostIds = new Set();
    for (const post of postsJsonObject) {
        existingPostIds.add(post.postId);
    }

    // Generate a random integer until we find a unique one.
    let uniqueId;
    do {
        uniqueId = Math.floor(Math.random() * 100000);
    } while (existingPostIds.has(uniqueId));

    return uniqueId;
}
function SaveNewPost(unqiuePost){
    const jsonFileContents = fs.readFileSync(POSTPATH, 'utf8');

    const jsonObject = JSON.parse(jsonFileContents);
    jsonObject.push(unqiuePost);
    const jsonString = JSON.stringify(jsonObject, null, 2);

    fs.writeFileSync(POSTPATH, jsonString, 'utf8');
}
// SaveNewPost(new Post('1', "Fahad's first post", ['firstpost', '1', '2']));
// UpdatePostCounter(2, 'like');