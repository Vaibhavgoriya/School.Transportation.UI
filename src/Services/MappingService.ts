import { LanguagesResponse } from "../Models/ResponseModels/LanguagesResponse";
import { LanguageTranslationsResponse } from "../Models/ResponseModels/LanguageTranslationsResponse";

export default class MappingService {
  static mapToLanguagesAsync(languages: any): LanguagesResponse[] {
    return languages.map((lan: any) => ({
      Id: lan.id,
      LanguageCode: lan.languageCode,
      LanguageName: lan.languageName,
    }));
  }

  static async mapToLanguageTranslationsResponseAsync(
    lanTrans: any[]
  ): Promise<LanguageTranslationsResponse[]> {
    return Promise.all(
      lanTrans.map(async (lan: any) => ({
        Id: lan.id,
        Text: lan.text,
        LocalizedText: lan.localizedText,
        ApplicationName: lan.applicationName,
        LanguageCode: lan.languageCode,
        LanguageName: lan.languageName,
      }))
    );
  }
}
