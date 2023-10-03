# MiniTwitterProject
A project with collaboration with two three other people to develop the functionalities listed below:
The following are the required as part of this project:

<b>Requirement Items for a messaging system (draft)</b>
Open for suggestions until 9/29 (F)

In this messaging system, there are 5 types of users:
1.	Super-user (SU): who can warn/add/delete any users and/or messages
2.	Corporate-user (CU): who can post ads and job openings
3.	Trendy-user (TU): the subset of ordinary users who were a) subscribed by >10 users, and b) received >$100 tips or #likes-#dislikes>10, and c) author of at least 2 trendy messages
4.	Ordinary-user (OU): besides having all features for a surfer, who can post/delete, comment, tip, like/dislike, complain, follow messages, and subscribe other users;
5.	Surfer: who can only view/search the messages and report/complain to the super-user about the misinformation 
For each message:
1.	Carry the author, time and date and up to 3 keywords chosen by the author
2.	Show the number of times others read it, number of likes/dislikes, and number of complaints
3.	If there are 1 or 2 tabooed words (taboo word list is managed by SU), the words are changed to corresponding number of asterisks; if >2, the msg is blocked automatically and the author is warned once automatically
4.	Any message with >10 reads, #likes - #dislikes>3 will be promoted to “trendy post” shown in the “trending tab”.

Required features:
1.	When a surfer visit the system, the top 3 most liked messages and the top 3 trendy-users will be featured in the top page; the surfer is given the choice of applying to be an ordinary or corporate user with their chosen id
2.	The super-user processes user applications with accept or deny: if accept, a temporary password is sent to the user and the user must change it when first log in, and an amount of money should be deposited to the system; if denied, a justification should be provided
3.	When a TU/OU/CU logins, the system will suggest accounts for the user to follow based on this user’s reading/liking/tipping/following history
4.	A TU/OU/CU can construct their own profiles, which again is subjected to comments/reports by others, same warning policy will apply if the profile contains misinformation. 
5.	TU/OU can post messages with <=20 words (an image is equivalent to 10 words, while a video is equivalent to 15 words) for free, any message >20 words will be billed by the system automatically with the amount (# - 20)*$0.1; a CU’s message is billed #*$1 without free ones. If the user does not have enough money in the account, a warning is issued and when the user logging will be automatically directed to the payment page
6.	Any user receiving warning can dispute with the SU: if winning the dispute the warning is removed: if the warning is initialized by another user, the user who reported/complained will be warned once; if the warning is by a surfer, the complained user is rewarded by 3 likes from the SU. Any CU/OU with 3 outstanding warnings will be given the choice of paying out the fine to remove the complaints or removed from the system. Any TU with 3 outstanding warnings will be demoted to OU with no warnings.
7.	All users can search for messages based on author, keywords, with/without images and or videos, #of likes/dislikes.
8.	CU is allowed to post ads and job applications that other users can click and apply, CU will pay the system (SU) by $0.1 for each click and application.
9.	Any TU/OU who post ads or job opportunities will be fined by $10 and one warning.
10.	A creative feature of your team’s choice worthy of 10% of the system, super-creative features will receive special bonus.

Notes:
1.	GUI is required, but not necessarily web-base: a local GUI-based app is fine
2.	No need of DB, plain text based files are fine for this system
3.	No need to consider the scale, <10 users are fine for this system
4.	In your system, it is fine to use others’ package or library, but you must give due credit as comments, most of the codes should come from your team.


Technology Stack:
- Since this a fullstack project, for the sake of simplification, we will be working solely using <b><i>Next.js</b></i> framework, which is built for fullstack development. (The starter bundle of next.js comes with TypeScript, Eslint Support, Tailwind CSS as well). Additionally, Express.js, Nodemon and Axios may be utilized as backup for server-side rendering.

How to create the application:
1. npx create-next-app@latest

Dependancies Installed:
- React
- React-Dom
- next
- Express.js, axios, nodemon

You can use `npm install` to install all the components on frontend and backend independently, once installation is successful, start the frontend and backend servers.
- To start the frontend: `npm run dev`
- To start the backend: `node server.cjs`

The underlying backend of next.js is express.js, for the sake of simplification, simply can:
`cd backend`
Then...
`npm install express nodemon axios`

In progress: 3 Month Project
