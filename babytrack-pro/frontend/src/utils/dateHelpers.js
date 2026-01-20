import {
  format,
  formatDistance,
  formatRelative,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  parseISO,
  isValid
} from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';

const locales = { pt: ptBR, en: enUS, es };

/**
 * Formata uma data em formato legível
 * @param {Date|string} date - Data a ser formatada
 * @param {string} formatStr - Formato desejado
 * @param {string} locale - Localidade (pt, en, es)
 * @returns {string} Data formatada
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy', locale = 'pt') => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';

    return format(dateObj, formatStr, { locale: locales[locale] || ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Formata data e hora
 * @param {Date|string} date - Data a ser formatada
 * @param {string} locale - Localidade
 * @returns {string} Data e hora formatadas
 */
export const formatDateTime = (date, locale = 'pt') => {
  return formatDate(date, 'dd/MM/yyyy HH:mm', locale);
};

/**
 * Formata apenas a hora
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Hora formatada
 */
export const formatTime = (date) => {
  return formatDate(date, 'HH:mm');
};

/**
 * Retorna distância relativa entre datas
 * @param {Date|string} date - Data de referência
 * @param {Date|string} baseDate - Data base (padrão: agora)
 * @param {string} locale - Localidade
 * @returns {string} Distância formatada (ex: "há 2 horas")
 */
export const formatRelativeTime = (date, baseDate = new Date(), locale = 'pt') => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const baseDateObj = typeof baseDate === 'string' ? parseISO(baseDate) : baseDate;

    return formatDistance(dateObj, baseDateObj, {
      addSuffix: true,
      locale: locales[locale] || ptBR
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

/**
 * Retorna data relativa formatada
 * @param {Date|string} date - Data de referência
 * @param {Date|string} baseDate - Data base
 * @param {string} locale - Localidade
 * @returns {string} Data relativa (ex: "ontem às 14:00")
 */
export const formatRelativeDate = (date, baseDate = new Date(), locale = 'pt') => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const baseDateObj = typeof baseDate === 'string' ? parseISO(baseDate) : baseDate;

    return formatRelative(dateObj, baseDateObj, { locale: locales[locale] || ptBR });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return '';
  }
};

/**
 * Calcula idade em dias, semanas ou meses
 * @param {Date|string} birthDate - Data de nascimento
 * @param {Date|string} referenceDate - Data de referência (padrão: hoje)
 * @returns {Object} Objeto com dias, semanas e meses
 */
export const calculateAge = (birthDate, referenceDate = new Date()) => {
  if (!birthDate) return { days: 0, weeks: 0, months: 0 };

  try {
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    const reference = typeof referenceDate === 'string' ? parseISO(referenceDate) : referenceDate;

    const days = differenceInDays(reference, birth);
    const weeks = differenceInWeeks(reference, birth);
    const months = differenceInMonths(reference, birth);

    return { days, weeks, months };
  } catch (error) {
    console.error('Error calculating age:', error);
    return { days: 0, weeks: 0, months: 0 };
  }
};

/**
 * Formata idade de forma legível
 * @param {Date|string} birthDate - Data de nascimento
 * @param {string} locale - Localidade
 * @returns {string} Idade formatada
 */
export const formatAge = (birthDate, locale = 'pt') => {
  const { days, weeks, months } = calculateAge(birthDate);

  const translations = {
    pt: {
      day: 'dia',
      days: 'dias',
      week: 'semana',
      weeks: 'semanas',
      month: 'mês',
      months: 'meses'
    },
    en: {
      day: 'day',
      days: 'days',
      week: 'week',
      weeks: 'weeks',
      month: 'month',
      months: 'months'
    },
    es: {
      day: 'día',
      days: 'días',
      week: 'semana',
      weeks: 'semanas',
      month: 'mes',
      months: 'meses'
    }
  };

  const t = translations[locale] || translations.pt;

  if (months >= 1) {
    return `${months} ${months === 1 ? t.month : t.months}`;
  } else if (weeks >= 1) {
    return `${weeks} ${weeks === 1 ? t.week : t.weeks}`;
  } else {
    return `${days} ${days === 1 ? t.day : t.days}`;
  }
};

/**
 * Retorna início do dia
 * @param {Date|string} date - Data
 * @returns {Date} Início do dia
 */
export const getStartOfDay = (date = new Date()) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(dateObj);
};

/**
 * Retorna fim do dia
 * @param {Date|string} date - Data
 * @returns {Date} Fim do dia
 */
export const getEndOfDay = (date = new Date()) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfDay(dateObj);
};

/**
 * Adiciona dias a uma data
 * @param {Date|string} date - Data base
 * @param {number} amount - Quantidade de dias
 * @returns {Date} Nova data
 */
export const addDaysToDate = (date, amount) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, amount);
};

/**
 * Subtrai dias de uma data
 * @param {Date|string} date - Data base
 * @param {number} amount - Quantidade de dias
 * @returns {Date} Nova data
 */
export const subtractDaysFromDate = (date, amount) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return subDays(dateObj, amount);
};

/**
 * Converte string ISO para Date
 * @param {string} dateString - String de data
 * @returns {Date|null} Objeto Date ou null
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;

  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Verifica se uma data é válida
 * @param {Date|string} date - Data a verificar
 * @returns {boolean} Verdadeiro se válida
 */
export const isValidDate = (date) => {
  if (!date) return false;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  } catch (error) {
    return false;
  }
};

/**
 * Formata duração em minutos para HH:MM
 * @param {number} minutes - Minutos
 * @returns {string} Duração formatada
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '00:00';

  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Converte segundos para MM:SS
 * @param {number} seconds - Segundos
 * @returns {string} Tempo formatado
 */
export const formatSeconds = (seconds) => {
  if (!seconds || seconds < 0) return '00:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatRelativeDate,
  calculateAge,
  formatAge,
  getStartOfDay,
  getEndOfDay,
  addDaysToDate,
  subtractDaysFromDate,
  parseDate,
  isValidDate,
  formatDuration,
  formatSeconds
};
