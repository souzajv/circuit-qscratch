require('@testing-library/jest-dom');
global.ResizeObserver = class {observe() {} disconnect() {}};
window.matchMedia = jest.fn(() => ({matches:false, addEventListener:jest.fn(), removeEventListener:jest.fn()}));
window.scrollTo = jest.fn();
Element.prototype.scrollIntoView = jest.fn();

// O DOM simulado testa os contratos e a limpeza. A animação real é conferida no navegador.
jest.mock('gsap', () => ({gsap: {
    registerPlugin: jest.fn(),
    context: jest.fn(callback => {callback(); return {revert: jest.fn()};}),
    fromTo: jest.fn(),
    ticker: {add: jest.fn(), remove: jest.fn()}
}}));
jest.mock('gsap/ScrollTrigger', () => ({ScrollTrigger: {update: jest.fn()}}));
jest.mock('lenis', () => jest.fn().mockImplementation(() => ({
    on: jest.fn(), scrollTo: jest.fn(), raf: jest.fn(), destroy: jest.fn()
})));

// O diálogo nativo é simulado no JSDOM; foco/inércia são conferidos no navegador.
HTMLDialogElement.prototype.showModal=function(){this.setAttribute("open","");};
HTMLDialogElement.prototype.close=function(){this.removeAttribute("open");};
