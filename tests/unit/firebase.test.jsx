import {firebaseConfig} from '../../src/infrastructure/firebase/config';
import {login,register,resetPassword,accessError,watchAccount,logout} from '../../src/infrastructure/firebase/auth';
import {getApps,initializeApp,getApp} from 'firebase/app';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile,sendPasswordResetEmail} from 'firebase/auth';
jest.mock('firebase/app',()=>({getApps:jest.fn(()=>[]),initializeApp:jest.fn(()=>({})),getApp:jest.fn(()=>({}))}));
jest.mock('firebase/auth',()=>({getAuth:()=> ({languageCode:''}),signInWithEmailAndPassword:jest.fn(),createUserWithEmailAndPassword:jest.fn(),updateProfile:jest.fn(),sendPasswordResetEmail:jest.fn(),onAuthStateChanged:jest.fn(),signOut:jest.fn()}));
test('adaptador exige configuração, reutiliza app e delega ao SDK sem guardar senha',async()=>{
 delete firebaseConfig.apiKey;await expect(login('x','y')).rejects.toThrow(/configurado/);firebaseConfig.apiKey='test';
 watchAccount(jest.fn());await logout();
 await login(' a@example.com ','senha');expect(initializeApp).toHaveBeenCalled();expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.objectContaining({languageCode:'pt-BR'}),'a@example.com','senha');
 getApps.mockReturnValue([{}]);createUserWithEmailAndPassword.mockResolvedValue({user:{uid:'1'}});await register(' Jo ',' a@example.com ','senha');expect(getApp).toHaveBeenCalled();expect(updateProfile).toHaveBeenCalledWith({uid:'1'},{displayName:'Jo'});
 await resetPassword(' a@example.com ');expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.objectContaining({languageCode:'pt-BR'}),'a@example.com');
 expect(accessError({code:'auth/invalid-credential'})).toMatch(/incorretos/);expect(accessError({code:'desconhecido'})).toMatch(/Não foi possível/);delete firebaseConfig.apiKey;
});
