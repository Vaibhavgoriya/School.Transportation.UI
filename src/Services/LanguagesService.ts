import { LanguagesResponse } from "../Models/ResponseModels/LanguagesResponse";
import { LanguageTranslationsResponse } from "../Models/ResponseModels/LanguageTranslationsResponse";
import BaseService from "./BaseService";
import MappingService from "./MappingService";

export default class LanguagesService extends BaseService {
  public getLanguages(): Promise<LanguagesResponse[]> {
    return this.handleApiResponse<LanguagesResponse[]>(
      this.get<LanguagesResponse[]>(this.serviceConstants.GetLanguagesAsync),
    ).then((data) => {
      if (data && data.length > 0) {
        return MappingService.mapToLanguagesAsync(data);
      }
      return [];
    });
  }

  public GetLanguagesTranslations(): Promise<LanguageTranslationsResponse[]> {
    return this.handleApiResponse<LanguageTranslationsResponse[]>(
      this.get<LanguageTranslationsResponse[]>(
        this.serviceConstants.GetLanguagesTranslationsAsync,
      ),
    ).then((data) => {
      if (data && data.length > 0) {
        return MappingService.mapToLanguageTranslationsResponseAsync(data);
      }
      return [];
    });
  }
}

