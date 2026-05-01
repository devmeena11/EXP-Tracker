import React from 'react';
import { FiCheck } from "react-icons/fi";
import { colors } from '../assets/assets';
import { withAlpha } from '../utility/colorUtils';

const Colourpicker = ({ selectedColor, onSelectColor }) => {
    return (
        <div className='grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8'>
            {colors.map((color, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => onSelectColor(color)}
                  className='relative h-12 w-full rounded-2xl border transition duration-200 hover:-translate-y-0.5'
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? '#ffffff' : withAlpha(color, 0.34),
                    boxShadow: selectedColor === color ? `0 0 0 4px ${withAlpha(color, 0.22)}` : 'none'
                  }}
                  aria-label={`Select color ${color}`}
                >
                  {selectedColor === color ? (
                    <span className='absolute inset-0 flex items-center justify-center text-white'>
                      <FiCheck />
                    </span>
                  ) : null}
                </button>
            ))}
        </div>
    );
}

export default Colourpicker;
