import {Response, Request, Application} from 'express'
import express from 'express'
import { userRouter } from "./Routers/users";
import { loginRouter } from "./Routers/login";
import { reimbursementsRouter } from './Routers/reimbursements'
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import bodyParser from 'body-parser';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from './repository';



require('dotenv').config();


const app: Application = express();

//checking webhokk
app.get('/test',(req:Request, res:Response)=>{
    res.send(' WebHook works!');

});

app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(loggingMiddleware);


app.use('/users', userRouter);
//something more
app.use('/reimbursements', reimbursementsRouter);
app.use('/login', loginRouter);

app.use('/users', userRouter);




const port = process.env.port||3000

app.listen(port, ()=>{
    console.log(`app listening port: ${port}`);
    connectionPool.connect().then(
        (client: PoolClient)=>{
          console.log('connected');
          // try to query tracks
          // client.query returns a Promise of a query result
          client.query('SELECT * FROM project-0-users;').then(
            (result : QueryResult) => {
              console.log(result.rows[0]);
            }
          )
      }).catch((err)=>{
        console.error(err.message);
      })

})