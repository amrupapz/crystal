const {firestore} = require("./firestore.controller");
const {mongo} = require('./mongo.controller');

async function create(sphere) {
    console.log("Creating note...")

    await mongo().db('whatsgood').collection('spheres').insertOne(sphere);
}

async function getIndex() {
    return await mongo().db('whatsgood').collection('spheres').estimatedDocumentCount()
}


exports.create = create
exports.getIndex = getIndex

async function getSphereIdOf(title) {
  const result = await mongo().db('whatsgood').collection('spheres')
    .findOne({title: {$regex: new RegExp(title, 'i')}});
  if (!result) return undefined;
  return result.id;
}

async function getSpheres() {
  const result = await mongo().db('whatsgood').collection('spheres')
    .find({})
    .toArray();
  return result.map(obj => obj.title);
}

exports.getSphereIdOf = getSphereIdOf;
exports.getSpheres = getSpheres;
