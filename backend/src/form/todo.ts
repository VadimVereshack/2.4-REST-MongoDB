import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bodySchema = new Schema({
    login: String,
    password: String,
    todos: [{
        _id: mongoose.Types.ObjectId,
        text: String,
        checked: Boolean
    }]
})

export default mongoose.model(`user`, bodySchema);