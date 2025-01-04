const {firestore} = require('./firestore.controller');
const {mongo} = require('./mongo.controller');

async function getMongo(user_id) {
  const user = await mongo().db('whatsgood').collection('people').findOne({id: user_id});
  const notes = await mongo().db('whatsgood').collection('notes').find({id: {$in: user.notes}}).toArray();

  return {user, notes};
}

exports.get = getMongo;