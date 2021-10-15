import firebase from 'firebase/app';

const config = {
    apiKey: "AIzaSyAlIO8H8XBwAtN_WmtB2OIRbrlThuafVhg",
    authDomain: "prompts-ai.firebaseapp.com",
    projectId: "prompts-ai",
};

firebase.initializeApp(config);

export default firebase;