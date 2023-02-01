const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const conversationRoute = require('./routes/conversations')
const messageRoute = require('./routes/messages')
const multer = require('multer')
const path = require('path')

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("connect mongodb")
})

app.use('/images', express.static(path.join(__dirname, "public/images")))


//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/images")
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})


const types = ['public/images/png', 'public/images/jpeg', 'public/images/jpg']

const filterFile = (req, file, cb) => {
    if(types.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


const upload = multer({storage, filterFile})

app.post('/api/upload', upload.single('file'), (req, res) => {
    try{
        return res.status(200).json('File uploaded successfully')
    } catch (e){
        console.log(e)
    }

})


app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/message', messageRoute)


app.listen(8800, () => {
    console.log('backend server is running')
})