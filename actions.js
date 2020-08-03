const onAction = (user, body, action) => {
    switch (action) {
        case "set_name":
            user.name = body
            return "name changed"
        default:
            return null
    }
}

module.exports = {onAction}