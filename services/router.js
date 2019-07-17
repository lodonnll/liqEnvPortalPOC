const express = require('express');
const router = new express.Router();
const branches = require('../controllers/branches.js');
const about = require('../controllers/about.js');
 
router.route('/branches/:code?')
  .get(branches.get)
  .post(branches.post)
  .put(branches.put)
  .delete(branches.delete);
 
 router.route('/about')
   .get(about.get);
   
module.exports = router;