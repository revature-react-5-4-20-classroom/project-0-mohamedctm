import express, { Router, Request, Response, NextFunction } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { authorized } from '../middleware/authMiddleware';
import { getAll, getByStatus, getByuserId, create, updateReimbursements } from '../repository/reimbursements';


export const reimbursementsRouter: Router = express.Router();


reimbursementsRouter.get('/status/:statusId', async (req: Request, res: Response)=>{
  const id = +req.params.statusId;
  if(isNaN(id)){
    res.status(400).send('Must include numeric statusId in url');
  }
    if(!req.session || !req.session.user) {
      res.status(401).send('Please login here');
    } else {
      const myrole = req.session.user.role;
        if(myrole === 'finance-manager') {
          res.json(await getByStatus(id));
        }else{
          res.status(401).send(`Sorry! finance-manager role is required.`)
        }
      }
});

reimbursementsRouter.get('/author/userid/:userId', async (req: Request, res: Response)=>{
    const id = +req.params.userId;
    if(isNaN(id)){
      res.json('Must include numeric userId in url');
    }
      if(!req.session || !req.session.user) {
        res.status(401).send('Please login here');
      } else {
        const myid = req.session.user.id;
        const myrole = req.session.user.role;
          if(myrole === 'finance-manager' || myid === id ) {
              const result: string|Reimbursement[] = await getByuserId(id);
              // if(typeof(result) === "string"){
              //   res.status(405).send('No data')
              // }else{
            res.json(result);
          // }
          }else{
            res.status(401).send(`Sorry! finance-manager role is required.`)
          }
        }
  });

reimbursementsRouter.get('/', async (req: Request, res: Response) => {
  if(!req.session || !req.session.user) {
    res.status(402).send('Please login here');
  } else {
    const myrole = req.session.user.role;
      if(myrole === 'finance-manager') {
        res.json( await getAll());
      }else{
        res.status(403).send(`Sorry! finance-manager role is required.`)
      }
    }
});


reimbursementsRouter.post('/', async (req: Request, res: Response)=>{
    if(!req.session || !req.session.user) {
        res.status(402).send('Please login here');
      }else{
        const myid = req.session.user.id;
        const {amount,description,type} = req.body;
        if(myid === null){
            res.status(401).send(`${myid} -- null`)
        }else{
        const users : string|Reimbursement = await create(myid,amount,description,type);
        res.json(users);
        }
      }
 
});

// reimbursementsRouter.use(authorized(['finance-manager']));
reimbursementsRouter.patch('/', async (req: Request, res: Response) => {
  const {reimbursementid,author,amount,description,status,type} = req.body;
  if(!req.session || !req.session.user) {
    res.status(402).send('Please login here');
  } else {
    const myrole = req.session.user.role;
    const myid = req.session.user.id;
      if(myrole === 'finance-manager') {
        if(reimbursementid === null || isNaN(reimbursementid)){
            res.status(401).send( `reimbursement 'id' is required and has to be a number`);
            }else{
            const users : string|Reimbursement = await updateReimbursements(reimbursementid,author,amount,description,myid,status,type);
            res.json(users);
            }
      }else{
        res.status(403).send(`Sorry! finance-manager role is required.`)
      }
    } 
});


