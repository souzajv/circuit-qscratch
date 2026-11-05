import {initializeApp} from 'firebase/app';
import {getAuth,createUserWithEmailAndPassword,updateProfile,signOut,signInWithEmailAndPassword,deleteUser} from 'firebase/auth';
import {randomBytes} from 'node:crypto';
import {firebaseConfig} from '../../src/infrastructure/firebase/config.js';
const auth=getAuth(initializeApp(firebaseConfig));
const email=`qa-${Date.now()}@example.invalid`,password=randomBytes(24).toString('hex');
try {
 const result=await createUserWithEmailAndPassword(auth,email,password);
 await updateProfile(result.user,{displayName:'Verificação automatizada'});
 await signOut(auth);
 const login=await signInWithEmailAndPassword(auth,email,password);
 if(login.user.displayName!=='Verificação automatizada') throw Error('Nome não persistiu');
 console.log('Cadastro, nome, saída e login confirmados no Firebase real.');
} finally {
 if(auth.currentUser){await deleteUser(auth.currentUser);console.log('Conta temporária da verificação removida.');}
}
