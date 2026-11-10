const {readFileSync}=require('node:fs');
const {backend}=require('../server/firebase.cjs');
const {getSecurityRules}=require('firebase-admin/security-rules');
const {getApps,deleteApp}=require('firebase-admin/app');
async function main(){
 if(!process.env.FIREBASE_SERVICE_ACCOUNT_JSON)throw Error('Credencial administrativa ausente.');
 backend();
 const source=readFileSync('firebase/firestore.rules','utf8'),rules=getSecurityRules();
 await rules.releaseFirestoreRulesetFromSource(source);
 const active=await rules.getFirestoreRuleset();
 if(!active.source.some(file=>file.content===source))throw Error('A versão publicada não corresponde ao arquivo local.');
 console.log('Regras publicadas e conferidas no Firebase.');
}
main().catch(error=>{console.error('Não foi possível publicar as regras:',error.code||error.message);process.exitCode=1;}).finally(()=>Promise.all(getApps().map(deleteApp)));
