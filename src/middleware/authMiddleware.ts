import {Request, Response, NextFunction} from 'express';

// Right now, we just have 'Admin' role.  Let's make sure the logged in user
// is an 'Admin' before responding at any /users endpoints


export function authorized(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if(!req.session || !req.session.user) {
      res.status(401).send('Please login');
    } else {
      let allowed = false;
      for(let role of roles) {
        if(req.session.user.role === role) {
          allowed = true;
        }
      }
      if(allowed) {
        next();
      } else {
        res.status(403).send(`Not authorized with role: ${req.session.user.role}`);
      }
    }
  }
}


export const authReadOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if(req.method === 'GET') {
    next();
  } else if(!req.session || !req.session.user) {
    res.status(401).send(`Cannot ${req.method} unless you first login`);
  } else {
    next();
  }
}