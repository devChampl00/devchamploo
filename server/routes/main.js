const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { homePage, postPage, aboutPage } = require('../controllers/homeController')
const { loginPage, loginPost, logout } = require('../controllers/authController')
const { getAllPosts, getOnePost, createPostPage, storePost, editPostPage, updatePost, deletePost } = require('../controllers/postController')

// Home
router.get('/', homePage)
router.get('/blog/:slug', postPage)
router.get('/about', aboutPage)

// Auth
router.get('/login', loginPage)
router.post('/login', loginPost)
router.get('/logout', logout)

// Dashboard
router.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard/index', { layout: '../views/layouts/dashboard', postPage: false })
})
router.get('/dashboard/posts', authMiddleware, getAllPosts)
router.get('/dashboard/posts/:id/detail', authMiddleware, getOnePost)
router.get('/dashboard/posts/create', authMiddleware, createPostPage)
router.post('/dashboard/posts', authMiddleware, storePost)
router.get('/dashboard/posts/:id/edit', authMiddleware, editPostPage)
router.put('/dashboard/posts/:id', authMiddleware, updatePost)
router.delete('/dashboard/posts/:id', authMiddleware, deletePost)

module.exports = router
