Retrieve all posts from a specific user:

sql

SELECT * FROM Posts
WHERE UserID = [UserID];
Get the number of followers for a specific user:
sql

SELECT COUNT(*) AS FollowersCount FROM Followers
WHERE FollowingID = [UserID];
Find posts liked by a specific user:

sql

SELECT Posts.*
FROM Posts
INNER JOIN Likes ON Posts.PostID = Likes.PostID
WHERE Likes.UserID = [UserID];
Retrieve posts from users followed by a specific user:

sql

SELECT Posts.*
FROM Posts
INNER JOIN Followers ON Posts.UserID = Followers.FollowingID
WHERE Followers.FollowerID = [UserID];
Get the most recent posts with likes and retweets counts:

sql

SELECT Posts.PostID, PostText, Timestamp, COUNT(Likes.LikeID) AS LikesCount, COUNT(Retweets.RetweetID) AS RetweetsCount
FROM Posts
LEFT JOIN Likes ON Posts.PostID = Likes.PostID
LEFT JOIN Retweets ON Posts.PostID = Retweets.OriginalPostID
GROUP BY Posts.PostID
ORDER BY Timestamp DESC;
Insert a new post:

sql

INSERT INTO Posts (UserID, PostText)
VALUES ([UserID], 'This is a new post.');
Like a post:

sql

INSERT INTO Likes (UserID, PostID)
VALUES ([UserID], [PostID]);
Follow a user:

sql

INSERT INTO Followers (FollowerID, FollowingID)
VALUES ([FollowerID], [FollowingID]);