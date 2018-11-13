const models = require('../models');
const Skin = models.Skin;

const makerPage = (req, res) => {
  Skin.SkinModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), skins: docs });
  });
};

const skinPage = (req, res) => {
  Skin.SkinModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('skinData', { csrfToken: req.csrfToken(), skins: docs });
  });
};

const makeSkin = (req, res) => {
  if (!req.body.skinName || !req.body.vBucks || !req.body.rarity) {
    return res.status(400).json({ error: 'Skin name, V-buck amount, and rarity are required' });
  }

  const skinData = {
    skinName: req.body.skinName,
    vBucks: req.body.vBucks,
    rarity: req.body.rarity,
    owner: req.session.account._id,
  };

  const newSkin = new Skin.SkinModel(skinData);

  const skinPromise = newSkin.save();

  skinPromise.then(() => res.json({ redirect: '/maker' }));

  skinPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Skin already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return skinPromise;
};

const getSkins = (request, response) => {
  const req = request;
  const res = response;

  return Skin.SkinModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ skins: docs });
  });
};

const deleteSkin = (request, response) => {
  const req = request;
  const res = response;
  console.log(req.body);

  return Skin.SkinModel.removeByID(req.body._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.status(204).json();
  });
};

module.exports.makerPage = makerPage;
module.exports.skinPage = skinPage;
module.exports.make = makeSkin;
module.exports.getSkins = getSkins;
module.exports.deleteSkin = deleteSkin;
