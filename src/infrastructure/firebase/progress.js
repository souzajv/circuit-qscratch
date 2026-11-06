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
  const surveyArchive={...previous.surveyArchive};
  const surveys={...previous.surveys,...state.surveys};
  Object.entries(previous.surveys || {}).forEach(([kind,record])=>{
   if(['completed','skipped'].includes(record.status)){
    if((record.version || 1)>=(surveys[kind]?.version || 1))surveys[kind]=record;
    else surveyArchive[`${kind}_v${record.version || 1}`]=record;
   }
  });
  transaction.set(ref,{version:1,state:{...state,best,completed,surveys,surveyArchive,first:previous.first || state.first},updatedAt:serverTimestamp()});
 });
}
