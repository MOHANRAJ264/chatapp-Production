const users = []

const adduser = ({ id, username, room }) => {
    username = username.trim().toLocaleLowerCase()
    room = room.trim().toLocaleLowerCase()

    if (!username || !room) {
        return {
            error: "Username and room are required"
        }
    }
    const exiistinguser = users.find((user) => {
        return user.room === room && user.username === username
    })
    if (exiistinguser) {
        return {
            error: "username is already in use"
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeuser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getuser = (id) => {
    return users.find((user) => user.id === id)
}

const getuserinroom = (room) => {
    room = room.trim().toLocaleLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    adduser,
    removeuser,
    getuser,
    getuserinroom
}