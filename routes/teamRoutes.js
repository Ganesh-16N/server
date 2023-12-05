const express = require('express');
const router = express.Router();
const memberController = require('../controllers/teamController');

router.get('/members', memberController.getAllMembers);
router.post('/members', memberController.createMember);
router.delete('/members/:id', memberController.deleteMember);

module.exports = router;