const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age color').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const deleteDomo = async (req, res) => {
  try {
    const id = {
      name: req.body.name, age: req.body.age, color: req.body.color, owner: req.session.account._id,
    };
    const domo = await Domo.findOneAndDelete(id).exec();
    return res.status(200).json({ message: 'Domo deleted!', domo });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting domo!' });
  }
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.color) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    color: req.body.color,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, color: newDomo.color });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }
    return res.status(500).json({ error: 'An error occurred making domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
