const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.badwordDetection = functions.database.ref("/messages/{pushId}")
    .onWrite(async (change, context) => {
        // Only check badword when the data is valid.
        if (!change.after.exists()) {
            return null;
        }
        // Grab the current value of what was written to the Realtime Database.
        // const prevMess = change.before.val();
        let currMess = change.after.val();

        // Only check if currData is different from prevMess or prevMess is null
        // if (prevMess && prevMess.message === currMess.message) {
        //     return null;
        // }

        // Get list of bad words from firestore
        const badwordListRef = admin.firestore()
            .collection("badwordCollection").doc("badwordDoc");
        const data = await badwordListRef.get();
        const badwordLst = data.data().lstBadword
            .sort((ele1, ele2) => ele2.length - ele1.length);

        let numOfBadword = 0;
        // Replace each badword with ****
        for (const badword of badwordLst) {
            const badwordregex = new RegExp(badword, "g");
            const replaceWord = "*".repeat(badword.length);
            numOfBadword += (currMess.match(badwordregex) || []).length;
            currMess = currMess.replace(badwordregex, replaceWord);
        }

        // Save statistic
        // return change.after.ref.set({ ...currMess, message: currMess });
        return admin.firestore().collection("statictisCollection")
            .doc("statictisDoc").set({
                [context.auth.uid]:
                    admin.firestore.FieldValue.increment(numOfBadword),
            }, { merge: true });
    });
