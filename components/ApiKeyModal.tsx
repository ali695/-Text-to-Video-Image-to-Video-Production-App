import React from 'react';
import Button from './Button';
import { Key } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onConnect: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onConnect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Key className="text-indigo-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connect Google AI</h2>
        <p className="text-zinc-400 mb-8">
          To generate high-quality videos with Veo 3.1, you need to connect your Google AI Studio account.
        </p>
        <Button 
          onClick={onConnect} 
          className="w-full mb-4"
          variant="primary"
        >
          Select API Key
        </Button>
        <p className="text-xs text-zinc-500">
          Don't have a key? <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Get one here</a>.
          <br/>
          See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">billing docs</a> for usage details.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;