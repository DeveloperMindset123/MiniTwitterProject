import fs from 'fs';
import { unminify } from './unMinify.js';
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
    like(){
        this.like ++;
    }
    view(){
        this.views ++;
    }
    report(){
        this.reports ++;
    }
}

// needs to check if the id doesnt exist and create a new one
function getUniqueId(){
    return 2;
}

function saveNewPost(unqiuePost){
    const jsonFilepath = './postsMin.json';
    const jsonFileContents = fs.readFileSync(jsonFilepath, 'utf8');

    const jsonObject = JSON.parse(jsonFileContents);
    jsonObject.push(unqiuePost);
    const jsonString = JSON.stringify(jsonObject);

    fs.writeFileSync(jsonFilepath, jsonString, 'utf8');
    unminify(jsonFilepath);
}

saveNewPost(new post('1', "Fahad's first post", ['firstpost', '1', '2']));