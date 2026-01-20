/**
 * Formatadores de dados para BabyTrack Pro
 */

/**
 * Formata peso de gramas para kg
 * @param {number} weightInGrams - Peso em gramas
 * @param {number} decimals - Casas decimais (padrão: 3)
 * @returns {string} Peso formatado com unidade
 */
export const formatWeight = (weightInGrams, decimals = 3) => {
  if (weightInGrams == null) return '-';

  const kg = weightInGrams / 1000;
  return `${kg.toFixed(decimals)} kg`;
};

/**
 * Formata peso em gramas
 * @param {number} weightInGrams - Peso em gramas
 * @returns {string} Peso formatado
 */
export const formatWeightInGrams = (weightInGrams) => {
  if (weightInGrams == null) return '-';
  return `${weightInGrams} g`;
};

/**
 * Formata altura em cm
 * @param {number} heightInCm - Altura em centímetros
 * @param {number} decimals - Casas decimais (padrão: 1)
 * @returns {string} Altura formatada com unidade
 */
export const formatHeight = (heightInCm, decimals = 1) => {
  if (heightInCm == null) return '-';
  return `${heightInCm.toFixed(decimals)} cm`;
};

/**
 * Formata perímetro cefálico
 * @param {number} pcInCm - PC em centímetros
 * @param {number} decimals - Casas decimais (padrão: 1)
 * @returns {string} PC formatado com unidade
 */
export const formatHeadCircumference = (pcInCm, decimals = 1) => {
  if (pcInCm == null) return '-';
  return `${pcInCm.toFixed(decimals)} cm`;
};

/**
 * Formata volume de líquido
 * @param {number} volumeInMl - Volume em ml
 * @param {number} decimals - Casas decimais (padrão: 0)
 * @returns {string} Volume formatado com unidade
 */
export const formatVolume = (volumeInMl, decimals = 0) => {
  if (volumeInMl == null) return '-';
  return `${volumeInMl.toFixed(decimals)} ml`;
};

/**
 * Formata percentil
 * @param {number} percentile - Percentil (0-100)
 * @returns {string} Percentil formatado
 */
export const formatPercentile = (percentile) => {
  if (percentile == null) return '-';

  // Arredonda para uma casa decimal
  const rounded = Math.round(percentile * 10) / 10;

  return `P${rounded}`;
};

/**
 * Formata z-score
 * @param {number} zscore - Z-score
 * @returns {string} Z-score formatado
 */
export const formatZScore = (zscore) => {
  if (zscore == null) return '-';

  const sign = zscore >= 0 ? '+' : '';
  return `${sign}${zscore.toFixed(2)} DP`;
};

/**
 * Formata número com separadores de milhar
 * @param {number} num - Número a formatar
 * @param {number} decimals - Casas decimais
 * @returns {string} Número formatado
 */
export const formatNumber = (num, decimals = 0) => {
  if (num == null) return '-';

  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formata telefone brasileiro
 * @param {string} phone - Telefone
 * @returns {string} Telefone formatado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Formata CPF
 * @param {string} cpf - CPF
 * @returns {string} CPF formatado
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';

  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }

  return cpf;
};

/**
 * Formata tipo de alimentação
 * @param {string} feedingType - Tipo de alimentação
 * @param {string} locale - Idioma
 * @returns {string} Tipo formatado
 */
export const formatFeedingType = (feedingType, locale = 'pt') => {
  const translations = {
    pt: {
      breast: 'Peito',
      bottle: 'Mamadeira',
      both: 'Misto'
    },
    en: {
      breast: 'Breast',
      bottle: 'Bottle',
      both: 'Both'
    },
    es: {
      breast: 'Pecho',
      bottle: 'Biberón',
      both: 'Mixto'
    }
  };

  const t = translations[locale] || translations.pt;
  return t[feedingType] || feedingType;
};

/**
 * Formata lado do peito
 * @param {string} breastSide - Lado do peito
 * @param {string} locale - Idioma
 * @returns {string} Lado formatado
 */
export const formatBreastSide = (breastSide, locale = 'pt') => {
  const translations = {
    pt: {
      left: 'Esquerdo',
      right: 'Direito',
      both: 'Ambos'
    },
    en: {
      left: 'Left',
      right: 'Right',
      both: 'Both'
    },
    es: {
      left: 'Izquierdo',
      right: 'Derecho',
      both: 'Ambos'
    }
  };

  const t = translations[locale] || translations.pt;
  return t[breastSide] || breastSide;
};

/**
 * Formata tipo de fralda
 * @param {string} diaperType - Tipo de fralda
 * @param {string} locale - Idioma
 * @returns {string} Tipo formatado
 */
export const formatDiaperType = (diaperType, locale = 'pt') => {
  const translations = {
    pt: {
      wet: 'Xixi',
      dirty: 'Cocô',
      both: 'Ambos'
    },
    en: {
      wet: 'Wet',
      dirty: 'Dirty',
      both: 'Both'
    },
    es: {
      wet: 'Pis',
      dirty: 'Caca',
      both: 'Ambos'
    }
  };

  const t = translations[locale] || translations.pt;
  return t[diaperType] || diaperType;
};

/**
 * Formata sexo do bebê
 * @param {string} sex - Sexo (M/F)
 * @param {string} locale - Idioma
 * @returns {string} Sexo formatado
 */
export const formatSex = (sex, locale = 'pt') => {
  const translations = {
    pt: {
      M: 'Masculino',
      F: 'Feminino'
    },
    en: {
      M: 'Male',
      F: 'Female'
    },
    es: {
      M: 'Masculino',
      F: 'Femenino'
    }
  };

  const t = translations[locale] || translations.pt;
  return t[sex] || sex;
};

/**
 * Formata temperatura
 * @param {number} temp - Temperatura em Celsius
 * @param {number} decimals - Casas decimais (padrão: 1)
 * @returns {string} Temperatura formatada
 */
export const formatTemperature = (temp, decimals = 1) => {
  if (temp == null) return '-';
  return `${temp.toFixed(decimals)}°C`;
};

/**
 * Capitaliza primeira letra
 * @param {string} str - String
 * @returns {string} String capitalizada
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca texto
 * @param {string} text - Texto
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Formata moeda (R$)
 * @param {number} value - Valor
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value) => {
  if (value == null) return 'R$ 0,00';

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

/**
 * Remove acentos de string
 * @param {string} str - String
 * @returns {string} String sem acentos
 */
export const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Formata dosagem de medicamento
 * @param {number} dose - Dosagem
 * @param {string} unit - Unidade (ml, mg, gotas, etc.)
 * @returns {string} Dosagem formatada
 */
export const formatDosage = (dose, unit = 'ml') => {
  if (dose == null) return '-';
  return `${dose} ${unit}`;
};

export default {
  formatWeight,
  formatWeightInGrams,
  formatHeight,
  formatHeadCircumference,
  formatVolume,
  formatPercentile,
  formatZScore,
  formatNumber,
  formatPhone,
  formatCPF,
  formatFeedingType,
  formatBreastSide,
  formatDiaperType,
  formatSex,
  formatTemperature,
  capitalize,
  truncate,
  formatCurrency,
  removeAccents,
  formatDosage
};
