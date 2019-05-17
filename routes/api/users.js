const express = require('express')
const router = express.Router();
var bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check')
const User = require('../../models/user')

// @route POST api/users
// @desc Register user
// @access Public
router.post(
  '/',
    [
    check('name', 'name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({min:6 })
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          return res.status(400).json({errors: errors.array()});
        }

        const { name, email, password } = req.body;
        try{
              // see if user exists
              let user = await User.findOne({ email });
              if(user){
              return  res.status(400).json({ errors: [{msg: 'User already exists'}] });
              }
              // Get users gravatar
              // const avatar = gravatar.url(email,{
              //   s: '200',
              //   r: 'pg',
              //   d: 'mm'
              // });
              user = new User({
                name,
                email,
            //    avatar,
                password
              });
              // Encrypt password using bcrypt
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(password,salt);
              await user.save();

              // Return jsonwebtoken
              res.send('User registered');
            } catch(err) {
              console.error(err.message);
              res.status(500).send('Server error');
            }


  //  console.log(req.body);

      }
    );


module.exports = router;
