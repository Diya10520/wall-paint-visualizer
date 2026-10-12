const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename: (req, file, cb) =>
      cb(null, crypto.randomBytes(12).toString('hex') + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    ['image/jpeg', 'image/png'].includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG or PNG images are allowed')),
});

router.use(auth);

router.get('/', async (req, res) =>
  res.json(await Project.find({ user: req.user.id }).sort('-updatedAt')));

router.get('/:id', async (req, res) => {
  const p = await Project.findOne({ _id: req.params.id, user: req.user.id });
  p ? res.json(p) : res.status(404).json({ message: 'Project not found' });
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    const data = JSON.parse(req.body.data || '{}');
    const p = await Project.create({
      user: req.user.id,
      name: data.name || 'Untitled room',
      originalImage: '/uploads/' + req.file.filename,
      walls: data.walls || [],
    });
    res.status(201).json(p);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', async (req, res) => {
  const { name, walls } = req.body;
  const p = await Project.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id }, { name, walls }, { new: true });
  p ? res.json(p) : res.status(404).json({ message: 'Project not found' });
});

router.delete('/:id', async (req, res) => {
  const p = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!p) return res.status(404).json({ message: 'Project not found' });
  fs.unlink(path.join(__dirname, '..', p.originalImage), () => {});
  res.json({ ok: true });
});

module.exports = router;
