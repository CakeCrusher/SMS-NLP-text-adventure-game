const {getIntent} = require('./nlp.js')
const {onAction} = require('./actions.js')
const {parseMessage} = require('./messageParser.js')

const setSchedule = (user, schedule) => {
    if (!user.scheduled && schedule) {
        const now = new Date()
        const scheduleToSet = {
            time: new Date(now.getTime() + Number(schedule.fromNow)),
            messagesSent: []
        }
        user.scheduled = scheduleToSet
        console.log('set schedule')
    }
}

const game = async (user, body, story, type) => {
    const x = user.storyLocation.x
    const y = user.storyLocation.y
    setSchedule(user, story[x][y].schedule)
    if (!user.started) {
        user.started = true

        const message = parseMessage(user, story[x][y].reply)

        return {user, message}
    } else if (user.scheduled && !(type === 'trigger_schedule')) {
        user.scheduled.messagesSent.push(body)
        
        const message = null
        
        return {user, message}
    } else {
        console.log('On regular')
        const actionResult = onAction(user, body, story[x][y].action)
        const intent = await getIntent(body, story[x][y].nlpData)
        let message = null

        let intentAction = null

        if (!story[x][y].nlpData) {
            intentAction = story[x][y].options[0]
        } else {
            if (intent) {
                intentAction = story[x][y].options.find(o => o.intent === intent)
            } else {
                message = parseMessage(user, story[x][y].alternateResponse.unclear)

                return {user, message}
            }
        }

        user.storyLocation = intentAction.advance
        setSchedule(user, story[intentAction.advance.x][intentAction.advance.y].schedule)
        message = parseMessage(user, story[intentAction.advance.x][intentAction.advance.y].reply)
        
        if (user.scheduled && new Date(user.scheduled.time) <= new Date()) {
            user.scheduled = null
        }

        return {user, message}
    }
}

module.exports = {game}

