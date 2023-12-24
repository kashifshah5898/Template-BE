const mongoose = require('mongoose')

const AlbumSchema = mongoose.Schema({
    title: { type: String, required: [true, 'Title Required'] },
    cover_small: { type: String, required: [true, 'Cover Required'] },
    genre: { type: String, required: [true, 'Genre Required'] },
    link: { type: String, required: [true, 'Link Required'] }, //preview
    artist: { type: mongoose.Types.ObjectId, ref: 'Users', required: [true, 'Artist Required'] },
    duration: { type: Number, required: [true, 'Duration Required'] },

}, { timestamps: true })


module.exports = mongoose.model('Albums', AlbumSchema)