// imports 
const express = require('express');
// data
const Posts = require('./db.js');
// create router
const router = express.Router()
// middleware

// route handlers
// (1) - post - create a post using the information sent inside the request body
router.post("/", (req, res) => {
    const newPost = req.body

    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ message: "Please provide a title and content." })
    } else {
        Posts.insert(newPost).then((id) => {
            res.status(201).json(id)
        }).catch((error) => {
            res.status(500).json({ message: "There was an error while saving the post." })
        })
    }
})

// (2) - post - create a new comment for a post
router.post("/:id/comments", (req, res) => {
    const { id } = req.params
    const newComment = { ...req.body, post_id: id }

    // if (!newComment.text) {
    //     res.status(400).json({ message: "Please provide text for the comment." })
    // } else {
    //     Posts.findById(id).then((shape) => {
    //         if (typeof shape === 'array') {
    //             res.status(404).json({ message: "The post with this id could not be found." })
    //         } else {
    //             Posts.insertComment(newComment).then((matchingId) => {
    //                 res.status(201).json(matchingId)
    //             }).catch((error) => {
    //                 res.status(500).json({ message: "The comment could not be saved." })
    //             })
    //         }
    //     }).catch((error) => {
    //         res.status(404).json({ message: "The post with this id could not be found." })
    //     })
    // }

    Posts.findById(id).then((shape) => {
        if (typeof shape === 'array') {
            console.log("this is shape:", shape)
            res.status(404).json({ message: "We could not find a post with this id." })
        } else if (typeof shape === 'object' && !newComment.text) {
            res.status(400).json({ message: "Please provide text for the commnet." })
        } else {
            Posts.insertComment(newComment).then((id) => {
                res.status(201).json(id)
            }).catch((error) => {
                res.status(404).json({ message: "The id did not match any posts." })
            })
        }
    }).catch((error) => {
        res.status(500).json({ message: "The comment could not be saved." })
    })
})
// export
module.exports = router