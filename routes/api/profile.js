const express = require('express');
const router = express.Router();;
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/user');
const Post = require('../../models/Post');
const {check, validationResult } = require('express-validator/check');

// @route GET api/profile/me
// @desc  Get current user's profile
// @access profile
router.get('/me',auth, async (req,res) => {   //auth is middle ware here....
      try{
          const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
          if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
          }
          console.log(profile);
          res.json(profile);
      }catch(error)
      {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
      //res.send('Profile route');
});

// @route POST api/profile
// @desc  Create or update user profile
// @access private
router.post('/',[
  auth,
  [
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
  ]
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    company,website,location,bio,status,githubusername,skills,youtube,facebook,twitter,instagram,linkedin
  } = req.body;

  // build profile Object
  const profileFields = {};
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;
  if(skills){
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  // Build social Object
  profileFields.social = {};
  if(youtube) profileFields.social.youtube = youtube;
  if(facebook) profileFields.social.facebook = facebook;
  if(twitter) profileFields.social.twitter = twitter;
  if(instagram) profileFields.social.instagram = instagram;
  if(linkedin) profileFields.social.linkedin = linkedin;

  try{
      let profile = await Profile.findOne({user:req.user.id});

      if(profile){
        // update
        profile = await Profile.findOneAndUpdate(
          { user:req.user.id},
          {$set: profileFields},
          {new:true}
        );

        return res.json(profile);
      }

      // Create new Profile
      profile = new Profile(profileFields);
      await profile.save();
  }catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/profile
// @desc  Get all profiles
// @access Public
router.get('/', async (req,res)=>{
  try{
      const profiles =await Profile.find().populate('user',['name','avatar']);
      res.json(profiles);
  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by user id
// @access Public
router.get('/user/:user_id', async (req,res)=>{
  try{
      const profile =await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
      if(!profile)
      {
        return res.status(400).json({msg: "There is no profile for this user"});
      }
      res.json(profile);
  }catch(err){
    console.error(err.message);
    if(err.kind=='ObjectId'){
      return res.status(400).json({msg: "There is no profile for this user"});
    }
    res.status(500).send('Server Error');
  }
});

// @route Delete api/profile
// @desc  Delete profile, user & posts
// @access Private
router.delete('/',auth, async (req,res)=>{
  try{
      //@todo remove users Posts
      await Post.deleteMany({user:req.user.id});
      //Remove profile
      await Profile.findOneAndRemove({user:req.user.id});
      //Remove user
      await User.findOneAndRemove({_id:req.user.id});

      res.json({msg: "User deleted"});
  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/profile/experience
// @desc  add profile experience
// @access Private
router.put('/experience',[
  auth,
  [
    check('title','title is required').not().isEmpty(),
    check('company','company is required').not().isEmpty(),
    check('from','from date is required').not().isEmpty()
  ]
], async (req,res)=>{
  const errors =validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array() });
  }
  const{
    title,company,location,from,to,current,description
  } = req.body;
  const newExp = {
    title,company,location,from,to,current,description
  }

  try{
    const profile = await Profile.findOne({user: req.user.id});
    profile.experience.unshift(newExp);   //same as push
    await profile.save();
    res.json(profile);

  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/profile/experience
// @desc  delete profile experience
// @access Private
router.delete('/experience/:exp_id',
  auth, async (req,res)=>{

  try{
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.experience.map(item=> item.id).indexOf(req.params.exp_id);  // important
    profile.experience.splice(removeIndex,1);

    await profile.save();
    res.json(profile);
  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route PUT api/profile/education
// @desc  add profile education
// @access Private
router.put('/education',[
  auth,
  [
    check('school','school is required').not().isEmpty(),
    check('degree','degree is required').not().isEmpty(),
    check('fieldofstudy','fieldofstudy date is required').not().isEmpty(),
    check('from','from is required').not().isEmpty()
  ]
], async (req,res)=>{
  const errors =validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array() });
  }
  const{
    school,degree,fieldofstudy,from,to,current,description
  } = req.body;
  const newEdu = {
    school,degree,fieldofstudy,from,to,current,description
  }

  try{
    const profile = await Profile.findOne({user: req.user.id});
    profile.education.unshift(newEdu);   //same as push
    await profile.save();
    res.json(profile);

  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/profile/education
// @desc  delete profile education
// @access Private
router.delete('/education/:edu_id',
  auth, async (req,res)=>{
  try{
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.education.map(item=> item.id).indexOf(req.params.exp_id);
    profile.education.splice(removeIndex,1);

    await profile.save();
    res.json(profile);
  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
