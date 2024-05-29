/* eslint-disable linebreak-style */
const functions = require("firebase-functions");
const admin = require("firebase-admin");


exports.addMessages = functions.https.onRequest(async (req, res) => {
  try {
    functions.logger.log("Received Request Data", req.body);

    // Validate data request
    if (!req.body.userid || !req.body.text) {
      functions.logger.log("Required Fields are missing");
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required Fields are missing",
      );
    }

    // Add message to database
    const {userid, text} = req.body;

    // Construct message data
    const message = {
      userid,
      text,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const messageRef = await admin
        .firestore()
        .collection("chats")
        .doc(userid)
        .collection("messages")
        .add(message);

    const messageId = messageRef.id;

    functions.logger.log("Message Added Successfully with ID:", messageId);
    res.status(200).json({message: "Message Added Successfully", messageId});
  } catch (error) {
    functions.logger.error("Error Adding Message", error);

    if (error instanceof functions.https.HttpsError) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal Server Error"});
    }
  }
});
