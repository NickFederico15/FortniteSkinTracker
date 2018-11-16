const models = require('../models');
const Skin = models.Skin;

// sends the form page
const makerPage = (req, res) => {
  Skin.SkinModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), skins: docs });
  });
};

// sends the My Skins page of the account
const skinPage = (req, res) => {
  Skin.SkinModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('skinData', { csrfToken: req.csrfToken(), skins: docs });
  });
};

// adds a skin to the account
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

// gets the user's skins by account
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

// deletes a skin
const deleteSkin = (request, response) => {
  const req = request;
  const res = response;
  console.log(req.body);

  // checks skin ID to remove
  return Skin.SkinModel.removeByID(req.body._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.status(204).json();
  });
};

// sends the info page
const infoPage = (request, response) => {
  response.render('info', { csrfToken: request.csrfToken() });
};

// exports
module.exports.makerPage = makerPage;
module.exports.skinPage = skinPage;
module.exports.make = makeSkin;
module.exports.getSkins = getSkins;
module.exports.deleteSkin = deleteSkin;
module.exports.infoPage = infoPage;
