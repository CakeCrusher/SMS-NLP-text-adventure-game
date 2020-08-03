const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const client = require('twilio')(
    'ACc0cfe70ac6afd30408d9c02272eccdb1',
    '9993e588050ea136c97c6b570c8c417d'
)
const {allUsers, getUser, updateUser, getStory} = require('./controler.js')
const {game} = require('./game.js')

const story = getStory()

let count = 0
setInterval(() => {
    const now = new Date()

    const users = allUsers()
    const userKeys = Object.keys(users)
    userKeys.forEach(async key => {
        const userInfo = users[key]
        if (userInfo.scheduled) {
            const timeTrigger = new Date(userInfo.scheduled.time)
            if (timeTrigger.getYear() === now.getYear() && timeTrigger.getMonth() === now.getMonth() && timeTrigger.getDay() === now.getDay() && timeTrigger.getHours() === now.getHours() && timeTrigger.getMinutes() === now.getMinutes() && timeTrigger.getSeconds() === now.getSeconds()) {
                console.log('triggered')
                const body = userInfo.scheduled.messagesSent.length ? 
                    userInfo.scheduled.messagesSent[userInfo.scheduled.messagesSent.length - 1]
                    : ''
                let userData = await game(userInfo, body, story, 'trigger_schedule')
                const response = await client.messages.create({
                    from: '+12058905680',
                    to: key,
                    body: userData.message
                })
                console.log(userData.message)
                updateUser(key, userData.user)
            }
        }
    })
    count = count + 1
    console.log(count)
}, 1000)




const app = express()
app.use(bodyParser.urlencoded({extended: false}))

app.post('/', async (req, res) => {
    const twiml = new MessagingResponse
    const message = twiml.message()
    
    // console.log('processing...')
    // let user = getUser(req.body.From)
    // let userData = await game(user, req.body.Body.toLowerCase(), story, 'regular')
    // const updatedUser = updateUser(req.body.From, userData.user)

    console.log(req.query)
    let user = getUser(req.query.From)
    let userData = await game(user, req.query.Body.toLowerCase(), story, 'regular')
    const updatedUser = updateUser(req.query.From, userData.user)

    if (userData.message) {
        message.body(userData.message)
        console.log(userData.message)
    }

    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
})

http.createServer(app).listen(4000, () => {
    console.log('Server running on port 4000')
})