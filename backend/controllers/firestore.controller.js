const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();

exports.firestore = firestore;
