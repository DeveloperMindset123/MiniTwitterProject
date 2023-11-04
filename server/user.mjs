import { MongoClient } from 'mongodb';
import fs from 'fs';
const USERS = 'userData';
const DBNAME = 'deadBird';
const POSTS = 'posts';

export function mongoUri(){  //extracts the mongoUri from the JSON file
    const filePath = 'mongoUri.json';
    try {
        const jsonContent = fs.readFileSync(filePath, 'utf8');
        const config = JSON.parse(jsonContent);

        return config.uri;
    } catch (err) {
        console.error('Error reading or parsing the JSON file:', err);
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
export function CompareHashedText(inputText, hashedText) { //takes in unhashed text and hashed password
    const hashedInputText = hashText(inputText);
    return hashedInputText === hashedText;
}
export async function CreateUser(newUser){ // assuming proper filtering for unique name has been performed
    if(newUser.admin === false & newUser.corpo === false & newUser.trendy === false & newUser.normal === false){
        console.error('Invalid User Type: they have to have some type of permission!');
        return;
    }
    if(newUser.userName == null){
        console.error('Invalid UserName: user has no name!');
        return;
    }
    try {
        const client = new MongoClient(mongoUri(), { useUnifiedTopology: true });
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(USERS);

        await collection.insertOne(newUser);

        await client.close();
    } catch (err) {
        console.error('Error saving new user:', err);
    }
    console.log("User Registered!");
    return null;
}
export async function GetUser(userName){
    try {
        const client = new MongoClient(mongoUri(), { useUnifiedTopology: true });
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(USERS);

        const query = { userName: userName };
        const user = await collection.findOne(query);

        if (!user) {
            console.error('User not found!');
            await client.close();
            return;
        }

        await client.close();
        return user;
    }catch(err){
        console.error('Error fetching user ${userName}' + err);
        return;
    }
}
export async function GetUserPosts(userName){
    try {
        const client = new MongoClient(mongoUri(), { useUnifiedTopology: true });
        await client.connect();

        // first get the user's unique ID
        const db = client.db(DBNAME);
        let collection = db.collection(USERS);

        let query = { userName: userName };
        const user = await collection.findOne(query);

        if (!user) {
            console.error('User not found!');
            await client.close();
            return;
        }

        const userId = user._id; // gucci

        collection = db.collection(POSTS);
        query = { userId: userId};
        const cursor = collection.find(query);
        const posts = await cursor.toArray();

        if (posts.length > 0) {
            console.log('Posts found');
        } else {
            console.log('No posts found for this user');
        }


        await client.close();
        return posts;
    }catch(err){
        console.error('Error fetching user ${userName}' + err);
        return;
    }
}
export async function UpdateUser(userName, changedUser){ // will override user's old props with new props
    try {
        const client = new MongoClient(mongoUri(), { useUnifiedTopology: true });
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(USERS);

        const query = { userName: userName };
        const oldUserData = await collection.findOne(query);

        if (!oldUserData) {
            console.error(`User not found for userName: ${userName}`);
            await client.close();
            return;
        }
        
        const oldUser = new User(
            oldUserData.admin,
            oldUserData.corpo,
            oldUserData.trendy,
            oldUserData.normal,
            oldUserData.userName,
            oldUserData.cash,
            oldUserData.picture,
            oldUserData.bio,
            oldUserData.following,
            oldUserData.interests
        );
        oldUser.updateWith(changedUser);

        await collection.updateOne({ userName }, { $set: oldUser });
        console.log("User Updated!"); 
        
        await client.close();
        return oldUser;
    
    } catch(err){
        console.error('Error fetching user ${userName}' + err);
        return;
    }
}
export async function DeleteUser(userName){
    try {
        const client = new MongoClient(mongoUri(), { useUnifiedTopology: true });
        await client.connect();

        const db = client.db(DBNAME);
        const collection = db.collection(USERS);

        const query = { userName: userName };
        const user = await collection.findOne(query);

        if (!user) {
            console.error('User not found!');
            await client.close();
            return;
        }

        // delete logic
        await collection.deleteOne(query);

        await client.close();
        return;
    }catch(err){
        console.error('Error fetching user ${userName}' + err);
        return false;
    }
}

'Usage examples: (DO NOT CREATE DUPLICATES'
// CreateUser(new User(true, false, false, false, 'LordFarquaad'));
// console.log(await GetUser('LordFarquaad'));
// console.log(await GetUserPosts('LordFarquaad'));
// UpdateUser('LordFarquaad', new User(false, true, false, false, 'LordFarquaad', 50, null, "What's up, my name is MARKIPLIER", ['markiplier'], []));
// DeleteUser('LordFarquaad');