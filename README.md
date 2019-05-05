Camera with Vision API
=======================

A tool for analysing photo by Google Cloud Vision API.

## Description
This app is made by [ionic4](https://ionicframework.com/docs).
See the [document](https://cloud.google.com/vision/docs/) about Cloud API

## Requirement
- Node.js
- Ionic
- Firebase Authentication

## Install necessary libraries  
`npm install`

## Prepare configuration file  
`src/environments/environment.ts`  
`src/environments/environment.prod.ts`  
#### Contents
  ```
  export const environment = {
    production: false,
    config: {
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: ''
    },
    googleCloudVisionAPIKey: '',
    debug: false
  };

  ```
 ## Execute
 - Web browser  
 `ionic serve`  
 
 - Android  
 `ionic cordova platform add android`  
 `ionic cordova build android`  
 `ionic cordova run android`  

## Released application
See [Camera with Cloud API](https://play.google.com/store/apps/details?id=com.okabehisa.camerawithvisionapi)
