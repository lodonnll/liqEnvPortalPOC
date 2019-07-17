const branches = require('../db_apis/branches.js');



async function get(req, res, next) {
  try {
    const context = {};

	//console.log(req.params.code);
	//console.log(req.body.branchCode);
    //context.branchCode = req.params.code;
	context.branchCode = req.body.branchCode;

    const rows = await branches.find(context);

    if (req.params.code) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

module.exports.get = get;



/*  :branchCode,
    :description,
    :localCCY,
    :functionalCCY,
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
	:branchGLCode
*/
async function getBranchFromRec(req) {
	//TODO: map all attributes from an existing row - 
	//we can decide because we are just creating a new branch 
	//that clones another but changes code.
	const context = {};
	let branche = {};
    context.branchCode = "00001" ; //for now always want to clone "North American". This can be configured as a function
	try {
        const rows = await branches.find(context);
        //var result = await database.simpleExecute('SELECT BRN_CDE_BRANCH , BRN_DSC_BRANCH FROM VLS_BRANCH');
	/*branches.forEach(function(branch){ %>
	  <li><%= branch.BRN_CDE_BRANCH %>
	  */
	      //rows.forEach(function(branch){console.log(branch.description)});
		  var sysdate = new Date();
		  //console.log("sysdate"+sysdate);
		  
		  branche = {
			branchCode: req.body.branchCode,  
			description: rows[0].description,
			//boilerplate
			localCCY: rows[0].localCCY,
			functionalCCY: rows[0].functionalCCY,
			bank: rows[0].bank,
			cust_id: rows[0].cust_id,
			indActive: rows[0].indActive,
			indMayDeactivate: rows[0].indMayDeactivate,
			//TODO use current timestamp
			tspCreate: sysdate, 
			tspUpdate: sysdate, 
			//tspCreate: rows[0].tspCreate, 
			//tspUpdate: rows[0].tspUpdate,
			uidCreate: rows[0].uidCreate,
			uidUpdate: rows[0].uidUpdate,
			cdeCountry: rows[0].cdeCountry,
			fiscalMonth: rows[0].fiscalMonth,
			timeRegion: rows[0].timeRegion,
			entityCode: rows[0].entityCode,
			gracePeriod: rows[0].gracePeriod,
			fundDesk: rows[0].fundDesk,
			locationCode: rows[0].locationCode,
			holCalCode: rows[0].holCalCode,
			indCentralSC: rows[0].indCentralSC,
			indMFCOFAcct: rows[0].indMFCOFAcct,
			indNetCfl: rows[0].indNetCfl,
			indNetBorrower: rows[0].indNetBorrower,
			branchGLCode: rows[0].branchGLCode
		  };
	}
	catch (err) {
      next(err);
    }
	finally {
      return branche;
	}
}

async function post(req, res, next) {
  try {
	//console.log('branches.post');  
	//this clones a branch and changes the code.
    let branche = await getBranchFromRec(req);

    branche = await branches.create(branche);

    res.status(201).json(branche);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

async function put(req, res, next) {
  try {
    let branche = getBranchFromRec(req);

    branche.branchCode = parseInt(req.params.branchCode, 10);

    //branche = await branches.update(branche); //no updates allowed

    if (branche !== null) {
      res.status(200).json(branche);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;

//delete
async function del(req, res, next) {
  try {
    const code = parseInt(req.params.branchCode, 10);

    const success = await branches.delete(branchCode);

    if (success) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.delete = del;

