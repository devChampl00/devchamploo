// const { fileTypeFromFile } = require('file-type')
// const { TYPE_IMAGE } = require('./uploadFile')
// const { unlink, access } = require('node:fs/promises')

// const checkFile = async (path) => {
//   try {
//     await access(path)
//     return true
//   } catch {
//     return false
//   }
// }

// module.exports = checkFileType = async (req, res, next) => {
//   const { path } = req.file
//   const acceptMime = Object.keys(TYPE_IMAGE)
//   const fileType = await fileTypeFromFile(path)

//   if (!acceptMime.includes(file.mimetype)) {
//     const isExistFile = checkFile(path)
//     if (isExistFile) {
//       await unlink(path)
//     }
//     res.status(500).json({ message: 'File is not image' })
//   }

//   next()
// }
