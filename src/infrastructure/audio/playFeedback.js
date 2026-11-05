// O áudio é um recurso opcional: falhas do navegador não podem interromper a atividade.
export default function playFeedback(kind, enabled, browser = window) {
  if (!enabled) return;
  try {
    const Audio = browser.AudioContext || browser.webkitAudioContext;
    if (!Audio) return;
    const ctx = new Audio();
    const osc = ctx.createOscillator(),
      gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(kind === 'success' ? 523 : 440, ctx.currentTime);
    if (kind === 'success') osc.frequency.setValueAtTime(784, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
    osc.onended = () => ctx.close();
  } catch (_) {/* Navegadores sem áudio continuam oferecendo retorno visual e textual. */}
}
