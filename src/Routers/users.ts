import express, { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { authorized } from '../middleware/authMiddleware';
import { getAllUsers, getUserById, updateUser } from '../repository/users';


export const userRouter: Router = express.Router();

userRouter.post('/', async (req: Request, res: Response) => {
  res.status(400).send("invalid action!");
}); 

userRouter.get('/:id', async (req: Request, res: Response) => {
  const id = +req.params.id;
  if(isNaN(id)){
    res.status(401).send('Must include numeric id in path');
  }
    if(!req.session || !req.session.user) {
      res.status(402).send('Please login here');
    } else {
      const myid = req.session.user.id;
      const myrole = req.session.user.role;
        if(myid === id || myrole === 'finance-manager') {
          res.json(await getUserById(id));
        }else{
          res.status(403).send(`Sorry! finance-manager role is required.`)
        }
      }
});

userRouter.get('/', async (req: Request, res: Response) => {
  if(!req.session || !req.session.user) {
    res.status(402).send('Please login here..');
  } else {
    const myrole = req.session.user.role;
      if(myrole === 'finance-manager') {
        res.json( await getAllUsers());
      }else{
        res.status(403).send(`Sorry! finance-manager role is required.`)
      }
    }
});

userRouter.use(authorized(['admin']));
userRouter.patch('/', async (req: Request, res: Response) => {
  const {username,password,firstname,lastname,email,roleId, userId} = req.body;
  const users : string|User = await updateUser(username,password,firstname,lastname,email,roleId, userId);
  res.json(users);
});


