create database wilddb;
　
use wilddb;
　
create table Opportunity
(
  OpportunityID varchar(255) not null,
  ClosingDate datetime,
  ScoringCategoryBlob blob,
  LeadEvaluatorID int not null,
  `Name` varchar(255) null,
  LowestBid decimal null,
  MinimumScore decimal null,
  `Status` varchar(255) null,
  Description varchar(255) null,
  CategoryID int null,
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (OpportunityID)
);
　
create table OppCategory
(
  CategoryID int not null,
  `Name` varchar(255) null,
  PRIMARY KEY (CategoryID)
);
　
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (0, 'None');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (1, 'Actuarial Services');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (2, 'Architecture & Engineering');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (3, 'Construction');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (4, 'Consulting');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (5, 'Health');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (6, 'Information Technology');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (7, 'Investments (Non-manager)'); 
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (8, 'Legal Services - Outside Counsel');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (9, 'Mailing');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (10, 'Miscellaneous');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (11, 'Photography/Video Services');
INSERT INTO OppCategory (CategoryID, `Name`) VALUES (12, 'Printing/Reproduction/Graphic Design');
　
create table OppStatus
(
  StatusID int not null,
  `Name` varchar(255) null,
  PRIMARY KEY (StatusID)
);
　
INSERT INTO OppStatus (StatusID, `Name`) VALUES (0, 'New');
/*INSERT INTO OppStatus (StatusID, `Name`) VALUES (1, 'In Review');  Need to delete. */
/*INSERT INTO OppStatus (StatusID, `Name`) VALUES (2, 'Approved');  Need to delete. */
/*DELETE FROM OppStatus WHERE StatusID in (1,2); */
　
INSERT INTO OppStatus (StatusID, `Name`) VALUES (3, 'Published');
INSERT INTO OppStatus (StatusID, `Name`) VALUES (4, 'Eval 1 Closed');
INSERT INTO OppStatus (StatusID, `Name`) VALUES (5, 'Eval 2 Closed');
INSERT INTO OppStatus (StatusID, `Name`) VALUES (6, 'Closed');
INSERT INTO OppStatus (StatusID, `Name`) VALUES (7, 'Ready for Review'); /* Add new Statuses */
INSERT INTO OppStatus (StatusID, `Name`) VALUES (8, 'Ready for Approval'); /* Add new Statuses */
INSERT INTO OppStatus (StatusID, `Name`) VALUES (9, 'Modify'); /* Add new Statuses */
　
create table ProposalStatus
(
  StatusID int not null,
  `Name` varchar(255) null,
  PRIMARY KEY (StatusID)
);
　
INSERT INTO ProposalStatus (StatusID, `Name`) VALUES (0, 'Evaluation 1 Rejected');
INSERT INTO ProposalStatus (StatusID, `Name`) VALUES (1, 'Evaluation 1 Accepted');
/*
UPDATE ProposalStatus SET `Name` = 'Evaluation 1 Rejected' WHERE StatusID = 0;
UPDATE ProposalStatus SET `Name` = 'Evaluation 1 Accepted' WHERE StatusID = 1;
*/
INSERT INTO ProposalStatus (StatusID, `Name`) VALUES (2, 'Seeking Clarification');
INSERT INTO ProposalStatus (StatusID, `Name`) VALUES (3, 'In Progress');
INSERT INTO ProposalStatus (StatusID, `Name`) VALUES (4, 'Open');
INSERT INTO ProposalStatus (StatusID, `Name`) VALUES (5, 'Clarification Received');
　
INSERT INTO ProposalStatus (StatusID, `Name`) VALUES (6, 'Evaluation 2 Rejected');
INSERT INTO ProposalStatus (StatusID, `Name`) VALUES (7, 'Evaluation 2 Accepted');
　
create table Roles
(
  RoleID int not null,
  `Name` varchar(255) null,
  PRIMARY KEY (RoleID)
);
　
INSERT INTO Roles (RoleID, `Name`) VALUES (0, 'Author');
INSERT INTO Roles (RoleID, `Name`) VALUES (1, 'Reviewer');
INSERT INTO Roles (RoleID, `Name`) VALUES (2, 'Approver');
INSERT INTO Roles (RoleID, `Name`) VALUES (3, 'Lead Evaluator');
INSERT INTO Roles (RoleID, `Name`) VALUES (4, 'Preliminary Evaluator');
INSERT INTO Roles (RoleID, `Name`) VALUES (5, 'Secondary Evaluator');
　
　
create table ScoringCriteriaBlob
(
  OpportunityID varchar(255) not null,
  ScoringCriteriaBlob longblob null,
  MimeType varchar(50) null,
  size int null,
  filename varchar(255) null,
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (OpportunityID)
);
　
　
/*
INSERT INTO Opportunity
(
  OpportunityID,
  ClosingDate,
  LeadEvaluatorID,
  LowestBid
) 
VALUES
(
  1,
  '2019-01-01 12:00:00',
  3,
  10000
);
　
　
INSERT INTO Opportunity
(
  OpportunityID,
  ClosingDate,
  LeadEvaluatorID,
  LowestBid
) 
VALUES
(
  2,
  '2019-02-14 12:00:00',
  NULL,
  2,
  3000
);
*/
　
create table BIDDER
(
  ID varchar(255) not null,
  BIDOPSID int null,
  FIRST_NAME varchar(30),
  LAST_NAME varchar(30),
  EMAIL varchar(40),
  PASSWORD varchar(255),
  PHONE varchar(15),
  MiddleInitial varchar(5),
  Address varchar(255),
  UserName varchar(255),
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (ID)
);
　
/*
INSERT INTO BIDDER (ID, BIDOPSID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, PHONE, MiddleInitial, Address, UserName) VALUES (1, 222333, 'JANE', 'SUMMERS', 'JANE@EMAIL.COM', '11221', '(214)-748-3647', NULL, '544 Taurus Way, Sacramento CA 95827', 'JSUMMERS');
INSERT INTO BIDDER (ID, BIDOPSID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, PHONE, MiddleInitial, Address, UserName) VALUES (2, 897852, 'KATE', 'SUMMERS', 'KATE@EMAIL.COM', '55442', '(214)-748-3647', NULL, '1474 Russian Blvd, Roseville CA 95678', 'KSUMMERS');
*/
　
create table Employee
(
  ID varchar(255) not null,
  FIRST_NAME varchar(30),
  LAST_NAME varchar(30),
  EMAIL varchar(40),
  PASSWORD varchar(255),
  PHONE varchar(15),
  MiddleInitial varchar(5),
  Address varchar(255),
  UserName varchar(255),
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (ID)
);
　
create table EmployeeRole
(
  EID varchar(255) not null,
  ProposalID varchar(255) null,
  Role varchar(255) null,
  Description varchar(255) null,
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (EID, Role)
);
　
　
/*
INSERT INTO EMPLOYEE (ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, PHONE, MiddleInitial, Address, UserName) VALUES (1, 'JANE', 'SUMMERS', 'JANE@EMAIL.COM', '11221', '(214)-748-3647', NULL, NULL, NULL);
INSERT INTO EMPLOYEE (ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, PHONE, MiddleInitial, Address, UserName) VALUES (2, 'KATE', 'SUMMERS', 'KATE@EMAIL.COM', '55442', '(214)-748-3647', NULL, NULL, NULL);
INSERT INTO EMPLOYEE (ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, PHONE, MiddleInitial, Address, UserName) VALUES (3,
 'Robert',
 'Warner', 'robertt@gmail.com', 'mysecretcode', '(214)-748-3647', 'T', '84 Grand Park Ave, Sacramento, CA, 95421', 'rwarner');
INSERT INTO EMPLOYEE (ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, PHONE, MiddleInitial, Address, UserName) VALUES (4, 'Tom', 'Adams', 'tadams@somesite.com', '64566', '(916)-748-3621', 'L', '743 Green Blvd, Roseville CA 95678', 'tadams');
INSERT INTO EMPLOYEE (ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, PHONE, MiddleInitial, Address, UserName) VALUES (5, 'Sarah', 'Rhule', 'srhule@gmail.com', '89431', '(522)-477-2647', 'W', '455 Sand Yard Lane, Phoenix AZ 43311', 'sruhle');
*/
　
create table DocTemplate
(
  DocTemplateID int not null,
  DocTitle varchar(255),
  `Path` varchar(255),
  `Blob` bool,
  `Url` varchar(255),
  CreatedDate datetime null,
  LastEditDate datetime null,
  PostedDate datetime null,
  DisplayTitle varchar(255),
  PRIMARY KEY (DocTemplateID)
);
　
/*
INSERT INTO DocTemplate (DocTemplateID, DocTitle, `Path`,  `Blob`) VALUES (1, 'CA 14', 'C:\filestore\CA14.docx', 0);
INSERT INTO DocTemplate (DocTemplateID, DocTitle, `Path`,  `Blob`) VALUES (2, 'CDFA Form 16', 'C:\filestore\CDFA16.pdf', 0);
INSERT INTO DocTemplate (DocTemplateID, DocTitle, `Path`,  `Blob`) VALUES (3, 'IRS 1040 EZ', 'C:\filestore\IRS1040EZ.doc', 0);
*/
　
create table OppDocTemplate
(
  OpportunityID varchar(255) not null,
  DocTemplateID int not null,
  ExpirationDate datetime,
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (OpportunityID,DocTemplateID)
);
　
/*
INSERT INTO OppDocTemplate (OpportunityID, DocTemplateID, ExpirationDate) VALUES ('1', 1, '2019-01-01 12:00:00');
INSERT INTO OppDocTemplate (OpportunityID, DocTemplateID, ExpirationDate) VALUES ('2', 3, '2019-02-21 12:00:00');
*/
　
create table EmployeeRole
(
  EID varchar(255) not null,
  ProposalID int not null,
  Role int null,
  Description varchar(255),
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (EID)
);
　
create table Proposal
(
  ProposalID varchar(255) not null,
  OpportunityID varchar(255) not null,
  BidderID int not null,
  Status int null,
  TechnicalScore decimal,
  FeeScore decimal,
  FinalTotalScore decimal,
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (ProposalID)
);
　
drop table Clarification;
create table Clarification
(
  ClarificationID int not null,
  ProposalID varchar(255) not null,
  DocID int null,
  question varchar(500) null,
  answer varchar(500) null,
  CreatedDate datetime null,
  LastEditDate datetime null,
  ClosingDate datetime null,
  PRIMARY KEY (ClarificationID,ProposalID)
);
　
create table Docs
(
  DocID int not null,
  DocTitle varchar(255),
  Description varchar(500),
  `Path` varchar(255),
  `Blob` bool,
  `Url` varchar(255),
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (DocID)
);
　
create table ProposalDocs
(
  ProposalID varchar(255) not null,
  DocID int not null,
  DocTitle varchar(255),
  ExpirationDate datetime,
  OpportunityID varchar(255) null,
  DocTemplateID int null,
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (ProposalID,DocID)
);
　
create table DocBlob
(
  DocID int not null,
  `Data` varchar(500),
  Metadata varchar(500),
  CreatedDate datetime null,
  LastEditDate datetime null,
  PRIMARY KEY (DocID)
);
　
create user wilddb_user identified by 'wilddb_db';
　
GRANT ALL PRIVILEGES ON *.* TO 'wilddb_user'
　
　
