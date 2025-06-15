// Point positions for the body map
// Coordinates are in percentages (0-100) relative to the image dimensions
export const pointPositions = {
  // LUNG MERIDIAN (LU1-LU11)
  LU1: { front: { x: 46, y: 27 }, back: null }, // 1st intercostal space
  LU2: { front: { x: 44, y: 25 }, back: null }, // Below clavicle
  LU3: { front: { x: 40, y: 32 }, back: null }, // Upper arm lateral
  LU4: { front: { x: 38, y: 35 }, back: null }, // Upper arm
  LU5: { front: { x: 34, y: 44 }, back: null }, // Elbow crease radial
  LU6: { front: { x: 32, y: 50 }, back: null }, // Forearm radial
  LU7: { front: { x: 30, y: 56 }, back: null }, // Wrist radial
  LU8: { front: { x: 29, y: 58 }, back: null }, // Wrist point
  LU9: { front: { x: 28, y: 60 }, back: null }, // Wrist crease radial
  LU10: { front: { x: 27, y: 63 }, back: null }, // Thenar eminence
  LU11: { front: { x: 26, y: 65 }, back: null }, // Thumb nail point

  // LARGE INTESTINE MERIDIAN (LI1-LI20)
  LI1: { front: { x: 25, y: 66 }, back: null }, // Index finger nail
  LI2: { front: { x: 26, y: 65 }, back: null }, // Index finger joint
  LI3: { front: { x: 27, y: 64 }, back: null }, // Hand dorsum
  LI4: { front: { x: 28, y: 63 }, back: null }, // Hand web (Hegu)
  LI5: { front: { x: 29, y: 61 }, back: null }, // Wrist radial
  LI6: { front: { x: 30, y: 58 }, back: null }, // Forearm
  LI7: { front: { x: 31, y: 55 }, back: null }, // Forearm
  LI8: { front: { x: 32, y: 52 }, back: null }, // Forearm
  LI9: { front: { x: 33, y: 49 }, back: null }, // Forearm
  LI10: { front: { x: 34, y: 46 }, back: null }, // Forearm
  LI11: { front: { x: 35, y: 44 }, back: null }, // Elbow lateral (Quchi)
  LI12: { front: { x: 36, y: 41 }, back: null }, // Upper arm
  LI13: { front: { x: 37, y: 38 }, back: null }, // Upper arm
  LI14: { front: { x: 38, y: 35 }, back: null }, // Upper arm
  LI15: { front: { x: 39, y: 31 }, back: null }, // Shoulder (Jianyu)
  LI16: { front: { x: 41, y: 28 }, back: null }, // Shoulder
  LI17: { front: { x: 43, y: 25 }, back: null }, // Neck lateral
  LI18: { front: { x: 45, y: 23 }, back: null }, // Neck
  LI19: { front: { x: 47, y: 20 }, back: null }, // Nose lateral
  LI20: { front: { x: 48, y: 18 }, back: null }, // Nostril (Yingxiang)

  // STOMACH MERIDIAN (ST1-ST45)
  ST1: { front: { x: 49, y: 13 }, back: null }, // Under eye
  ST2: { front: { x: 49, y: 14 }, back: null }, // Infraorbital
  ST3: { front: { x: 49, y: 15 }, back: null }, // Cheek
  ST4: { front: { x: 48, y: 16 }, back: null }, // Mouth corner
  ST5: { front: { x: 47, y: 18 }, back: null }, // Jaw angle
  ST6: { front: { x: 46, y: 19 }, back: null }, // Masseter
  ST7: { front: { x: 48, y: 11 }, back: null }, // Temple
  ST8: { front: { x: 49, y: 10 }, back: null }, // Temple corner
  ST9: { front: { x: 49, y: 22 }, back: null }, // Neck carotid
  ST10: { front: { x: 48, y: 24 }, back: null }, // Throat
  ST11: { front: { x: 47, y: 25 }, back: null }, // Supraclavicular
  ST12: { front: { x: 46, y: 26 }, back: null }, // Supraclavicular center
  ST13: { front: { x: 45, y: 27 }, back: null }, // Below clavicle
  ST14: { front: { x: 45, y: 28 }, back: null }, // 1st intercostal
  ST15: { front: { x: 45, y: 30 }, back: null }, // 2nd intercostal
  ST16: { front: { x: 45, y: 32 }, back: null }, // 3rd intercostal
  ST17: { front: { x: 45, y: 34 }, back: null }, // Nipple level
  ST18: { front: { x: 45, y: 36 }, back: null }, // 5th intercostal
  ST19: { front: { x: 45, y: 38 }, back: null }, // Upper abdomen
  ST20: { front: { x: 45, y: 40 }, back: null }, // Upper abdomen
  ST21: { front: { x: 45, y: 42 }, back: null }, // Mid abdomen
  ST22: { front: { x: 45, y: 44 }, back: null }, // Mid abdomen
  ST23: { front: { x: 45, y: 46 }, back: null }, // Mid abdomen
  ST24: { front: { x: 45, y: 48 }, back: null }, // Lower abdomen
  ST25: { front: { x: 45, y: 50 }, back: null }, // Navel lateral (Tianshu)
  ST26: { front: { x: 45, y: 52 }, back: null }, // Lower abdomen
  ST27: { front: { x: 45, y: 54 }, back: null }, // Lower abdomen
  ST28: { front: { x: 45, y: 56 }, back: null }, // Lower abdomen
  ST29: { front: { x: 45, y: 58 }, back: null }, // Lower abdomen
  ST30: { front: { x: 45, y: 60 }, back: null }, // Inguinal region
  ST31: { front: { x: 44, y: 62 }, back: null }, // Hip region
  ST32: { front: { x: 44, y: 65 }, back: null }, // Anterior thigh
  ST33: { front: { x: 44, y: 68 }, back: null }, // Anterior thigh
  ST34: { front: { x: 44, y: 71 }, back: null }, // Anterior thigh
  ST35: { front: { x: 44, y: 74 }, back: null }, // Knee lateral
  ST36: { front: { x: 43, y: 77 }, back: null }, // Below knee (Zusanli)
  ST37: { front: { x: 43, y: 80 }, back: null }, // Anterior leg
  ST38: { front: { x: 43, y: 83 }, back: null }, // Anterior leg
  ST39: { front: { x: 43, y: 86 }, back: null }, // Anterior leg
  ST40: { front: { x: 43, y: 89 }, back: null }, // Anterior leg
  ST41: { front: { x: 43, y: 92 }, back: null }, // Ankle
  ST42: { front: { x: 42, y: 95 }, back: null }, // Foot dorsum
  ST43: { front: { x: 41, y: 98 }, back: null }, // Foot dorsum
  ST44: { front: { x: 40, y: 101 }, back: null }, // Foot dorsum
  ST45: { front: { x: 39, y: 104 }, back: null }, // 2nd toe

  // SPLEEN MERIDIAN (SP1-SP21)
  SP1: { front: { x: 36, y: 106 }, back: null }, // Big toe nail
  SP2: { front: { x: 37, y: 105 }, back: null }, // Big toe joint
  SP3: { front: { x: 38, y: 104 }, back: null }, // Foot medial
  SP4: { front: { x: 39, y: 102 }, back: null }, // Foot arch
  SP5: { front: { x: 40, y: 100 }, back: null }, // Foot medial
  SP6: { front: { x: 41, y: 95 }, back: null }, // Ankle medial (Sanyinjiao)
  SP7: { front: { x: 42, y: 92 }, back: null }, // Leg medial
  SP8: { front: { x: 43, y: 89 }, back: null }, // Leg medial
  SP9: { front: { x: 44, y: 86 }, back: null }, // Knee medial
  SP10: { front: { x: 45, y: 83 }, back: null }, // Thigh medial (Xuehai)
  SP11: { front: { x: 46, y: 80 }, back: null }, // Thigh medial
  SP12: { front: { x: 47, y: 77 }, back: null }, // Inguinal region
  SP13: { front: { x: 48, y: 74 }, back: null }, // Lower abdomen
  SP14: { front: { x: 48, y: 71 }, back: null }, // Lower abdomen
  SP15: { front: { x: 48, y: 68 }, back: null }, // Abdomen lateral
  SP16: { front: { x: 48, y: 65 }, back: null }, // Abdomen lateral
  SP17: { front: { x: 48, y: 62 }, back: null }, // Lower chest
  SP18: { front: { x: 48, y: 59 }, back: null }, // Lower chest
  SP19: { front: { x: 48, y: 56 }, back: null }, // Lower chest
  SP20: { front: { x: 48, y: 53 }, back: null }, // Mid chest
  SP21: { front: { x: 48, y: 50 }, back: null }, // Lateral chest

  // HEART MERIDIAN (HT1-HT9)
  HT1: { front: { x: 65, y: 30 }, back: null }, // Armpit center
  HT2: { front: { x: 66, y: 33 }, back: null }, // Upper arm medial
  HT3: { front: { x: 67, y: 36 }, back: null }, // Upper arm medial
  HT4: { front: { x: 68, y: 39 }, back: null }, // Upper arm medial
  HT5: { front: { x: 69, y: 42 }, back: null }, // Upper arm medial
  HT6: { front: { x: 70, y: 45 }, back: null }, // Upper arm medial
  HT7: { front: { x: 71, y: 48 }, back: null }, // Wrist crease (Shenmen)
  HT8: { front: { x: 72, y: 51 }, back: null }, // Palm
  HT9: { front: { x: 73, y: 54 }, back: null }, // Little finger nail

  // SMALL INTESTINE MERIDIAN (SI1-SI19)
  SI1: { front: { x: 74, y: 66 }, back: null }, // Little finger nail
  SI2: { front: { x: 73, y: 65 }, back: null }, // Little finger joint
  SI3: { front: { x: 72, y: 64 }, back: null }, // Hand ulnar
  SI4: { front: { x: 71, y: 62 }, back: null }, // Wrist ulnar
  SI5: { front: { x: 70, y: 60 }, back: null }, // Wrist ulnar
  SI6: { front: { x: 69, y: 58 }, back: null }, // Forearm ulnar
  SI7: { front: { x: 68, y: 55 }, back: null }, // Forearm ulnar
  SI8: { front: { x: 67, y: 52 }, back: null }, // Elbow medial
  SI9: { front: null, back: { x: 33, y: 35 } }, // Shoulder posterior
  SI10: { front: null, back: { x: 35, y: 32 } }, // Shoulder blade
  SI11: { front: null, back: { x: 37, y: 30 } }, // Scapula center
  SI12: { front: null, back: { x: 39, y: 28 } }, // Scapula
  SI13: { front: null, back: { x: 41, y: 26 } }, // Scapula medial
  SI14: { front: null, back: { x: 43, y: 24 } }, // Scapula upper
  SI15: { front: null, back: { x: 45, y: 22 } }, // Upper back
  SI16: { front: null, back: { x: 47, y: 20 } }, // Neck posterior
  SI17: { front: { x: 52, y: 18 }, back: { x: 48, y: 18 } }, // Neck lateral
  SI18: { front: { x: 53, y: 15 }, back: null }, // Cheek
  SI19: { front: { x: 52, y: 12 }, back: null }, // Ear front

  // BLADDER MERIDIAN (BL1-BL67)
  BL1: { front: { x: 48, y: 11 }, back: null }, // Inner eye corner
  BL2: { front: { x: 49, y: 9 }, back: null }, // Eyebrow inner
  BL3: { front: null, back: { x: 48, y: 8 } }, // Forehead
  BL4: { front: null, back: { x: 49, y: 7 } }, // Forehead
  BL5: { front: null, back: { x: 50, y: 6 } }, // Forehead center
  BL6: { front: null, back: { x: 51, y: 7 } }, // Forehead
  BL7: { front: null, back: { x: 52, y: 8 } }, // Head top
  BL8: { front: null, back: { x: 51, y: 9 } }, // Head top
  BL9: { front: null, back: { x: 50, y: 10 } }, // Head posterior
  BL10: { front: null, back: { x: 49, y: 11 } }, // Neck posterior
  BL11: { front: null, back: { x: 48, y: 12 } }, // Upper back
  BL12: { front: null, back: { x: 47, y: 13 } }, // Upper back
  BL13: { front: null, back: { x: 46, y: 14 } }, // Upper back
  BL14: { front: null, back: { x: 45, y: 15 } }, // Upper back
  BL15: { front: null, back: { x: 44, y: 16 } }, // Upper back
  BL16: { front: null, back: { x: 43, y: 17 } }, // Upper back
  BL17: { front: null, back: { x: 42, y: 18 } }, // Upper back
  BL18: { front: null, back: { x: 41, y: 19 } }, // Upper back
  BL19: { front: null, back: { x: 40, y: 20 } }, // Upper back
  BL20: { front: null, back: { x: 39, y: 21 } }, // Upper back
  BL21: { front: null, back: { x: 38, y: 22 } }, // Upper back
  BL22: { front: null, back: { x: 37, y: 23 } }, // Upper back
  BL23: { front: null, back: { x: 36, y: 24 } }, // Upper back
  BL24: { front: null, back: { x: 35, y: 25 } }, // Upper back
  BL25: { front: null, back: { x: 34, y: 26 } }, // Upper back
  BL26: { front: null, back: { x: 33, y: 27 } }, // Upper back
  BL27: { front: null, back: { x: 32, y: 28 } }, // Upper back
  BL28: { front: null, back: { x: 31, y: 29 } }, // Upper back
  BL29: { front: null, back: { x: 30, y: 30 } }, // Upper back
  BL30: { front: null, back: { x: 29, y: 31 } }, // Upper back
  BL31: { front: null, back: { x: 28, y: 32 } }, // Upper back
  BL32: { front: null, back: { x: 27, y: 33 } }, // Upper back
  BL33: { front: null, back: { x: 26, y: 34 } }, // Upper back
  BL34: { front: null, back: { x: 25, y: 35 } }, // Upper back
  BL35: { front: null, back: { x: 24, y: 36 } }, // Upper back
  BL36: { front: null, back: { x: 23, y: 37 } }, // Upper back
  BL37: { front: null, back: { x: 22, y: 38 } }, // Upper back
  BL38: { front: null, back: { x: 21, y: 39 } }, // Upper back
  BL39: { front: null, back: { x: 20, y: 40 } }, // Upper back
  BL40: { front: null, back: { x: 19, y: 41 } }, // Upper back
  BL41: { front: null, back: { x: 18, y: 42 } }, // Upper back
  BL42: { front: null, back: { x: 17, y: 43 } }, // Upper back
  BL43: { front: null, back: { x: 16, y: 44 } }, // Upper back
  BL44: { front: null, back: { x: 15, y: 45 } }, // Upper back
  BL45: { front: null, back: { x: 14, y: 46 } }, // Upper back
  BL46: { front: null, back: { x: 13, y: 47 } }, // Upper back
  BL47: { front: null, back: { x: 12, y: 48 } }, // Upper back
  BL48: { front: null, back: { x: 11, y: 49 } }, // Upper back
  BL49: { front: null, back: { x: 10, y: 50 } }, // Upper back
  BL50: { front: null, back: { x: 9, y: 51 } }, // Upper back
  BL51: { front: null, back: { x: 8, y: 52 } }, // Upper back
  BL52: { front: null, back: { x: 7, y: 53 } }, // Upper back
  BL53: { front: null, back: { x: 6, y: 54 } }, // Upper back
  BL54: { front: null, back: { x: 5, y: 55 } }, // Upper back
  BL55: { front: null, back: { x: 4, y: 56 } }, // Upper back
  BL56: { front: null, back: { x: 3, y: 57 } }, // Upper back
  BL57: { front: null, back: { x: 2, y: 58 } }, // Upper back
  BL58: { front: null, back: { x: 1, y: 59 } }, // Upper back
  BL59: { front: null, back: { x: 0, y: 60 } }, // Upper back
  BL60: { front: null, back: { x: 1, y: 61 } }, // Upper back
  BL61: { front: null, back: { x: 2, y: 62 } }, // Upper back
  BL62: { front: null, back: { x: 3, y: 63 } }, // Upper back
  BL63: { front: null, back: { x: 4, y: 64 } }, // Upper back
  BL64: { front: null, back: { x: 5, y: 65 } }, // Upper back
  BL65: { front: null, back: { x: 6, y: 66 } }, // Upper back
  BL66: { front: null, back: { x: 7, y: 67 } }, // Upper back
  BL67: { front: null, back: { x: 8, y: 68 } }, // Upper back
};
