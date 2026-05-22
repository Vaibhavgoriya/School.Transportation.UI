/* eslint-disable @typescript-eslint/no-explicit-any */
// LanguageSetup.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LanguageTranslationsResponse } from "./Models/ResponseModels/LanguageTranslationsResponse";
import { DefaultLanguage, LocalStorage_Lanaguage } from "./Constants";

export const initializeI18n = async (
  languageTranslations: LanguageTranslationsResponse[]
) => {
  const resources: any = {};
  languageTranslations.forEach((res: LanguageTranslationsResponse) => {
    if (!resources[res.LanguageCode]) {
      resources[res.LanguageCode] = { translation: {} };
    }
    resources[res.LanguageCode].translation[res.Text] = res.LocalizedText;
  });

  const defaultLanguage =
    localStorage.getItem(LocalStorage_Lanaguage) || DefaultLanguage;
  await i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: DefaultLanguage,
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

  return i18n;
};
