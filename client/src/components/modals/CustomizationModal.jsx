// CustomizationModal.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import api from '../../api/axios';

const SHOULDER_OPTIONS = [
  { id: 'standard', label: 'Standard', img: '/customizer/shoulder-standard.png', desc: 'More padding for a professional look.' },
  { id: 'roped', label: 'Roped', img: '/customizer/shoulder-roped.png', desc: 'Roped appearance accentuates the shoulders.' },
  { id: 'soft', label: 'Soft', img: '/customizer/shoulder-soft.png', desc: 'Very little padding for casual comfort.' },
];

const CustomizationModal = ({ product, onClose, onSaved }) => {
  const [openSection, setOpenSection] = useState('shoulder');
  const [selections, setSelections] = useState({
    'Shoulder Type': 'Standard',
    'Canvas Type': 'Half Canvas',
    'Lapels': 'Notch',
    'Buttons': 'Two'
  });

  const handleSelect = (category, value) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await api.post('/api/customizations', {
        productId: product._id,
        selections
      });
      onSaved(res.data._id); // Return saved ObjectId to parent
    } catch (err) {
      console.error('Failed to save customization:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#09090E] text-white border border-white/10 max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <h3 className="text-sm font-bold tracking-widest uppercase">Customization Preferences</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
        </div>

        {/* Collapsible Section: Shoulder Type */}
        <div className="py-4 border-b border-white/10">
          <button 
            onClick={() => setOpenSection(openSection === 'shoulder' ? null : 'shoulder')}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="text-xs uppercase tracking-wider">
              Shoulder Type: <strong className="text-[#C8A96E]">{selections['Shoulder Type']}</strong>
            </span>
            {openSection === 'shoulder' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSection === 'shoulder' && (
            <div className="mt-4">
              <p className="text-[11px] text-white/60 mb-4">{SHOULDER_OPTIONS[0].desc}</p>
              <div className="grid grid-cols-3 gap-3">
                {SHOULDER_OPTIONS.map((opt) => {
                  const isSelected = selections['Shoulder Type'] === opt.label;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect('Shoulder Type', opt.label)}
                      className={`cursor-pointer border p-2 transition-all ${
                        isSelected ? 'border-[#C8A96E] bg-white/5' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={opt.img} alt={opt.label} className="w-full h-24 object-contain mb-2" />
                      <div className="flex items-center justify-between text-[10px] uppercase">
                        <span>{opt.label}</span>
                        {isSelected && <Check size={12} className="text-[#C8A96E]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={handleSave}
          className="w-full mt-6 py-3 bg-[#C8A96E] text-black text-xs font-bold uppercase tracking-widest hover:opacity-90"
        >
          Save Customizations
        </button>
      </div>
    </div>
  );
};

export default CustomizationModal;