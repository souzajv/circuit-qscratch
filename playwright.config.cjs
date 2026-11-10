const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({testDir:'tests/e2e',workers:1,fullyParallel:false,timeout:60000,use:{baseURL:'http://127.0.0.1:8620',headless:true,trace:'retain-on-failure'},webServer:[
 {command:'node server/dev.cjs',port:8611,reuseExistingServer:false,env:{GCLOUD_PROJECT:'demo-circuit-qscratch',FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099'}},
 {command:'npm run start',url:'http://127.0.0.1:8620/',reuseExistingServer:false,env:{FIREBASE_EMULATORS:'true',PORT:'8620'}}
]});
