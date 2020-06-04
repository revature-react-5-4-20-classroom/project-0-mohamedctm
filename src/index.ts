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
import {corsFilter} from './middleware/corsFilter';
var cors = require('cors');




require('dotenv').config();


const app: Application = express();





// app.use(cors({
//   credentials: true,
//   origin: 'http://localhost:3000|http://react-app-2.s3-website-us-east-1.amazonaws.com'
// }));
app.use(corsFilter);
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(loggingMiddleware);


//checking webhokk
// const user = process.env.PG_HOST|| 'NOT ASSIGNED'
app.get('/test',(req,res)=>{
  res.status(202).json({"message":"works"});
});
// app.use(cors);

app.use('/users', userRouter);
//something more
app.use('/reimbursements', reimbursementsRouter);
app.use('/login', loginRouter);

app.use('/users', userRouter);




const port = process.env.port||3000
app.listen(3000, () => {
    // The following involves 3 different async steps.  Right now we're in a callback
    // function that runs asynchronously when the express application starts.
    // In this callback, we connect to the database, which is asynchronous, so we specify
    // a callback for that.  In that callback, we query the database, which is asynchronous,
    // so we specify a callback for it too.
    // One of the reasons async/await was added to JS was to avoid "callback hell"
    console.log("app has started, testing connection:");
    // connectionPool.connect() returns a Promise of a PoolClient
    // we specify functionality for when the PoolClient arrives via callbacks:
    // .then(onSuccess) specifies behaviour when the Promise resolves successfully
    // .catch(onFailure) specifies behaviour when the Promise is rejected (fails).
    connectionPool.connect().then(
      (client: PoolClient)=>{
        console.log('connected');
        // try to query tracks
        // client.query returns a Promise of a query result
        client.query('SELECT * FROM project_0_users;').then(
          (result : QueryResult) => {
            console.log(result.rows[0]);
          }
        )
    }).catch((err)=>{
      console.error(err.message);
    })
  });