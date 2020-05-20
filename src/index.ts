import {Application} from 'express'
import express from 'express'
import { userRouter } from "./Routers/users";
import { loginRouter } from "./Routers/login";
import { reimbursementsRouter } from './Routers/reimbursements'
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import bodyParser from 'body-parser';

require('dotenv').config();


const app: Application = express();

app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(loggingMiddleware);


app.use('/users', userRouter);
app.use('/reimbursements', reimbursementsRouter);
app.use('/login', loginRouter);

app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/index.ejs',{});
})


const port = process.env.port||3000

app.listen(port, ()=>{
    console.log(`app listening port: ${port}`);
})