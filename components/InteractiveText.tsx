
import React from 'react';
import { Word } from '../types';

interface InteractiveTextProps {
  content: string;
  words: Word[]; // The full word bag to look up definitions
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({ content, words }) => {
  // Regex to split text by markdown bold syntax: **word** or **word phrase**
  // Capturing group (...) keeps the delimiter in the result array
  const parts = content.split(/(\*\*.*?\*\*)/g);

  return (
    <div className="leading-loose text-lg text-dark-800 whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Check if this segment is a bolded word
        if (part.startsWith('**') && part.endsWith('**')) {
          const cleanWordText = part.slice(2, -2);
          
          // Try to find the matching word object in the user's bag (case-insensitive)
          const wordObj = words.find(w => w.word.toLowerCase() === cleanWordText.toLowerCase());

          return (
            <span key={index} className="relative group inline-block cursor-help align-middle mx-1">
              {/* Highlighted Chip */}
              <span className="
                font-bold text-brand-900 bg-brand-200 
                px-2 py-0.5 rounded-lg 
                border-b-2 border-brand-400 
                transition-all duration-200
                group-hover:bg-brand-300 group-hover:scale-105 group-hover:-translate-y-0.5
                shadow-sm
              ">
                {cleanWordText}
              </span>

              {/* Tooltip Popup */}
              <div className="
                absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 
                hidden group-hover:block z-50 
                pointer-events-none 
                animate-tooltip-fade-in
              ">
                <div className="bg-dark-900/95 backdrop-blur-xl text-white p-5 rounded-2xl shadow-xl border border-white/10 relative">
                  {/* Triangle Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-8 border-transparent border-t-dark-900/95"></div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-xl capitalize text-brand-400 font-serif">
                      {wordObj?.word || cleanWordText}
                    </p>
                    {wordObj?.language && (
                      <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-1 rounded-full text-gray-300">
                        {wordObj.language}
                      </span>
                    )}
                  </div>
                  
                  {wordObj ? (
                     <div className="space-y-3">
                       {wordObj.translation ? (
                         <div className="text-sm font-medium leading-relaxed text-gray-100">
                           {wordObj.translation}
                         </div>
                       ) : (
                         <div className="text-xs text-gray-500 italic">No definition saved.</div>
                       )}
                       
                       {wordObj.exampleSentence && (
                         <div className="text-xs text-gray-400 italic border-l-2 border-brand-500 pl-3 leading-relaxed">
                           "{wordObj.exampleSentence}"
                         </div>
                       )}
                     </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Word found in text but not in your bag.
                    </div>
                  )}
                </div>
              </div>
            </span>
          );
        }
        // Return normal text
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};
