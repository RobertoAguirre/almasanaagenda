// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const SERVER_URL = 'http://localhost:27017/api/';
//export const SERVER_URL = 'http://74.208.145.99:27016/api/';
//export const DB_INSTANCE = 'SYS_PRUEBAS';
export const DB_INSTANCE = 'SYS';
export const IP_SERVER = 'http://localhost:27017/';
//export const IP_SERVER = 'http://74.208.145.99:27016/';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
