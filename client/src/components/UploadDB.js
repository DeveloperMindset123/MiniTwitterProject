import moment from 'moment-timezone';
import axios from 'axios';

function convertTimeZone(date, targetTimeZone) {
    const time = moment(date).tz(targetTimeZone).format();
    return time;
}
const DATE = convertTimeZone(new Date(), 'America/New_York');


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
        this.comments = {};
    }
}    
        
export class User{ // userId generated by `_id` by mongoDb
    constructor(admin = false, corpo = false, trendy = false, normal = true, userName, cash, bio, following, interests, password, corpoInfo, email){
        this.admin = admin;
        this.corpo = corpo;
        this.trendy = trendy;
        this.normal = normal;
        this.userName = 'no-user-name';
        this.cash = 0;
        this.bio = 'bio';
        this.following = [];
        this.likes = 0;
        this.interests = [];
        this.password = '';
        this.corpoInfo = [];
        this.email = '';
    }
    updateWith(otherUser) {
        Object.assign(this, otherUser);
    }
}

export async function GetUser({userId}) {
  try{
    const response = await axios.get('http://localhost:4000/api/fetch-user/', {params: {userId}});
    if(response.status === 200){
      return response.data;
    } else {
      console.error('Error fetching user');
    }
  } catch (error) {
      console.error('Error fetching user', error);
      return null;
    }
}
export async function UpdateUser({oldUser, newUser}) {
  // console.log('UpdateUser Got:', oldUser, newUser)
  try{
    const response = await axios.post('http://localhost:4000/api/update-user/', {userName: oldUser, newUser: newUser});
    if(response.status === 200){
      return response.data;
    } else {
      console.error('Error updating user');
    }
  } catch (error) {
      console.error('Error updating user', error);
      return null;
    }
}

// Usage examples:
// SaveNewPost(new Post('1', "Fahad's first post", ['firstpost', '1', '2']));
// UpdatePostCounter(2, 'like');