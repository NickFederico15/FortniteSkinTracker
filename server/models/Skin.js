const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let SkinModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setSkinName = (skinName) => _.escape(skinName).trim();
const setRarity = (rarity) => _.escape(rarity).trim();

const SkinSchema = new mongoose.Schema({
  skinName: {
    type: String,
    required: true,
    trim: true,
    set: setSkinName,
  },
  vBucks: {
    type: Number,
    min: 0,
    required: true,
  },
  rarity: {
    type: String,
    required: true,
    trim: true,
    set: setRarity,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

SkinSchema.statics.toAPI = (doc) => ({
  skinName: doc.skinName,
  vBucks: doc.vBucks,
  rarity: doc.rarity,
  _id: doc._id,
});

SkinSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return SkinModel.find(search).select('skinName vBucks rarity').exec(callback);
};

SkinSchema.statics.removeByID = (docID, callback) => {
  const search = {
    _id: docID,
  };

  return SkinModel.find(search).remove().exec(callback);
};

SkinModel = mongoose.model('Skin', SkinSchema);

module.exports.SkinModel = SkinModel;
module.exports.SkinSchema = SkinSchema;
