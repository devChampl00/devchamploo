const Post = require('../models/Post')
const slug = require('../helpers/slug')
const { unlink } = require('node:fs/promises')
const dashboardLayout = '../views/layouts/dashboard'
const capitalize = require('../helpers/capitalize')

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([{ $sort: { createdAt: -1 } }])

    res.render('dashboard/posts/index', { posts, layout: dashboardLayout, postPage: true })
  } catch (error) {
    console.log(error)
  }
}

const getOnePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })

    res.render('dashboard/posts/detail', { post, layout: dashboardLayout, postPage: true, capitalize })
  } catch (error) {
    console.log(error)
  }
}

const createPostPage = async (req, res) => {
  try {
    const posts = await Post.find()
    const postCategories = posts
      .filter((x, i, self) => x.category && x.category !== undefined)
      .map((x) => x.category)
      .filter((x, i, self) => self.indexOf(x) === i)

    res.render('dashboard/posts/create', { postCategories, layout: dashboardLayout, postPage: true, capitalize })
  } catch (error) {
    console.log(error)
  }
}

const storePost = async (req, res) => {
  let category = null
  try {
    if (req.body.category.length) {
      category = req.body.category.toLowerCase()
    } else if (req.body['new-category'].length) {
      category = req.body['new-category'].toLowerCase()
    }

    const newPost = new Post({
      title: req.body.title,
      slug: slug(req.body.title),
      image: req.file ? req.file.filename : null,
      category: category,
      keywords: req.body.keywords ? req.body.keywords.split(',').map((x) => x.replaceAll(' ', '')) : [],
      excerpt: req.body.excerpt,
      body: req.body.body
    })

    const result = await Post.create(newPost)
    // console.log(result)
    res.send(`
      <script>
        alert('New post created successfully!');
        window.location.href = '/dashboard/posts';
      </script>
    `)
  } catch (error) {
    console.log(error)
  }
}

const editPostPage = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
    if (!post) {
      return res.status(401).json({ message: 'Post not found' })
    }

    const posts = await Post.find()
    const postCategories = posts
      .filter((x, i, self) => x.category && x.category !== undefined)
      .map((x) => x.category)
      .filter((x, i, self) => self.indexOf(x) === i)

    res.render('dashboard/posts/edit', { post, postCategories, layout: dashboardLayout, postPage: true, capitalize })
  } catch (error) {
    console.log(error)
  }
}

const updatePost = async (req, res) => {
  try {
    let category = null
    if (req.body['new-category'].length) {
      category = req.body['new-category'].toLowerCase()
    } else if (req.body.category.length) {
      category = req.body.category.toLowerCase()
    }

    const newPost = {
      title: req.body.title,
      slug: slug(req.body.title),
      image: req.file ? req.file.filename : null,
      category: category,
      keywords: req.body.keywords ? req.body.keywords.split(',').map((x) => x.replaceAll(' ', '')) : [],
      updatedAt: new Date().toISOString(),
      excerpt: req.body.excerpt,
      body: req.body.body
    }

    if (newPost.image) {
      if (req.body['old-image']) await unlink('public/uploads/' + req.body['old-image'])
    } else {
      if (req.body['old-image']) newPost.image = req.body['old-image']
    }

    const result = await Post.findByIdAndUpdate(req.params.id, newPost)
    // console.log(result)
    res.send(`
      <script>
        alert('Post updated successfully!');
        window.location.href = '/dashboard/posts';
      </script>
    `)
  } catch (error) {
    console.log(error)
  }
}

const deletePost = async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.id)
    if (req.body['old-image']) {
      await unlink('public/uploads/' + req.body['old-image'])
    }

    // console.log(result)
    res.send(`
      <script>
        alert('Post deleted successfully!');
        window.location.href = '/dashboard/posts';
      </script>
    `)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getAllPosts, getOnePost, createPostPage, storePost, editPostPage, updatePost, deletePost }
