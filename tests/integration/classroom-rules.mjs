import {initializeTestEnvironment,assertFails,assertSucceeds} from '@firebase/rules-unit-testing';
import {readFileSync} from 'node:fs';
import {doc,setDoc,getDoc} from 'firebase/firestore';
const env=await initializeTestEnvironment({projectId:'demo-rules-classroom',firestore:{host:'127.0.0.1',port:8080,rules:readFileSync('firebase/firestore.rules','utf8')}});
const state={name:'Teste',level:'Fundamental Anos Finais',current:0,completed:[],best:{},attempt:{}};
try{
 await env.withSecurityRulesDisabled(async context=>{await setDoc(doc(context.firestore(),'students','linked_test'),{ownerUid:'prof',active:true,accessVersion:1,surveys:{before:false,after:false}});});
 const user=env.authenticatedContext('normal').firestore();await assertFails(setDoc(doc(user,'profiles','normal'),{role:'admin'}));
 const linked=env.authenticatedContext('linked_test',{linkedStudent:true,accessVersion:1}).firestore();
 const {serverTimestamp}=await import('firebase/firestore');
 await assertSucceeds(setDoc(doc(linked,'progress','linked_test'),{version:1,state,updatedAt:serverTimestamp()}));
 await assertFails(getDoc(doc(user,'progress','linked_test')));
 await assertFails(setDoc(doc(linked,'progress','linked_test'),{version:1,state:{...state,surveys:{before:{status:'completed'}}},updatedAt:serverTimestamp()}));
 await env.withSecurityRulesDisabled(async context=>{await setDoc(doc(context.firestore(),'students','linked_test'),{active:false},{merge:true});});
 await assertFails(getDoc(doc(linked,'progress','linked_test')));
 console.log('Permissões, formulários desativados e revogação aprovados no emulador.');
}finally{await env.cleanup();}
