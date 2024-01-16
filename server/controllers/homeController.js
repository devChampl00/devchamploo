const Post = require('../models/Post')
const capitalize = require('../helpers/capitalize')

const homePage = async (req, res) => {
  try {
    let perPage = 2
    let page = req.query.page || 1

    const { order = null, category = null, tag = null, search = null } = req.query
    const categoryUrl = `${tag ? 'tag=' + tag + '&' : ''}${order ? 'order=' + order + '&' : ''}${search ? 'search=' + search + '&' : ''}`
    const orderUrl = `${tag ? 'tag=' + tag + '&' : ''}${category ? 'category=' + category + '&' : ''}${search ? 'search=' + search + '&' : ''}`
    const pageUrl = `${tag ? 'tag=' + tag + '&' : ''}${order ? 'order=' + order + '&' : ''}${category ? 'category=' + category + '&' : ''}${search ? 'search=' + search + '&' : ''}`

    let match = {}
    if (category && tag) {
      match = {
        category: category,
        keywords: tag
      }
    } else if (category) {
      match = {
        category: category
      }
    } else if (tag) {
      match = {
        keywords: tag
      }
    }

    let searchPosts = null
    let countPosts = 0
    if (search) {
      const searchNoSpecialChar = search.replace(/[^a-zA-Z0-9 ]/g, '')

      countPosts = await Post.find(
        {
          $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            { category: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            { keywords: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            { excerpt: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
          ],
          ...match
        },
        ['_id']
      ).then((data) => data.length)

      searchPosts = await Post.find(
        {
          $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            { category: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            { keywords: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            { excerpt: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
          ],
          ...match
        },
        ['title', 'slug', 'excerpt', 'body', 'image', 'category', 'keywords', 'createdAt'],
        {
          skip: perPage * page - perPage, // Starting Row
          limit: perPage, // Ending Row
          sort: {
            createdAt: order === 'asc' ? 1 : -1 //Sort by Date Added DESC
          }
        }
      ).exec()
    } else {
      countPosts = await Post.aggregate([{ $match: match }]).then((data) => data.length)
    }

    const posts =
      searchPosts ||
      (await Post.aggregate([
        {
          $sort: { createdAt: order === 'asc' ? 1 : -1 }
        },
        {
          $match: match
        }
      ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec())

    const count = countPosts
    const prevPage = parseInt(page) - 1
    const hasPrevPage = !(page <= 1)
    const nextPage = parseInt(page) + 1
    const hasNextPage = nextPage <= Math.ceil(count / perPage)

    const postCategories = await Post.find().then((data) =>
      data
        .filter((x, i, self) => x.category && x.category !== undefined)
        .map((x) => x.category)
        .filter((x, i, self) => self.indexOf(x) === i)
    )

    const locale = {
      title: 'DevCahmploo | Home',
      description: 'DevChamploo is a website that contain things like blogpost or something that author will add later.',
      keywords: 'devchamploo, gper, blog, umam alfarizi, lost people',
      author: 'Umam Alfarizi',
      image: null,
      icon: null,
      name: 'DevChamploo'
    }

    res.render('index', {
      posts,
      postCategories,
      capitalize,
      categoryUrl,
      orderUrl,
      pageUrl,
      current: page,
      prevPage: hasPrevPage ? prevPage : null,
      nextPage: hasNextPage ? nextPage : null,
      order,
      category,
      tag,
      search,
      locale
    })
  } catch (error) {
    console.log(error)
  }
}

const postPage = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })

    const locale = {
      title: `${post.title} - DevChamploo`,
      description: post.excerpt,
      keywords: `${post.keywords.join(', ')}, devchamploo, gper, blog, umam alfarizi, lost people`,
      author: 'Umam Alfarizi',
      image: `/uploads/${post.image}`,
      icon: null,
      name: 'DevChamploo'
    }

    res.render('post', { post, capitalize, locale })
  } catch (error) {
    console.log(error)
  }
}

const aboutPage = (req, res) => {
  const locale = {
    title: 'DevCahmploo | About',
    description: 'DevChamploo is a website that contain things like blogpost or something that author will add later.',
    keywords: 'devchamploo, gper, blog, umam alfarizi, lost people',
    author: 'Umam Alfarizi',
    image: null,
    icon: null,
    name: 'DevChamploo'
  }

  res.render('about', { locale })
}

module.exports = { homePage, postPage, aboutPage }
