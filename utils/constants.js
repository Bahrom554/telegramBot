exports.defaults = {
    pagination: {
        page: 1,
        limit: 10
    },
    UPLOAD_DIR: './public/uploads'
}

exports.message = {

    type: ['audio', 'photo', 'doc', 'video', 'group','text'],
    audio:'audio',
    photo:'photo',
    doc:'doc',
    video:'video',
    group:'group',
    text:'text'

} 