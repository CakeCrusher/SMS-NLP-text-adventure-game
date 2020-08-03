const fs = require('fs')

const usersString = fs.readFileSync('./users.json')
const users = JSON.parse(usersString)
const storyString = fs.readFileSync('./story.json')
const story = JSON.parse(storyString)

const allUsers = () => {
    return users
}

const getUser = (id) => {
    if (users[id]) {
        return users[id]
    } else {
        const newUser = {
            name: "John",
            storyLocation:{
                x: "0",
                y: "0"
            },
            scheduled: null,
            started: false
        }
        users[id] = newUser

        return newUser
    }
}

const updateUser = (id, user) => {
    users[id] = user

    fs.writeFile('users.json', JSON.stringify(users), (err, _result) => {
        if (err) console.log(err)
    })

    return user
}

const getStory = () => {
    return story
}

module.exports = {allUsers, getUser, updateUser, getStory}