import React from 'react';
import { useGameStore } from '../store/gameStore';
import { RotateCcw, AlertTriangle, Skull, X } from 'lucide-react';

interface ResetGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetGameModal: React.FC<ResetGameModalProps> = ({ isOpen, onClose }) => {
  const resetGame = useGameStore((state) => state.resetGame);

  if (!isOpen) return null;

  const handleConfirmReset = () => {
    resetGame();
    onClose();
  };

  return (
    <div 
      id="reset-game-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="reset-game-modal-card"
        className="relative w-full max-w-md bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-red-950/50 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-reset-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <RotateCcw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              ¿Renacer desde Cero?
            </h2>
            <p className="text-xs text-red-400 font-medium flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Reinicio total e irreversible
            </p>
          </div>
        </div>

        {/* Body content */}
        <div className="space-y-3 text-sm text-slate-300 mb-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
          <p className="leading-relaxed">
            Si no estás feliz con el camino actual de tu personaje o deseas probar una estrategia completamente diferente, puedes <strong>renacer inmediatamente desde cero</strong>.
          </p>
          <div className="text-xs text-slate-400 space-y-1.5 pt-1 border-t border-slate-800">
            <p className="flex items-center gap-1.5 text-red-300">
              <Skull className="w-3.5 h-3.5 shrink-0 text-red-400" />
              Perderás todo el dinero acumulado, negocios y nivel de Aura.
            </p>
            <p className="flex items-center gap-1.5 text-amber-300/90">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              Se cancelarán todas las changas y rituales en curso.
            </p>
            <p className="flex items-center gap-1.5 text-slate-400">
              <span>•</span>
              Se reiniciarán las fichas y mejoras permanentes de prestigio.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="btn-cancel-reset"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer text-center"
          >
            Cancelar y Continuar
          </button>

          <button
            id="btn-confirm-hard-reset"
            onClick={handleConfirmReset}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950/60 border border-red-400/40 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-center"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>Sí, Renacer a Cero</span>
          </button>
        </div>
      </div>
    </div>
  );
};
