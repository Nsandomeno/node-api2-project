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

// (3) - get - returns array of all post objects
router.get("/", (req,res) => {
    Posts.find().then((posts) => {
        res.status(200).json(posts)
    }).catch((error) => {
        res.status(500).json({ message:"Posts information could not be retrieved." })
    })
})

// (4) - get - returns individual post object by id
router.get("/:id", (req, res) => {
    const { id } = req.params
    
    Posts.findById(id).then((shape) => {
        if (shape.length === 0) {
            res.status(404).json({ message: "A post with this id could not be found." })
        } else {
            res.status(200).json(shape)
        }
    }).catch((error) => {
        res.status(500).json({ message:"The post information could not be retrieved." })
    })
})

// (5) - get - returns comments for a given post
router.get("/:id/comments", (req, res) => {
    const { id } = req.params

    Posts.findById(id).then((shape) =>{
        if (shape.length === 0) {
            res.status(404).json({ message: "No post with this id could be found." })
        } else {
            Posts.findPostComments(id).then((comments) => {
                res.status(200).json(comments)
            }).catch((error) => {
                res.status(500).json({ message: "The Post info could not be retrieved." })
            })
        }
    }).catch((error) => {
        res.status(500).json({ message: "The post info could not be retrived." })
    })
})

// export
module.exports = router