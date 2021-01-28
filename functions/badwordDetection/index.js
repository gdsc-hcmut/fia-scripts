const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.badwordDetection = functions.database.ref("/messages/{pushId}")
    .onWrite(async (change, context) => {
        // Only check badword when the data is valid.
        if (!change.after.exists()) {
            return null;
        }
        // Grab the current value of what was written to the Realtime Database.
        const prevMess = change.before.val();
        let currMess = change.after.val();

        // Only check if currData is different from prevMess or prevMess is null
        if (prevMess && prevMess.message === currMess.message) {
            return null;
        }

        // Get list of bad words from firestore
        const badwordListRef = admin.firestore()
            .collection("badwordCollection").doc("badwordDoc");
        const data = await badwordListRef.get();

        // Replace each badword with ****
        for (const badword of data.data().lstBadword) {
            const badwordregex = new RegExp(badword, "g");
            const replaceWord = "*".repeat(badword.length);
            currMess = currMess.replace(badwordregex, replaceWord);
        }

        // Save updated message
        return change.after.ref.set({ ...currMess, message: currMess });
    });
