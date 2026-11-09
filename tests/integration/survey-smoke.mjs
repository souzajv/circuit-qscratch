import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,createUserWithEmailAndPassword,deleteUser} from 'firebase/auth';
import {getFirestore,doc,setDoc,getDocFromServer,deleteDoc,serverTimestamp,terminate} from 'firebase/firestore';
import {firebaseConfig} from '../../src/infrastructure/firebase/config.js';
import {surveyQuestions,SURVEY_VERSION} from '../../src/learning/surveys.js';
import {randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
const app=initializeApp(firebaseConfig,'survey-qa'),other=initializeApp(firebaseConfig,'survey-other-qa');
const auth=getAuth(app),second=getAuth(other),db=getFirestore(app),db2=getFirestore(other);
let ref;
try {
 const a=await createUserWithEmailAndPassword(auth,`qa-progress-${Date.now()}@example.invalid`,randomBytes(20).toString('hex'));
 ref=doc(db,'progress',a.user.uid);
 const state={name:'Teste',level:'Ensino Médio',current:1,completed:[0],best:{0:8},attempt:{1:{phase:'quiz',errors:2,hint:true}},first:null,motion:true,sound:true};
 state.surveys=Object.fromEntries(['before','after'].map(kind=>[kind,{version:SURVEY_VERSION,status:'completed',answers:Object.fromEntries(surveyQuestions[kind].map(q=>[q.id,q.type==='text'?'Mais exemplos':q.options?q.options[0]:false])),submittedAtClient:new Date().toISOString()}]));
 await setDoc(ref,{version:1,state,updatedAt:serverTimestamp()});
 assert.deepEqual((await getDocFromServer(ref)).data().state,state);
 await assert.rejects(()=>getDocFromServer(doc(db2,'progress',a.user.uid)),e=>e.code==='permission-denied');
 await createUserWithEmailAndPassword(second,`qa-other-${Date.now()}@example.invalid`,randomBytes(20).toString('hex'));
 await assert.rejects(()=>getDocFromServer(doc(db2,'progress',a.user.uid)),e=>e.code==='permission-denied');
 await assert.rejects(()=>setDoc(doc(db2,'progress',a.user.uid),{version:1,state,updatedAt:serverTimestamp()}),e=>e.code==='permission-denied');
 console.log('Questionários pré/pós recuperados por UID; usuário anônimo e segunda conta bloqueados para leitura/escrita.');
} finally {
 if(ref)await deleteDoc(ref);
 if(auth.currentUser)await deleteUser(auth.currentUser);
 if(second.currentUser)await deleteUser(second.currentUser);
 await terminate(db);await terminate(db2);await deleteApp(app);await deleteApp(other);
}
