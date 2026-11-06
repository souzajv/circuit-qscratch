import {renderHook,act} from '@testing-library/react';
import Lenis from 'lenis';
import useTrailScroll from '../../src/app/hooks/useTrailScroll';
test('inicia relógio próprio, redimensiona e restaura rolagem nativa ao mudar layout',()=>{
 jest.useFakeTimers();Lenis.mockClear();
 const wrapper=document.createElement('section'),content=document.createElement('ol');wrapper.append(content);wrapper.style.overflowY='auto';
 const ref={current:content};const {unmount}=renderHook(()=>useTrailScroll(ref,true));act(()=>jest.advanceTimersByTime(30));
 expect(Lenis).toHaveBeenCalledWith(expect.objectContaining({wrapper,content,autoRaf:true,syncTouch:false}));
 const instance=Lenis.mock.results[0].value;instance.resize=jest.fn();
 act(()=>window.dispatchEvent(new Event('resize')));expect(instance.resize).toHaveBeenCalled();
 wrapper.style.overflowY='visible';act(()=>window.dispatchEvent(new Event('resize')));expect(instance.destroy).toHaveBeenCalled();unmount();jest.useRealTimers();
});
test('não intercepta roda quando animações estão desligadas',()=>{
 jest.useFakeTimers();Lenis.mockClear();const wrapper=document.createElement('section'),content=document.createElement('ol');wrapper.append(content);wrapper.style.overflowY='auto';
 const view=renderHook(()=>useTrailScroll({current:content},false));act(()=>jest.advanceTimersByTime(30));expect(Lenis).not.toHaveBeenCalled();view.unmount();jest.useRealTimers();
});
