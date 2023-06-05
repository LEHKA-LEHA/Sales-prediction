import { initializeApp } from 'firebase/app';

export const environment = {
    production: false,
    firebaseConfig: {
        apiKey: "<FireBase_API_Key>",
        authDomain: "act2innov.firebaseapp.com",
        projectId: "act2innov",
        storageBucket: "act2innov.appspot.com",
        messagingSenderId: "293291150536",
        appId: "<App_ID>"
    }
  };

  initializeApp(environment.firebaseConfig);
