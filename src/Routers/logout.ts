import express, { Router, Request, Response, NextFunction } from 'express';


export const logoutRouter: Router = express.Router();

  logoutRouter.get('/', async (req: Request, res: Response) => {
    if (req.session && req.session.user.id !== null) {
        req.session.destroy(function() {
            res.clearCookie('connect.sid', { path: '/' });
            res.status(200).send('removed session');
        });
    } else {
        res.status(200).send('no session assigned');
    }
  }); 


