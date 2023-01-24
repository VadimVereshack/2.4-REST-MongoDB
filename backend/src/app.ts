import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import routerV1 from './routs/v1';
import routerV2 from './routs/v2';
import './connectMongo';
const PORT = 3005;
const app = express();
const FileStore = require('session-file-store')(session);
export default FileStore;

app.use(session({
  store: new FileStore({}),
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));
app.use(cors({
  origin: "http://localhost:5000",
  credentials: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(`/api/v1`,routerV1);
app.use(`/api/v2`,routerV2);

app.listen(PORT,()=>{
  console.log(`Server running on port: ${PORT}..`);
})