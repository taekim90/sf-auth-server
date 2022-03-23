const express = require('express')
const router = express.Router()
// multipart form data package
const multer = require('multer')
// cloudinary npm package to manage uploads
const cloudinary = require('cloudinary').v2
// utility for deleting files
const { unlinkSync } = require('fs')

// config for multer --- tell it about the static folder
const uploads = multer({ dest: 'uploads/'}) // this is a middleware

// GET /images -- READ all images (maybe for a user)
router.get('/', (req, res) => {
    res.send('get all images')
})

// POST /images -- CREATE an image
// uploads.method('key in the body')
router.post('/', uploads.single('image'), async (req, res) => {
    try {
        // handle upload errors
        if (!req.file) return res.status(400).json({ msg: 'no file uploaded' })
        // console.log(req.file)
        // upload to cloudinary
        const cloudImageData = await cloudinary.uploader.upload(req.file.path)
        console.log(cloudImageData)
        console.log(cloudImageData) // original can be saved in the db
        // png that can be manipulated -- save to the db
        // url - `https://res.cloudinary.com/<server>/image/upload/v1593119998/${cloudImageData.public_id}.png`
        // server is your specific Cloud Name from cloudinary
        // cloudImageData.public_id save this to the database! you can also save the original if you want the original
        const cloudImage = `https://res.cloudinary.com/dgrzddrwm/image/upload/v1593119998/${cloudImageData.public_id}.png`
        // delete the file so it doesn't clutter up the server folder
        unlinkSync(req.file.path)
        // maybe we should save something in the db ???
        // send image back
        // res.json({ file: req.file })
        res.json({ cloudImage })
        // res.send('upload an image')
    } catch (err) {
        console.log(err)
        res.status(503).json({ msg: 'you should look at the server console' })
    }
})

module.exports = router