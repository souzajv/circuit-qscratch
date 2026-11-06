import {loadProgress,saveProgress} from '../../src/infrastructure/firebase/progress';
import {getDocFromServer,runTransaction} from 'firebase/firestore';
jest.mock('../../src/infrastructure/firebase/auth',()=>({auth:()=>({app:{}})}));
jest.mock('firebase/firestore',()=>({getFirestore:()=>({}),doc:jest.fn((db,col,uid)=>uid),getDocFromServer:jest.fn(),serverTimestamp:()=> 'server',runTransaction:jest.fn()}));
test('carrega estado por UID e preserva melhores pontos e primeira conclusão',async()=>{
 getDocFromServer.mockResolvedValueOnce({exists:()=>false});expect(await loadProgress('a')).toEqual({});getDocFromServer.mockResolvedValueOnce({exists:()=>true,data:()=>({state:{name:'Ana'}})});expect(await loadProgress('a')).toEqual({name:'Ana'});
 const set=jest.fn();runTransaction.mockImplementation(async(db,fn)=>fn({get:async()=>({exists:()=>true,data:()=>({state:{best:{0:10},completed:[0],first:{date:'ontem'}}})}),set}));
 await saveProgress('a',{best:{0:4,1:8},completed:[1],first:null});expect(set).toHaveBeenCalledWith('a',expect.objectContaining({state:expect.objectContaining({best:{0:10,1:8},completed:[0,1],first:{date:'ontem'}})}));
 runTransaction.mockImplementation(async(db,fn)=>fn({get:async()=>({exists:()=>false}),set}));await saveProgress('b',{best:{},completed:[],first:null});
});

test('gravações antigas não apagam questionários concluídos, rascunhos podem avançar',async()=>{
 const before={status:'completed',answers:{interest:true}},after={status:'in_progress',answers:{interest:false}};
 const set=jest.fn();runTransaction.mockImplementation(async(db,fn)=>fn({get:async()=>({exists:()=>true,data:()=>({state:{surveys:{before,after}}})}),set}));
 await saveProgress('a',{best:{},completed:[],surveys:{before:{status:'completed',answers:{interest:false}},after:{status:'completed',answers:{interest:true}}}});
 expect(set.mock.calls[0][1].state.surveys).toEqual({before,after:{status:'completed',answers:{interest:true}}});
});

test('nova versão de questionário preserva o registro histórico anterior',async()=>{
 const before={status:'completed',answers:{interest:true}},next={version:2,status:'in_progress',answers:{education:'Ensino Médio'}};
 const set=jest.fn();runTransaction.mockImplementation(async(db,fn)=>fn({get:async()=>({exists:()=>true,data:()=>({state:{surveys:{before}}})}),set}));
 await saveProgress('a',{best:{},completed:[],surveys:{before:next}});
 expect(set.mock.calls[0][1].state).toEqual(expect.objectContaining({surveys:{before:next},surveyArchive:{before_v1:before}}));
});
