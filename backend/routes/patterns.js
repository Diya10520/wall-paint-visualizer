const router = require('express').Router();
const Pattern = require('../models/Pattern');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, async (req, res) => res.json(await Pattern.find().sort('name')));

router.post('/', auth, admin, async (req, res) => {
  try { res.status(201).json(await Pattern.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, admin, async (req, res) => {
  try { res.json(await Pattern.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, admin, async (req, res) => {
  await Pattern.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
