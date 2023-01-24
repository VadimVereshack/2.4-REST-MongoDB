import mongoose from 'mongoose'
const url = `mongodb+srv://Vadim:pass123@cluster0.oj5elvv.mongodb.net/Database?retryWrites=true&w=majority`


export default mongoose.connect(url)
    .then(() => {console.log("Connected DataBase")})
    .catch((err: Error)=>{console.log(err)});