const admin = require("firebase-admin");
admin.initializeApp();
const {addMessages}=require("./controllers/Chat");

exports.addMessages=addMessages;
