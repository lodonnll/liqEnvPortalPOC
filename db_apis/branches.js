const oracledb = require('oracledb');
const database = require('../services/database.js');

/*    :functionalCCY,
    :bank,
    :cust_id,
	:indActive,
	:indMayDeactivate,
	:uidCreate,
	:uidUpdate,
	:tspCreate,
	:tspUpdate,
	:cdeCountry,
	:fiscalMonth,
	:timeRegion,
	:entityCode,
	:gracePeriod,
	:fundDesk,
	:locationCode,
	:holCalCode,
	:indCentralSC,
	:indMFCOFAcct,
	:indNetCfl,
	:indNetBorrower,
	:branchGLCode*/
const baseQuery =
 `select BRN_CDE_BRANCH "branchCode",
    BRN_DSC_BRANCH "description",
    BRN_CDE_LOCAL_CCY "localCCY",
    BRN_CDE_FUNCT_CCY "functionalCCY",
	BRN_CDE_BANK "bank",
   BRN_CID_CUST_ID "cust_id",
   BRN_IND_ACTIVE "indActive",
   BRN_IND_MAY_DEACT "indMayDeactivate",
   BRN_UID_REC_CREATE "uidCreate",
   BRN_UID_REC_UPDATE "uidUpdate",
   BRN_TSP_REC_CREATE "tspCreate",
   BRN_TSP_REC_UPDATE "tspUpdate",
   BRN_CDE_COUNTRY "cdeCountry",
   BRN_NUM_FISC_MM "fiscalMonth",
   BRN_CDE_TME_REGION "timeRegion",
   BRN_TXT_ENTITY_CDE "entityCode",
   BRN_NUM_GRACE_PER "gracePeriod",
   BRN_CDE_FUND_DESK "fundDesk",
   BRN_CDE_LOCATION "locationCode",
   BRN_CDE_HOL_CAL "holCalCode",
   BRN_IND_CENTRAL_SC "indCentralSC",
   BRN_IND_MFCOF_ACCT "indMFCOFAcct",
   BRN_IND_NET_CASHFL "indNetCfl",
   BRN_IND_NET_BORR "indNetBorrower",
   BRN_CDE_GL "branchGLCode"
  from vls_branch`;


async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.branchCode) {
	  console.log(context.branchCode);
    binds.branchCode = context.branchCode;

    query += `\nwhere BRN_CDE_BRANCH = :branchCode`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

module.exports.find = find;

/* BRN_CDE_BRANCH char(5) NOT NULL,
   BRN_DSC_BRANCH char(70) NOT NULL,
   BRN_CDE_LOCAL_CCY char(3) NOT NULL,
   BRN_CDE_FUNCT_CCY char(3) NOT NULL,
   BRN_CDE_BANK char(5) NOT NULL,
   BRN_CID_CUST_ID char(8) NOT NULL,
   BRN_IND_ACTIVE char(1) NOT NULL,
   BRN_IND_MAY_DEACT char(1) NOT NULL,
   BRN_UID_REC_CREATE char(8) NOT NULL,
   BRN_UID_REC_UPDATE char(8) NOT NULL,
   BRN_TSP_REC_CREATE timestamp NOT NULL,
   BRN_TSP_REC_UPDATE timestamp NOT NULL,
   BRN_CDE_COUNTRY char(2) NOT NULL,
   BRN_NUM_FISC_MM decimal(22,0) NOT NULL,
   BRN_CDE_TME_REGION char(5) NOT NULL,
   BRN_TXT_ENTITY_CDE char(6) NOT NULL,
   BRN_NUM_GRACE_PER decimal(22,0) NOT NULL,
   BRN_CDE_FUND_DESK char(5) NOT NULL,
   BRN_CDE_LOCATION char(5) NOT NULL,
   BRN_CDE_HOL_CAL char(5) NOT NULL,
   BRN_IND_CENTRAL_SC char(1) NOT NULL,
   BRN_IND_MFCOF_ACCT char(1) NOT NULL,
   BRN_IND_NET_CASHFL char(1) NOT NULL,
   BRN_IND_NET_BORR char(1) NOT NULL,
   BRN_CDE_GL char(5)
   */
   //var tspCreate = new Date(2019, 02, 15, 0, 0, 0, 0)
const createSql =
 `insert into vls_branch (
    BRN_CDE_BRANCH,
    BRN_DSC_BRANCH,
    BRN_CDE_LOCAL_CCY,
    BRN_CDE_FUNCT_CCY,
	BRN_CDE_BANK,
   BRN_CID_CUST_ID,
   BRN_IND_ACTIVE,
   BRN_IND_MAY_DEACT,
   BRN_TSP_REC_CREATE,
   BRN_TSP_REC_UPDATE,
   BRN_UID_REC_CREATE,
   BRN_UID_REC_UPDATE,
   BRN_CDE_COUNTRY,
   BRN_NUM_FISC_MM,
   BRN_CDE_TME_REGION,
   BRN_TXT_ENTITY_CDE,
   BRN_NUM_GRACE_PER,
   BRN_CDE_FUND_DESK,
   BRN_CDE_LOCATION,
   BRN_CDE_HOL_CAL,
   BRN_IND_CENTRAL_SC,
   BRN_IND_MFCOF_ACCT,
   BRN_IND_NET_CASHFL,
   BRN_IND_NET_BORR,
   BRN_CDE_GL
  ) values (
    :branchCode,
    :description,
    :localCCY,
    :functionalCCY,
    :bank,
    :cust_id,
	:indActive,
	:indMayDeactivate,
	:tspCreate,
	:tspUpdate,
	:uidCreate,
	:uidUpdate,
	:cdeCountry,
	:fiscalMonth,
	:timeRegion,
	:entityCode,
	:gracePeriod,
	:fundDesk,
	:locationCode,
	:holCalCode,
	:indCentralSC,
	:indMFCOFAcct,
	:indNetCfl,
	:indNetBorrower,
	:branchGLCode
  )`; //returning branchCode  into :branchCode`;

async function create(branch) {
  const insert_branch = Object.assign({}, branch);

  /*insert_branch.branchCode = {
    dir: oracledb.BIND_OUT,
    type: oracledb.STRING
  }*/

  const result = await database.simpleExecute(createSql, insert_branch);

  //insert_branch.branchCode = result.outBinds.branchCode[0];

  return insert_branch;
}

module.exports.create = create;

/*const updateSql =
 `update vls_branch
  set first_name = :first_name,
    last_name = :last_name,
    email = :email,
    phone_number = :phone_number,
    hire_date = :hire_date,
    job_id = :job_id,
    salary = :salary,
    commission_pct = :commission_pct,
    manager_id = :manager_id,
    department_id = :department_id
  where branchCode = :branchCode`;

async function update(branchCode) {
  const branches = Object.assign({}, branchCode);
  const result = await database.simpleExecute(updateSql, branches);

  if (result.rowsAffected && result.rowsAffected === 1) {
    return branches;
  } else {
    return null;
  }
}

module.exports.update = update;
*/

const deleteSql =
 `begin
    delete from vls_branch
    where branchCode = :branchCode;
    :rowcount := sql%rowcount;
  end;`

async function del(branchCode) {
  const binds = {
    branchCode: branchCode,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  }
  const result = await database.simpleExecute(deleteSql, binds);

  return result.outBinds.rowcount === 1;
}

module.exports.delete = del;