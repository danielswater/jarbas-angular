// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { initializeApp } from "firebase/app";

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAT551MAygRMuN8HYeRw-95_uOSNbN_RyQ",
    authDomain: "jarbas-ffbff.firebaseapp.com",
    databaseURL: "https://jarbas-ffbff-default-rtdb.firebaseio.com",
    projectId: "jarbas-ffbff",
    storageBucket: "jarbas-ffbff.appspot.com",
    messagingSenderId: "486804263660",
    appId: "1:486804263660:web:7a160529d346492c43cbc9"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
