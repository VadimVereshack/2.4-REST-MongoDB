import {Request, Response} from 'express'
import {Types} from 'mongoose'
import bcrypt from 'bcryptjs'
import formTodo from '../form/todo'
import FileStore from '../app'
const SALT = 10;

export async function login(req: Request,res: Response){
    const user  = await formTodo.findOne({login: req.body.login});
    if(user && await bcrypt.compare(req.body.pass,String(user.password))){
        FileStore[req.sessionID] = user._id;
        res.send(JSON.stringify({ "ok" : true }));
    } else {
        res.status(404).send(JSON.stringify({ "error": "not found"}));
    }
}

export function logout(req: Request,res: Response){
    req.session.destroy(err=>{})
    res.send(JSON.stringify({ "ok" : true }));
}

export async function register(req:Request ,res :Response){
    if(await formTodo.findOne({login: req.body.login})){
        res.status(400).send(JSON.stringify({ "error": "User already registered"}));
    } else {
        const hashPassword = await bcrypt.hash(req.body.pass,SALT);
        const cadidate = createUser(req.body.login, hashPassword);
        await cadidate.save();
        res.send(JSON.stringify({ "ok" : true }));
    }
}

export async function getItems(req: Request,res: Response){
    const userId = FileStore[req.sessionID];
    if(isLoginAllowed(userId, res)){
        const user = await formTodo.findById(userId);
        res.send(JSON.stringify({items: user?.todos}));
    }
}

export async function postItems(req: Request,res: Response){
    const userId = FileStore[req.sessionID];
    if(isLoginAllowed(userId, res)){
        const todo = {_id: new Types.ObjectId, text: req.body.text, checked: false};
        await formTodo.updateOne(
            { _id: userId},
            { $push: { todos: todo } });
        res.send(JSON.stringify({ "_id": todo._id }));
    }
}

export async function putItems(req: Request,res: Response){
    const userId = FileStore[req.sessionID];
    if(isLoginAllowed(userId, res)){
        const todo = {_id: req.body._id, text: req.body.text, checked: req.body.checked};
        await formTodo.updateOne( { _id : userId, "todos._id": todo._id},
        { $set: { "todos.$": todo } });
        res.send(JSON.stringify({ "ok" : true }));
    }
}

export async function deleteItems(req: Request,res: Response){
    const userId = FileStore[req.sessionID];
    if(isLoginAllowed(userId, res)){
        const idElement = new Types.ObjectId(req.body._id);
        await formTodo.updateOne({_id: userId},
            {$pull: {todos: {_id: idElement}}});
        res.send(JSON.stringify({ "ok" : true }));
    }
}

function createUser(login: String, password: String){
    return new formTodo ({
        login,
        password,
        todos: []
    });
}

function isLoginAllowed(userId: Object, res: Response): boolean{
    if(!userId){
        res.status(403).send(JSON.stringify({ "error": "forbidden"}));
        return false;
    }
    return true;
}