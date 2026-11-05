import React from 'react';
jest.mock('react-dom/client',()=>({createRoot:jest.fn(()=>({render:jest.fn()}))}));
jest.mock('../../src/app/App',()=>()=> <span>Aplicação</span>);
test('entrada conecta aplicação à raiz HTML',()=>{
 document.body.innerHTML='<div id="root"></div>';
 require('../../src/app/index');
 const {createRoot}=require('react-dom/client');
 expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
});
