import {classroom} from '../../src/infrastructure/firebase/classroom';
import {auth} from '../../src/infrastructure/firebase/auth';
jest.mock('../../src/infrastructure/firebase/auth',()=>({auth:jest.fn()}));
beforeEach(()=>{global.fetch=jest.fn();});
test('envia token atualizado para operações protegidas e rejeita sessão ausente',async()=>{
 auth.mockReturnValue({currentUser:null});await expect(classroom('list')).rejects.toThrow('Entre');expect(fetch).not.toHaveBeenCalled();
 auth.mockReturnValue({currentUser:{getIdToken:async()=> 'identity'}});fetch.mockResolvedValue({ok:true,json:async()=>({items:[]})});
 expect(await classroom('list')).toEqual({items:[]});expect(fetch).toHaveBeenCalledWith('/api/classroom',expect.objectContaining({headers:expect.objectContaining({Authorization:'Bearer identity'})}));
});
test('resgate não exige sessão e erros de rede ou serviço são apresentados',async()=>{
 fetch.mockResolvedValueOnce({ok:true,json:async()=>({token:'custom'})});expect(await classroom('redeem',{id:'a',secret:'b'})).toEqual({token:'custom'});
 expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
 fetch.mockResolvedValueOnce({ok:false,json:async()=>({error:'Revogado'})});await expect(classroom('redeem',{})).rejects.toThrow('Revogado');
 fetch.mockResolvedValueOnce({ok:false,json:async()=>({})});await expect(classroom('redeem',{})).rejects.toThrow('Não foi possível');
 fetch.mockResolvedValueOnce({ok:false,json:async()=>{throw Error();}});await expect(classroom('redeem',{})).rejects.toThrow('não está disponível');
});
