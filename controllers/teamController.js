const TeamMember = require('../models/teamModel');

// Get all team members
const getAllMembers = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    
    try {
        const data = await TeamMember
          .find()
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
    
        const count = await TeamMember.countDocuments();
    
        res.json({
          data,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
};

// Create a new team member
const createMember = async (req, res) => {
  const member = new TeamMember({
    _id: req.body._id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    gender: req.body.gender, 
    avatar: req.body.avatar,
    domain: req.body.domain,
    available: req.body.available,
  });

  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a team member by ID
const deleteMember = async (req, res) => {
  const memberId = req.params.id;

  try {
    const deletedMember = await TeamMember.findByIdAndDelete(memberId);
    if (deletedMember) {
      res.json({ message: 'Member deleted successfully' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMembers,
  createMember,
  deleteMember,
};
