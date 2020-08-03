const parseMessage = (user, message) => {
    let parsedMessage = message
    if (message.includes('(name)')) {
        const key = '(name)'
        const name = user.name
        const start = message.indexOf(key)
        const end = start + key.length
        parsedMessage = message.slice(0, start) + name + message.slice(end, message.length)
    }

    return parsedMessage
}

module.exports = {parseMessage}