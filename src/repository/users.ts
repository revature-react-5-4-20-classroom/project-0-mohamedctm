import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';




export async function getAllUsers(): Promise<User[]> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try
  {
    let result : QueryResult;
    result = await client.query(
      `select users.userid, users.username, users.firstname, users.lastname,users.email, roles.role
      from project_0_users users join project_0_role roles on users.role = roles.roleId `
    );
    return result.rows.map((u) => {
      return new User(u.userid, u.username, u.password, u.firstname, u.lastname, u.email, u.role);
    });
  }
  catch(e) 
  {
    throw new Error(`Failed to query for all users: ${e.message}`);
  } 
  finally 
  {
    client && client.release();
  }
}

export async function updateUser(username: string,password:string,firstname:string,lastname:string,email:string,roleId:number, userId: number): Promise<string|User> {
    let client : PoolClient;
    client = await connectionPool.connect();
    try
    {
      const updating : QueryResult = await client.query(`
      update project_0_users set username = COALESCE($1, username),"password"= COALESCE($2, password) ,firstname= COALESCE($3, firstname),lastname= COALESCE($4, lastname) ,
       email= COALESCE($5, email),role=COALESCE($6, role) where userId = $7;
      `,[username,password,firstname,lastname,email,roleId, userId]);

      const retrieve : QueryResult = await client.query(`
      SELECT userId,username,"password",firstname,lastname, email,roles.role
      FROM project_0_users users join project_0_role roles on users.role = roles.roleId where userId = $1;
      `,[userId]);

      const check =  retrieve.rows.map(
        (u)=>{return new User(u.userId,u.username,u.password,u.firstname,u.lastname,u.email,u.role )}
      );
      if(updating.rowCount > 0) {
        return check[0];
      } else {
        throw new Error('something went wrong here!');
      }

    }
    catch(e)
    {
      throw new Error(`Can't run the query: ${e.message}`);
    }
    finally
    {
      client && client.release();
    }
}

export async function getUserById(id: number) : Promise<User|string> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try
  {  
      const userdata : QueryResult = await client.query(`
      SELECT userId, username, password,
      firstname, lastname, email, roles.role from
      project_0_users users 
      LEFT JOIN
      project_0_role roles
      ON users.role = roles.roleId where userId = $1`,[id]);
      if(userdata.rowCount > 0){
      return userdata.rows.map(
          (user)=>{return new User(user.userid, user.username, user.password, user.firstname, user.lastname, user.email, user.role)}
      )[0];
      }else{
        return `No such user with id:${id}`;
      }
  }
  catch (e)
  {
    throw new Error(`Can't find user: ${e.message}`);
  }
  finally 
  {
    client && client.release();
  }
}

export async function loguser(username: string, password: string) : Promise<User> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try
  {
    let result : QueryResult;
    result = await client.query(
    `SELECT users.userid, users.username,users.firstname,
    users.lastname, users.password, users.email,roles.role
    FROM project_0_users users 
    INNER JOIN
    project_0_role roles 
    ON users.role = roles.roleId
    WHERE
    users.username = $1 AND users.password = $2;`, [username, password]
    );
    const CHECK = result.rows.map((u) => {
      return new User(u.userid, u.username, u.password, u.firstname, u.lastname, u.email, u.role);
    })
    if(CHECK.length > 0) {
      return CHECK[0];
    } else {
      throw new Error('Username and Password not matched to a valid user');
    }
  } 
  catch (e) 
  {
    throw new Error(`Failed to validate User with DB: ${e.message}`);
  }
  finally
  {
    client && client.release();
  }

  
}
