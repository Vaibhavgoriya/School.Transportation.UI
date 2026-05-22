
import i18n from 'i18next';
import { LanguagesResponse } from "./Models/ResponseModels/LanguagesResponse";
import { DefaultLanguage, LocalStorage_Lanaguage } from './Constants';

const normalizeLang = (lang: string) => lang?.toLowerCase().replace("_", "-");

export const getUserLang = (): string => {
  const storedLang = localStorage.getItem(LocalStorage_Lanaguage);
  const browserLang = navigator.language;
  return normalizeLang(storedLang || browserLang || DefaultLanguage);
};

export const getUserLangAbsolute = (): string => {
    const output = getUserLang();
    return output === "" ? "en-us" : output;
};

/**
 * Gets the selected language based on available languages passed to it.
 */
export const getSelectedLang = (availableLanguages: LanguagesResponse[]) => {
  const userLang = getUserLang();
  const selectedLang =
    availableLanguages.find((lang) => normalizeLang(lang.LanguageCode) === userLang) ||
    availableLanguages.find((lang) => lang.LanguageCode === DefaultLanguage);

  return {
    userLang,
    selectedLang,
  };
};

export const changeLanguage = (locale: string) => {
  i18n.changeLanguage(locale);
  localStorage.setItem(LocalStorage_Lanaguage, locale);
};