import express, { Router, Request, Response, NextFunction } from 'express';
import {loguser} from '../repository/users';


export const loginRouter: Router = express.Router();

  loginRouter.post('/', async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const {username, password} = req.body;
    if(!username || !password) 
    res.status(400).json({"error":"username and password are required fields for login"});
      try {
        const userDetails = await loguser(username, password);
        if(req.session)  req.session.user = userDetails; // =>response with json(loged in userDetails)
        res.json(userDetails);
      } catch (e) {
        console.log(e.message);
        res.status(400).json({"error":"invalid Credentials"});

      } 
  }); 


