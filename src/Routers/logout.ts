import express, { Router, Request, Response, NextFunction } from 'express';


export const logoutRouter: Router = express.Router();

  logoutRouter.get('/', async (req: Request, res: Response) => {
      try{
        if(req.session){
            req.session.destroy;
        res.status(201);
        }
      } catch (e) {
        console.log(e.message);
        res.status(401).json({"error":"can delete session"});

      } 
  }); 


