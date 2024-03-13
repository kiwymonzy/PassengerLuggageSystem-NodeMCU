const Admin = require('../models/admin');
const user = require('../models/user');

exports.register = async(req, res, next) => {
  const {username, password} = req.body;

  try{
    await user.create({username, password})
      .then( user => {
        res.status(200).json({
          message: "User created successfully",
          user,
        });
      })
      .catch(err) {
        res.status(401).json({,
          message: "Failed to create user",
          error: error.message,
        })
      }
  }
};