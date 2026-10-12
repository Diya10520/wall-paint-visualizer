const router = require('express').Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Color = require('../models/Color');
const { auth, admin } = require('../middleware/auth');

router.use(auth, admin);

router.get('/stats', async (req, res) => {
  const [users, projects, colors] = await Promise.all([
    User.countDocuments(), Project.countDocuments(), Color.countDocuments(),
  ]);
  res.json({ users, projects, colors });
});

router.get('/projects', async (req, res) =>
  res.json(await Project.find().populate('user', 'name email').sort('-updatedAt').limit(50)));

router.get('/users', async (req, res) =>
  res.json(await User.find().select('-passwordHash').sort('-createdAt')));

module.exports = router;
