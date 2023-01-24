import express, {Request, Response} from 'express';
import {login, logout, register, getItems, postItems, putItems, deleteItems} from '../controllers/controller';
const router = express.Router();

router.post("/router", async (req: Request, res: Response)=>{
    switch(req.query.action){
        case "login": 
            login(req,res);
            break;
        case "logout":
            logout(req,res);
            break;
        case "register":
            register(req,res);
            break;
        case "getItems":
            await getItems(req,res);
            break;
        case "deleteItem":
            await deleteItems(req,res);
            break;
        case "createItem":
            await postItems(req,res);
            break;
        case "editItem":
            await putItems(req,res);
            break;
    };
});

export default router;