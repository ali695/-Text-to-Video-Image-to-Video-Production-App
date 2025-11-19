import React from 'react';
import { GenerationConfig, CameraMotion, Atmosphere, AspectRatio } from '../types';
import { MOTIONS, ATMOSPHERES, SCENE_MOTIONS, ASPECT_RATIOS } from '../constants';
import { Video, Wind, Lock, Sun, Ratio, Clock } from 'lucide-react';

interface SettingsPanelProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, setConfig }) => {
  
  const update = (key: keyof GenerationConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-8 h-full overflow-y-auto">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-white">
          <Ratio size={18} className="text-indigo-400" /> Output Format
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => update('aspectRatio', ratio.value)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                ${config.aspectRatio === ratio.value 
                  ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }
              `}
            >
              <span className="text-2xl mb-1">{ratio.icon}</span>
              <span className="text-sm font-medium">{ratio.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-white">
          <Clock size={18} className="text-blue-400" /> Video Length
        </h3>
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-zinc-400">Duration</span>
            <span className="text-white font-medium">{config.videoLength} seconds</span>
          </div>
          <input
            type="range"
            min="4"
            max="8"
            step="1"
            value={config.videoLength}
            onChange={(e) => update('videoLength', parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>4s</span>
            <span>8s</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-white">
          <Video size={18} className="text-purple-400" /> Camera Motion
        </h3>
        <div className="space-y-2">
          {MOTIONS.map((m) => (
            <button
              key={m}
              onClick={() => update('motion', m)}
              className={`
                w-full text-left px-4 py-3 rounded-lg text-sm transition-all border
                ${config.motion === m 
                  ? 'bg-purple-500/20 border-purple-500 text-white' 
                  : 'bg-zinc-900/30 border-transparent text-zinc-400 hover:bg-zinc-800'
                }
              `}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Lock size={18} className="text-emerald-400" /> Identity Lock
          </h3>
          <button
            onClick={() => update('identityLock', !config.identityLock)}
            className={`
              w-12 h-6 rounded-full relative transition-colors duration-300
              ${config.identityLock ? 'bg-emerald-500' : 'bg-zinc-700'}
            `}
          >
            <div className={`
              absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300
              ${config.identityLock ? 'translate-x-6' : 'translate-x-0'}
            `} />
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          Prevents facial morphing and preserves character clothing strictly.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-white">
          <Sun size={18} className="text-amber-400" /> Atmosphere
        </h3>
        <select 
          value={config.atmosphere}
          onChange={(e) => update('atmosphere', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
        >
          {ATMOSPHERES.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-white">
          <Wind size={18} className="text-cyan-400" /> Scene Details
        </h3>
        <div className="flex flex-wrap gap-2">
          {SCENE_MOTIONS.map((m) => (
            <button
              key={m}
              onClick={() => update('sceneMotion', m)}
              className={`
                px-3 py-1.5 rounded-full text-xs border transition-all
                ${config.sceneMotion === m
                  ? 'bg-cyan-900/30 border-cyan-500 text-cyan-300'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }
              `}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;