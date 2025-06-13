import React, { useState, useEffect, useCallback } from 'react';
import Flashcard from './Flashcard';
import FlashcardModal from './FlashcardModal';
import { useSettings } from '../context/SettingsContext';
import { hasSeenElementModal, markElementModalAsSeen } from '../utils/hasSeenPopup';

interface FlashcardSessionProps {
  sessionMode: string;
  shuffleMode: boolean;
  navigateTo: (page: string) => void;
  [key: string]: any; // For any other props passed through to Flashcard
}

// Type the Flashcard component props to avoid TypeScript errors
interface FlashcardProps {
  sessionMode: string;
  shuffleMode: boolean;
  navigateTo: (page: string) => void;
  onCardChange?: (cardData: any) => void;
  [key: string]: any;
}

// Helper to get element from meridian name
const getElementFromMeridian = (meridianName: string): string => {
  if (!meridianName) return 'Metal';
  
  const normalizedName = meridianName.replace(/\s*\([^)]*\)/, '').trim();
  const elementMap: { [key: string]: string } = {
    'Lung': 'Metal', 'Large Intestine': 'Metal',
    'Heart': 'Fire', 'Small Intestine': 'Fire', 'Pericardium': 'Fire', 'Triple Heater': 'Fire', 'Triple Burner': 'Fire',
    'Stomach': 'Earth', 'Spleen': 'Earth',
    'Kidney': 'Water', 'Bladder': 'Water', 'Urinary Bladder': 'Water',
    'Liver': 'Wood', 'Gallbladder': 'Wood'
  };
  
  return elementMap[normalizedName] || 'Metal';
};

const FlashcardSession: React.FC<FlashcardSessionProps> = ({ 
  sessionMode, 
  shuffleMode, 
  navigateTo, 
  ...otherProps 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentElement, setCurrentElement] = useState<string>('');
  const [lastCheckedMeridian, setLastCheckedMeridian] = useState<string>('');
    const { showElementTheoryModal } = useSettings();

  // Debug logging
  useEffect(() => {
    console.log('🔍 FlashcardSession Debug:', {
      showElementTheoryModal,
      showModal,
      currentElement,
      lastCheckedMeridian
    });
  }, [showElementTheoryModal, showModal, currentElement, lastCheckedMeridian]);

  // Callback to handle when the flashcard component updates
  const handleCardChange = useCallback((cardData: any) => {
    console.log('📊 Card Change:', {
      showElementTheoryModal,
      cardData: cardData?.meridian,
      lastCheckedMeridian
    });

    if (!showElementTheoryModal || !cardData?.meridian) return;

    const meridianName = cardData.meridian;
    
    // Only check if meridian has changed to avoid repeated popups
    if (meridianName !== lastCheckedMeridian) {
      setLastCheckedMeridian(meridianName);
      
      const element = getElementFromMeridian(meridianName);
      console.log('🎯 Element Detection:', { meridianName, element });
      
      // Check if we should show the modal for this element
      if (!hasSeenElementModal(element)) {
        console.log('✅ Showing modal for element:', element);
        setCurrentElement(element);
        setShowModal(true);
        markElementModalAsSeen(element);
      } else {
        console.log('❌ Modal already seen for element:', element);
      }
    }
  }, [showElementTheoryModal, lastCheckedMeridian]);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentElement('');
  };
  return (
    <>
      {React.createElement(Flashcard as any, {
        sessionMode,
        shuffleMode,
        navigateTo,
        onCardChange: handleCardChange,
        ...otherProps
      } as FlashcardProps)}
      
      {showModal && currentElement && (
        <FlashcardModal
          element={currentElement}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default FlashcardSession;
