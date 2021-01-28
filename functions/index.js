// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const badwordDetection = require("./badwordDetection/index");
exports.badwordDetection = badwordDetection.badwordDetection;
