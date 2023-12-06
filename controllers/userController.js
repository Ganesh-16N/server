const User = require('../models/userModel');

async function createUser(req, res) {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
}
async function getAllUsers(req, res) {
  const { page = 1, limit = 10, searchTerm, sortFields, sortOrders } = req.query;
  const query = {};

  // If searchTerm is provided, add regex conditions to the query for relevant fields
  if (searchTerm) {
    query.$or = [
      { first_name: { $regex: new RegExp(searchTerm, 'gi') } },
      { last_name: { $regex: new RegExp(searchTerm, 'gi') } },
      { email: { $regex: new RegExp(searchTerm, 'gi') } },
      // Add more fields as needed
    ];
  }

  try {
    const sortOptions = {};
    if (sortFields && sortOrders) {
      // Ensure that both sortFields and sortOrders are arrays of the same length
      if (Array.isArray(sortFields) && Array.isArray(sortOrders) && sortFields.length === sortOrders.length) {
        sortFields.forEach((field, index) => {
          // Check for specific fields for sorting
          if (field === 'gender' || field === 'available' || field === 'domain') {
            sortOptions[field] = sortOrders[index] === 'asc' ? 1 : -1;
          }
        });
      }
    }

    const data = await User
      .find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions)  // Add sorting based on the provided options
      .exec();

    const count = await User.countDocuments();

    res.json({
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function updateUserById(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).send({ error: 'Invalid update data' });
  }
}

async function deleteUserById(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
