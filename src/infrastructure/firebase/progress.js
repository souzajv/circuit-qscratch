import {getFirestore,doc,getDocFromServer,runTransaction,serverTimestamp} from 'firebase/firestore';
import {auth} from './auth';
const reference = uid => doc(getFirestore(auth().app),'progress',uid);
export async function loadProgress(uid) {
 const result=await getDocFromServer(reference(uid));
 return result.exists() ? result.data().state : {};
}
export async function saveProgress(uid,state) {
 const ref=reference(uid);
 await runTransaction(getFirestore(auth().app),async transaction=>{
  const snapshot=await transaction.get(ref);
  const previous=snapshot.exists() ? snapshot.data().state : {};
  const best={...previous.best};
  Object.entries(state.best).forEach(([key,value])=>{best[key]=Math.max(best[key] || 0,value);});
  const completed=[...new Set([...(previous.completed || []),...state.completed])].sort();
  transaction.set(ref,{version:1,state:{...state,best,completed,first:previous.first || state.first},updatedAt:serverTimestamp()});
 });
}
