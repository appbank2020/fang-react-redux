var mongoose = require('mongoose');

var propertySchema = new mongoose.Schema({
  propertyId: { type: String, unique: true, index: true },
  suburb: String,
  postcode: String,
  price: String,
  address: String,
  imageCount: { type: Number, default: 0 },
  title: String,
  details: String,
  propertyType: String,
  roomType: String,
  contactName: String,
  contactNumber: String,
  contactEmail: String,
  contactSocial: String,
  preferredContact: String,
  bond: String,
  availableStart: String,
  minTerm: { type: Number, default: 4 },
  propertyFeature: []
});

module.exports = mongoose.model('Property', propertySchema, 'property');
