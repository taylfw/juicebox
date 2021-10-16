const {
  client,
  getAllUsers,
  createPost,
  createUser,
  updateUser,
  getAllPosts,
  getPostsByUser,
  getUserById,
  updatePost,
} = require("./index");

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "Al",
      location: "Jacksonville",
    });

    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "Sandy",
      location: "Gainesville",
    });

    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "Karen",
      location: "Palatka",
    });

    console.log(albert);
    console.log(sandra);
    console.log(glamgal);
    console.log("Finished creating users!");
  } catch (err) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("Starting to create posts...");
    await createPost({
      authorId: albert.id,
      title: "Scrambled Eggs",
      content:
        "I can't figure out how to make this recipe. Can somebody please help? ",
    });

    await createPost({
      authorId: sandra.id,
      title: "BROKEN KEYBOARD",
      content:
        "cAN'T FIGURE OUT WHY i'M TYPING IN ALL CAPS. i DON'T NORMALLY USE COMPUTERS.",
    });

    await createPost({
      authorId: glamgal.id,
      title: "Broken Ice Cube",
      content:
        "I heated this ice cube up from 26 degrees to 30 degrees and it still won't melt. Please advise!",
    });
    console.log("Finished creating posts!");
  } catch (error) {
    console.log("Error creating posts!");
    throw error;
  }
}

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
    DROP TABLE IF EXISTS post_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS users;
    
        `);
    console.log("Finished dropping tables!");
  } catch (err) {
    console.log(err);
  }
}

async function createTables() {
  try {
    await client.query(`
    
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        location varchar(255) NOT NULL,
        active BOOLEAN DEFAULT true

      );

      CREATE TABLE posts(
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE tags(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE post_tags(
        "postId" INTEGER REFERENCES posts(id) UNIQUE,
        "tagId" INTEGER REFERENCES tags(id) UNIQUE
      );

        `);
  } catch (err) {
    console.error("Error dropping tables!");
    throw err;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (err) {
    console.log(err);
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
