# The database system won't require learning complex database system, instead, we will rely on JSON file to serve as a database system.

In order to implement the messaging system, we can following the following steps:

1. Create a JSON file to store the user data. The JSON file should contain an array of objects, with each object representing a user. The user object should have the following properties:

- id: A unique identifier for the user.
- username: The user's username.
- email: The user's email address.
- type: The user's type (SU, CU, TU, OU or Surfer) --> Something to note about surfers, we will simply need to implement a feature that allows people to "Continue as Guest" rather than signing up for an account and having to login.
- Other Relevant Data: Any other data such as number of subscribers, followers, tips recieved, likes/dislikes.

2. Create another JSON file to store the message data. The JSOn file should contain an array of objects, with each object representing a message. The message object should have the following properties:

- id: A unique identifier for the message.
- author: The ID of the user who authored the message.
- time_and_date: The date and time at which the message was created.
- keywords: An array of up to three keywords chosen by the author.
- number_of_reads: The number of times the message has been read/viewed.
- number_of_likes: The number of likes the message has recieved.
- number_of_dislikes: The number of dislikes the message has recieved.
- number_of_comlaints: The number of complaints the message has recieved (report feature).
- is_blocked: A boolean value indicating whether the message has been blocked.
- is_trendy: A boolean value indicating whether the message is trendy or not.

3. Implement a logic to manage the messaging system. This will include logic to:

- Add, delete and update users.
- Add, delete and update messages.
- Promote messages to the trending tab.
- Detect and block messages with tabooed word.
- Warn users who author messages with tabooed words.