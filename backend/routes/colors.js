const router = require('express').Router();
const Color = require('../models/Color');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, async (req, res) => res.json(await Color.find().sort('name')));

router.post('/', auth, admin, async (req, res) => {
  try { res.status(201).json(await Color.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, admin, async (req, res) => {
  try { res.json(await Color.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, admin, async (req, res) => {
  await Color.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
