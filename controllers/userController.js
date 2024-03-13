const User = require('../models/user');
const Record = require('../models/record');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = "ef0b6ef366eaae1dd9166f08dc83d8b3a6c0e9bf2f644986d13eceda44b70b2c060f1d";

exports.index = function(req, res) {
  res.render("index.pug", {
    title: "Passengers Luggage Monitoring",
  })
};
exports.login_get = function(req, res) {
  res.render("login", {
    title: "Passengers Luggage Monitoring",
  })
};
exports.login_post = function(req, res) {
  const { username, password } = req.body;

  Admin.findOne( {username: username}, (err, admin) => {
    if(err) {
      return err;
    }
    if(admin == null) {
      res.send('failed to login');
      return;
    }
    bcrypt.compare(password, admin.password).then( (result) => {
      if(result) {
        const maxAge = 60;
        const token = jwt.sign(
          {
            id: result._id,
            username,
          },
          jwtSecret,
          {
            expiresIn: maxAge,
          },
        );
        res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000} );
        res.send("successfully logged in");
        res.redirect('/'); 
      }
      else {
        res.send("couldnt login");
      }
    })
  });
};
exports.show_user = function(req, res) {
  res.send(`show user with id ${req.params.id} NOT implemented`);
};
exports.all_users = function(req, res) {
  User.find({}, (err, result) => {
    if(err) {
      throw err;
    }
    res.render("all_users", {
      title: "All Customers",
      results: result,
    });
  });
};
exports.clear_users = function(req, res) {
  User.deleteMany({}, (err, obj) => {
    if(err) {
      res.render("result_page", {
        title: "Passengers Luggage Monitoring",
        message: "Could not delete Customers",
        error: true,
      });
      return;
    }
    res.render("result_page", {
      title: "Passengers Luggage Monitoring",
      message: "Customers deleted Successfully",
      error: false,
    });
  });
};
exports.show_records = function(req, res) {
  Record.find({}, (err, result) => {
    if(err) {
      return err;
    }
    // console.log("all records" + result);
    res.render("all_records", {
      title: 'All records',
      results: result,
    });
  });
};
exports.clear_records = function(req, res) {
  Record.deleteMany({}, (err, obj) => {
    if(err) {
      res.render("result_page", {
        title: "Passengers Luggage Monitoring",
        message: "Could not delete Records",
        error: true,
      });
      return;
    }
    res.render("result_page", {
      title: "Passengers Luggage Monitoring",
      message: "Records deleted Successfully",
      error: false,
    });
  });
};
exports.create_user_get = function(req, res) {
  res.render("create_user", {
    title: "Create User",
  });
};
exports.create_user_post = function(req, res) {
  const customer_name = req.body.full_name;
  const card_number = req.body.card_number;
  const phone_no = req.body.phone_number;
  const dest = req.body.destination;

  const new_user = new User({
    name: customer_name,
    card_id: card_number,
    phone_number: phone_no,
    destination: dest,
  });

  new_user.save( (err) => {
    if(err) {
      console.log(err);
      res.render("result_page", {
        title: "Passengers Luggage Monitoring",
        message: "Could not save customer",
        error: true,
      });
      return;
    }
    res.render("result_page", {
      title: "Passengers Luggage Monitoring",
      message: "Customer saved Successfully",
      error: false,
    });
  });
};
exports.card_event = function(req, res) {
  const id = req.params.id;

  User.findOne({card_id: id}, (err, result) => {
    if(err) {
      return err;
    }
    if(result == null) {
      res.send('invalid');
      return;
    }
    const customer_name = result.name;
    const card_no = result.card_id;
    const phone_no = result.phone_number;
    const dest = result.destination;
    
    const new_record = new Record({
      name: customer_name,
      card_id: card_no,
      phone_number: phone_no,
      destination: dest,
    });
    new_record.save( (err) => {
      if(err) {
        res.render("result_page", {
          title: "Passengers Luggage Monitoring",
          message: "Card not Valid",
          error: false,
        });
        return;
      }
      res.render("result_page", {
        title: "Passengers Luggage Monitoring",
        message: "Card is Valid",
        error: false,
      });
    });
  });
};
exports.register_get = function(req, res) {
  res.render("register_form", {
    title: "Register new user",
  });
};
exports.register_post = async(req, res, next) => {
  const {username, password} = req.body;

  bcrypt.hash(password, 2).then(async (hash) => {
    await Admin.create( {username, password: hash} )
      .then( (user) => {
        const maxAge = 60;
        const token= jwt.sign({
            id: user._id,
            username,
          },
            jwtSecret,
          {
            expiresIn: maxAge,
          },
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        //res.send("User created successfully");
        res.render("register_form", {
          title: "Register new user",
          message: "User created successfully",
          error: false
        });
      })
      .catch( (error) => {
        res.send(error.message);
      }
    );
  })
};