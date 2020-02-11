// imports
const express = require('express');
// bring in data
// - [ex]: const Users = require('./data/db.js')
const Posts = require('./data/db.js');
// bring in router
const postsRouter = require('./data/posts-router.js');
// create server 
const server = express()

// teach express JSON
server.use(express.json())
// introduce router
server.use("/api/posts", postsRouter)

// handlers
server.get("/", (req, res) => {
    res.send("Welcome...")
})
// listen
server.listen(8000, console.log("API is running on Port 8000.") )