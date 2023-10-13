import fs from 'fs';
import { unminify } from './unMinify.js';
import { error } from 'console';
const POSTPATH = './postsMin.json';

class post{
    constructor(userId, bodyText, hashTags, videoId = null, imageId = null, time = performance.now()){
        this.userId = userId;
        this.bodyText = bodyText;
        this.hashTags = hashTags;
        this.videoId = videoId;
        this.imageId = imageId;
        this.time = time;
        this.postId = getUniqueId();
        this.likes = 0;
        this.reports = 0;
        this.views = 0;
    }

    // the following functions need to be able to update the existing post.json value
    view(){
        this.views ++;
    }
    report(){
        this.reports ++;
    }
}
function like(postId) {
    const postsJsonObject = JSON.parse(fs.readFileSync(POSTPATH, 'utf8'));
    const postObject = postsJsonObject.find(post => post.postId === postId);

    if (!postObject) {
        console.error('Post not found!');
        return;
    }
    console.log(postObject);
    //saves to a new object, not the old json
    postObject.like++;
    postsJsonObject[postObject.postId] = postObject;

    fs.writeFileSync(POSTPATH, JSON.stringify(postsJsonObject, null, 2), 'utf8');
}

function getUniqueId() {
    const postsJsonObject = JSON.parse(fs.readFileSync('postsMin.json', 'utf8'));

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
function saveNewPost(unqiuePost){
    const jsonFileContents = fs.readFileSync(POSTPATH, 'utf8');

    const jsonObject = JSON.parse(jsonFileContents);
    jsonObject.push(unqiuePost);
    const jsonString = JSON.stringify(jsonObject, null, 2);

    fs.writeFileSync(POSTPATH, jsonString, 'utf8');
}
// saveNewPost(new post('1', "Fahad's first post", ['firstpost', '1', '2']));
// like(2);