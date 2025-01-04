const {firestore} = require("./firestore.controller");
const {mongo} = require('./mongo.controller');
const {FieldValue} = require("@google-cloud/firestore");

async function createMongo(note) {
    console.log("Creating note...")
    await mongo().db('whatsgood').collection('notes')
        .insertOne(note);
    await mongo().db('whatsgood').collection('people')
        .updateOne({id: note.user_id}, {$addToSet: {notes: note.id}}, {upsert: true})
}

async function editMongo(note) {
    console.log("Editing note...")
    await mongo().db('whatsgood').collection('notes')
        .updateOne({id: note.id}, {$set: note})
    await mongo().db('whatsgood').collection('people')
        .updateOne({id: note.user_id}, {$addToSet: {notes: note.id}}, {upsert: true})
}

async function deleteMongo(note_id, user_id) {
    console.log("Deleting note...")
    await mongo().db('whatsgood').collection('notes')
        .deleteOne({id: note_id})
    await mongo().db('whatsgood').collection('people')
        .updateOne({id: user_id}, {$pull: {notes: note_id}})
}


exports.create = createMongo;
exports.edit = editMongo;
exports.delete = deleteMongo;