import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, onAuthStateChanged, signOut} from 'firebase/auth';
import {firebaseConfig} from './config';

export function auth() {
    if (!firebaseConfig.apiKey) throw new Error('O acesso está sendo configurado. Tente novamente em breve.');
    const instance = getAuth(getApps().length ? getApp() : initializeApp(firebaseConfig));
    instance.languageCode = 'pt-BR';
    return instance;
}
export async function login(email, password) {
    return signInWithEmailAndPassword(auth(), email.trim(), password);
}
export async function register(name, email, password) {
    const result = await createUserWithEmailAndPassword(auth(), email.trim(), password);
    await updateProfile(result.user, {displayName:name.trim()});
    return result;
}
export async function resetPassword(email) {
    await sendPasswordResetEmail(auth(), email.trim());
}
export function accessError(error) {
    const messages = {
        'auth/invalid-credential':'E-mail ou senha incorretos. Confira os dados e tente novamente.',
        'auth/email-already-in-use':'Não foi possível criar a conta com esses dados. Tente entrar ou recuperar a senha.',
        'auth/weak-password':'Escolha uma senha mais forte.',
        'auth/too-many-requests':'Muitas tentativas. Aguarde um pouco antes de tentar novamente.',
        'auth/network-request-failed':'Não conseguimos conectar. Confira sua internet e tente novamente.'
    };
    return messages[error.code] || 'Não foi possível concluir. Tente novamente em instantes.';
}

export const watchAccount = callback => onAuthStateChanged(auth(), callback);
export const logout = () => signOut(auth());
