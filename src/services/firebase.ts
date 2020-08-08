import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAlIO8H8XBwAtN_WmtB2OIRbrlThuafVhg",
    authDomain: "prompts-ai.firebaseapp.com",
    projectId: "prompts-ai",
};

firebase.initializeApp(config);

export default firebase;