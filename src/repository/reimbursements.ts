import { Reimbursement } from '../models/Reimbursement';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';




export async function getAll(): Promise<Reimbursement[]> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try
  {
    let result : QueryResult;
    result = await client.query(
      `SELECT reimbursementid,t5.username,amount,datesubmitted,dateresolved,description, t4.firstname,t2.status,t3.type
      FROM project_0_reimbursement t1 
      join project_0_reimbursement_status t2 on t1.status = t2.statusid
      join project_0_reimbursement_type t3 on t1.type = t3.typeid 
      join project_0_users t4 on t1.resolver = t4.userid 
      join project_0_users t5 on t1.author = t5.userid 
      order by reimbursementid desc`
    );
    return result.rows.map((r) => {
      return new Reimbursement(r.reimbursementid,r.username,r.amount,r.dateSubmitted,r.dateResolved,r.description, r.firstname,r.status,r.type);
    });
  }
  catch(e) 
  {
    throw new Error(`Failed to fetch from reimbursement: ${e.message}`);
  } 
  finally 
  {
    client && client.release();
  }
}

export async function create(id:number,amount:number,description:string, type:number): Promise<Reimbursement> {
    let client : PoolClient;
    client = await connectionPool.connect();
    try
    {
      const updating : QueryResult = await client.query(`
      INSERT INTO project_0_reimbursement VALUES(DEFAULT,$1,$2,DEFAULT,DEFAULT,$3,0,1,$4)
      `,[id,amount,description,type]);

        
      const retrieve : QueryResult = await client.query(`
      SELECT reimbursementid,t5.username,amount,datesubmitted,dateresolved,description, t4.firstname,t2.status,t3.type
      FROM project_0_reimbursement t1 
      join project_0_reimbursement_status t2 on t1.status = t2.statusid
      join project_0_reimbursement_type t3 on t1.type = t3.typeid 
      join project_0_users t4 on t1.resolver = t4.userid 
      join project_0_users t5 on t1.author = t5.userid 
      order by reimbursementid desc limit 1 offset 0;
      `);

      const check =  retrieve.rows.map(
        (r)=>{return new Reimbursement(r.reimbursementid,r.username,r.amount,r.datesubmitted,r.dateresolved,r.description, r.firstname,r.status,r.type)}
      );
      if(updating.rowCount > 0) {
        return check[0];
      } else {
        throw new Error('something went wrong here!');
      }

    }
    catch(e)
    {
      throw new Error(`Can't run the reimbursement query: ${e.message}`);
    }
    finally
    {
      client && client.release();
    }
}

export async function getByStatus(id: number) : Promise<Reimbursement[] | string> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try
  {  
      const userdata : QueryResult = await client.query(`
      SELECT reimbursementid,t5.username,amount,datesubmitted,dateresolved,description, t4.firstname,t2.status,t3.type
      FROM project_0_reimbursement t1 
      join project_0_reimbursement_status t2 on t1.status = t2.statusid
      join project_0_reimbursement_type t3 on t1.type = t3.typeid
      join project_0_users t4 on t1.resolver = t4.userid
      join project_0_users t5 on t1.author = t5.userid 
      where t1.status=$1
      order by datesubmitted asc;`,[id]);
      const result =  userdata.rows.map(
        (r)=>{return new Reimbursement(r.reimbursementid,r.username,r.amount,r.datesubmitted,r.dateresolved,r.description, r.firstname,r.status,r.type)}
      );
      if(userdata.rowCount > 0){
          return result;
      }else{ return `Nothing to show at thie time`;}
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

export async function getByuserId(id: number) : Promise<Reimbursement[] | string> {
    let client : PoolClient;
    client = await connectionPool.connect();
    try
    {  
        
        const userdata : QueryResult = await client.query(`
        SELECT reimbursementid,t5.username,amount,datesubmitted,dateresolved,description, t4.firstname,t2.status,t3.type
        FROM project_0_reimbursement t1 
        join project_0_reimbursement_status t2 on t1.status = t2.statusid
        join project_0_reimbursement_type t3 on t1.type = t3.typeid
        join project_0_users t4 on t1.resolver = t4.userid
        join project_0_users t5 on t1.author = t5.userid 
        where t1.author=$1
        order by datesubmitted asc;`,[id]);
        if(userdata.rowCount > 0){
        return userdata.rows.map(
          (r)=>{return new Reimbursement(r.reimbursementid,r.username,r.amount,r.datesubmitted,r.dateresolved,r.description, r.firstname,r.status,r.type)}
        );
        }else{
            return `This user doesn't have any reimbursement. please try a different user`;
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



  export async function updateReimbursements(reimbursementid:number,author:number,amount:number,
    description:string, resolver:number, status:number,type:number): Promise<string|Reimbursement>{
       
    let client : PoolClient;
    client = await connectionPool.connect();
    try
    {
        const checking : QueryResult = await client.query(`
      select * from project_0_reimbursement where reimbursementid = $1;
      `,[reimbursementid]);
        if(checking.rowCount <= 0 ){
            return `reimbursement with id:${reimbursementid} doesn't exist! please try again`;
        }
      const updating : QueryResult = await client.query(`
      update project_0_reimbursement set "author"= COALESCE($1, author) ,
      amount= COALESCE($2, amount),
      dateresolved= default,description=COALESCE($3, description),
      resolver= COALESCE($4, resolver),status= COALESCE($5, status),type=COALESCE($6, type) where reimbursementid = $7;
      `,[author,amount,description,resolver,status,type,reimbursementid]);

      const retrieve : QueryResult = await client.query(`
      SELECT reimbursementid,t5.username,amount,datesubmitted,dateresolved,description, t4.firstname,t2.status,t3.type
        FROM project_0_reimbursement t1 
        join project_0_reimbursement_status t2 on t1.status = t2.statusid
        join project_0_reimbursement_type t3 on t1.type = t3.typeid
        join project_0_users t4 on t1.resolver = t4.userid
        join project_0_users t5 on t1.author = t5.userid 
        where t1.reimbursementid=$1
        order by datesubmitted asc;
      `,[reimbursementid]);

      const check =  retrieve.rows.map(
        (r)=>{return new Reimbursement(r.reimbursementid,r.username,r.amount,r.datesubmitted,r.dateresolved,r.description, r.firstname,r.status,r.type)}
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

