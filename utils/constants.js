exports.defaults = {
    pagination: {
        page: 1,
        limit: 10
    },
    UPLOAD_DIR: './public/uploads'
}

exports.message = {

    type: ['audio', 'photo', 'doc', 'video','text','group'],
    audio:'audio',
    photo:'photo',
    doc:'doc',
    video:'video',
    text:'text'

} 
exports.mimeType ={
    image:['jpeg','jpg','png','gif','bmp','tiff','tif','svg','webp','heif','heic'],
    video:['mp4','webm','ogv','ogg','avi','mov','mpeg','mpg']
}