/* you need to import this file */

create table project_0_role
(
  roleId int  primary key,
  "role" text not null UNIQUE
);

create table Project_0_reimbursement_status
(
  statusId int primary key,
  status text not null UNIQUE
);

create table Project_0_reimbursement_type
(
  typeId int primary key,
  "type" text not null UNIQUE
);

insert into project_0_role values(1,'admin');
insert into project_0_role values(2,'finance-manager');
insert into project_0_role values(3,'employee');

insert into project_0_reimbursement_status values(1,'pending');
insert into  project_0_reimbursement_status values(2,'aproved');
insert into  project_0_reimbursement_status values(3,'denied');

insert into  project_0_reimbursement_type values (1,'Food');
insert into  project_0_reimbursement_type values (2,'Travel');
insert into  project_0_reimbursement_type values (3,'Housing');
insert into  project_0_reimbursement_type values (4,'Other');

create table project_0_users
(
  userId integer PRIMARY KEY,
  username text  not null UNIQUE,
  "password" text not null,
  firstName varchar (25) not null,
  lastName varchar (25) not null,
  email text not null,
  "role" integer references project_0_role(roleid) not null
);

insert into project_0_users values(1,'shadow','123','mohamed','ahmed','email1',1);
insert into project_0_users values(2,'finance','123','smith','jeff','email2',2);
insert into project_0_users values(3,'employee1','123','jhon','due','email3',3);
insert into project_0_users values(4,'employee2','123','jessica','allan','email4',3);

create table Project_0_reimbursement
(
  reimbursementId int primary key,
  author int references Project_0_users(userId) not null,
  amount int not null,
  dateSubmitted int not null,
  dateResolved int not null,
  description text not null,
  resolver int references Project_0_users(userId),
  status int references Project_0_reimbursement_status(statusId) not null,
  "type" int references Project_0_reimbursement_type(typeId) not null
);