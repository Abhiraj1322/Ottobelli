// CustomizationModal.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Plus } from 'lucide-react';
import api from '../../api/axios';

const SHOULDER_OPTIONS = [
  { id: 'standard', label: 'Standard', img: '/customizer/shoulder-standard.png', desc: 'More padding for a professional look.' },
  { id: 'roped', label: 'Roped', img: '/customizer/shoulder-roped.png', desc: 'Roped appearance accentuates the shoulders.' },
  { id: 'soft', label: 'Soft', img: '/customizer/shoulder-soft.png', desc: 'Very little padding for casual comfort.' },
];

const JACKET_OPTIONS = [
  { label: 'Lapels', key: 'Lapels', options: ['Peak Lapel (3-3.2")', 'Notch Lapel', 'Shawl Lapel'] },
  { label: 'Buttons', key: 'Buttons', options: ['Horn Royal Black', 'Horn Royal Brown', 'Metal Gold'] },
  { label: 'Vents', key: 'Vents', options: ['Double Vent', 'Single Vent', 'No Vent'] },
  { label: 'Jacket Cuff Buttons', key: 'Jacket Cuff Buttons', options: ['Three', 'Four', 'Kissing Four'] },
  { label: 'Pocket Accent', key: 'Pocket Accent', options: ['Standard', 'Flap', 'Jetted'] },
  { label: 'Jacket Lining', key: 'Jacket Lining', options: ['Default', 'Bemberg Silk', 'Custom Pattern'] },
  { label: 'Jacket Lining Type', key: 'Jacket Lining Type', options: ['Full Lining', 'Half Lining', 'Unlined'] },
  { label: 'Elbow Patches', key: 'Elbow Patches', options: ['None', 'Suede Brown', 'Suede Black'] },
];

const TROUSER_OPTIONS = [
  { label: 'Pants Lining', key: 'Pants Lining', options: ['No Lining', 'Half Lining (Front)'] },
  { label: 'Pocket Style', key: 'Pocket Style', options: ['Cross', 'Slanted', 'Vertical'] },
  { label: 'Pleats', key: 'Pleats', options: ['Flat Front', 'Single Pleat', 'Double Pleat'] },
  { label: 'Back Pockets', key: 'Back Pockets', options: ['2 Welted Pockets', '1 Welted Pocket', 'No Pocket'] },
  { label: 'Belt Loops', key: 'Belt Loops', options: ['Yes', 'Side Adjusters', 'Both'] },
];

const CustomizationModal = ({ product, onClose, onSaved }) => {
  const [openSection, setOpenSection] = useState('shoulder');
  const [selections, setSelections] = useState({
    'Shoulder Type': 'Standard',
    'Lapels': 'Peak Lapel (3-3.2")',
    'Buttons': 'Horn Royal Black',
    'Vents': 'Double Vent',
    'Jacket Cuff Buttons': 'Three',
    'Pocket Accent': 'Standard',
    'Jacket Lining': 'Default',
    'Jacket Lining Type': 'Full Lining',
    'Elbow Patches': 'None',
    'Monogram Text': '',
    'Add Vest': false,
    'Pants Lining': 'No Lining',
    'Pocket Style': 'Cross',
    'Pleats': 'Flat Front',
    'Back Pockets': '2 Welted Pockets',
    'Belt Loops': 'Yes',
    'Square and Tie': false,
    'Additional Pants': false,
    'Tailor Changes': 'Yes - Change if required',
    'Comments': ''
  });
  // Calculate total extra fees based on selections
const calculateAdditionalFee = () => {
  let fee = 0;
  if (selections['Add Vest']) fee += 90;
  if (selections['Square and Tie']) fee += 39;
  if (selections['Additional Pants']) fee += 100;
  return fee;
};


  const handleSelect = (category, value) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  const handleSave = async () => {
    try {

      const additionalFee = calculateAdditionalFee();
      const res = await api.post('/api/customizations', {
        productId: product?._id,
        selections,
        additionalFee
      });

      const customizationId = res.data.customization._id;
      console.log("Extracted Customization ID:", customizationId);

      onSaved(customizationId,additionalFee);
    } catch (err) {
      console.error('Failed to save customization:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#09090E] text-white border border-white/10 max-h-[90vh] overflow-y-auto p-6 rounded-sm">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <h3 className="text-sm font-bold tracking-widest uppercase">Customization Preferences</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
        </div>

        {/* SECTION 1: SHOULDER TYPE */}
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

        {/* SECTION 2: JACKET CUSTOMIZATIONS */}
        <div className="py-4 border-b border-white/10">
          <button 
            onClick={() => setOpenSection(openSection === 'jacket' ? null : 'jacket')}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="text-xs uppercase tracking-wider">Jacket Customizations</span>
            {openSection === 'jacket' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSection === 'jacket' && (
            <div className="mt-4 space-y-3">
              {JACKET_OPTIONS.map(({ label, key, options }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase text-white/50">{label}</label>
                  <select
                    value={selections[key]}
                    onChange={(e) => handleSelect(key, e.target.value)}
                    className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded focus:border-[#C8A96E] outline-none"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#09090E] text-white">{opt}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex flex-col gap-1 pt-2">
                <label className="text-[10px] uppercase text-white/50">Monogram Text</label>
                <input
                  type="text"
                  placeholder="Enter Monogram Initials"
                  value={selections['Monogram Text']}
                  onChange={(e) => handleSelect('Monogram Text', e.target.value)}
                  className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded focus:border-[#C8A96E] outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: ADD A VEST */}
        <div className="py-4 border-b border-white/10 flex justify-between items-center">
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold">ADD A VEST (+$90)</h4>
            <p className="text-[10px] text-white/50 mt-1 max-w-sm">
              Get more versatility out of your suit with a matching vest. Vest lining matches jacket lining.
            </p>
          </div>
          <button
            onClick={() => handleSelect('Add Vest', !selections['Add Vest'])}
            className={`px-3 py-2 text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1 ${
              selections['Add Vest']
                ? 'bg-white/10 text-[#C8A96E] border border-[#C8A96E]'
                : 'bg-[#C8A96E] text-black hover:opacity-90'
            }`}
          >
            {selections['Add Vest'] ? <Check size={12} /> : <Plus size={12} />}
            {selections['Add Vest'] ? 'Added' : 'Add Vest'}
          </button>
        </div>

        {/* SECTION 4: TROUSERS */}
        <div className="py-4 border-b border-white/10">
          <button 
            onClick={() => setOpenSection(openSection === 'trousers' ? null : 'trousers')}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="text-xs uppercase tracking-wider">Trouser Customizations</span>
            {openSection === 'trousers' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSection === 'trousers' && (
            <div className="mt-4 space-y-3">
              {TROUSER_OPTIONS.map(({ label, key, options }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase text-white/50">{label}</label>
                  <select
                    value={selections[key]}
                    onChange={(e) => handleSelect(key, e.target.value)}
                    className="w-full text-xs p-2.5 bg-white/5 border border-white/10 text-white rounded focus:border-[#C8A96E] outline-none"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#09090E] text-white">{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5: ADD-ONS */}
        <div className="py-4 border-b border-white/10 space-y-3">
          <h4 className="text-xs uppercase tracking-wider font-bold">Add-Ons</h4>
          
          <label className="flex items-center justify-between cursor-pointer text-xs">
            <span>Square and Tie (+$39)</span>
            <input
              type="checkbox"
              checked={selections['Square and Tie']}
              onChange={(e) => handleSelect('Square and Tie', e.target.checked)}
              className="accent-[#C8A96E] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-xs">
            <div>
              <span>Additional Pants (+$100)</span>
              <p className="text-[10px] text-white/40">Trousers wear out faster. Save by adding an extra pair now.</p>
            </div>
            <input
              type="checkbox"
              checked={selections['Additional Pants']}
              onChange={(e) => handleSelect('Additional Pants', e.target.checked)}
              className="accent-[#C8A96E] w-4 h-4"
            />
          </label>
        </div>

        {/* SECTION 6: TAILOR CHANGES */}
        <div className="py-4 border-b border-white/10 space-y-2">
          <h4 className="text-xs uppercase tracking-wider font-bold">Tailor Changes</h4>
          <p className="text-[10px] text-white/50">
            Our tailors may make small changes if required to fit better.
          </p>

          <div className="space-y-1.5 pt-1">
            {['Yes - Change if required', 'No - Contact me'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="tailorChanges"
                  value={opt}
                  checked={selections['Tailor Changes'] === opt}
                  onChange={(e) => handleSelect('Tailor Changes', e.target.value)}
                  className="accent-[#C8A96E]"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 7: COMMENTS */}
        <div className="py-4 border-b border-white/10 space-y-2">
          <label className="text-xs uppercase tracking-wider font-bold block">Comments</label>
          <textarea
            maxLength={200}
            rows={3}
            placeholder="Mention any special requirements..."
            value={selections['Comments']}
            onChange={(e) => handleSelect('Comments', e.target.value)}
            className="w-full text-xs p-3 bg-white/5 border border-white/10 text-white rounded focus:border-[#C8A96E] outline-none resize-none"
          />
          <div className="text-right text-[10px] text-white/40">
            {selections['Comments'].length} / 200 characters
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSave}
          className="w-full mt-6 py-3 bg-[#C8A96E] text-black text-xs font-bold uppercase tracking-widest hover:opacity-90 transition"
        >
          Save Customizations {calculateAdditionalFee() > 0 && `(+$${calculateAdditionalFee()})`}
        </button>
      </div>
    </div>
  );
};

export default CustomizationModal;