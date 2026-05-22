import { LanguagesResponse } from "../Models/ResponseModels/LanguagesResponse";
import { UserDetails } from "../Models/UserDetails";

export const SET_LANGUAGE = 'SET_LANGUAGE';
export const CURRENT_USER_DETAILS = 'CURRENT_USER_DETAILS';
export const IS_AUTHENTICATED = 'IS_AUTHENTICATED';
export const CURRENT_ORGANIZATION_DETAILS = 'CURRENT_ORGANIZATION_DETAILS';
export const ORGANIZATION_LOADED = "ORGANIZATION_LOADED";
export const ALL_LANGUAGES = 'ALL_LANGUAGES';
export const GOOGLE_CAPTCHA_SITE_KEY = 'GOOGLE_CAPTCHA_SITE_KEY';

export const isAuthenticated = (isAuthenticated: boolean) => ({
    type: IS_AUTHENTICATED,
    payload: isAuthenticated,
});

export const googleCaptchaSiteKey = (key: string) => ({
    type: GOOGLE_CAPTCHA_SITE_KEY,
    payload: key,
});

export const setLanguage = (language: string) => ({
    type: SET_LANGUAGE,
    payload: language,
});

export const allLanguages = (languages: LanguagesResponse[]) => ({
    type: ALL_LANGUAGES,
    payload: languages,
});

export const addCurrentUserDetails = (currentUserDetails: UserDetails) => ({
    type: CURRENT_USER_DETAILS,
    payload: currentUserDetails,
});

export const addOrganizationDetails = (organizationDetails: any) => ({
    type: CURRENT_ORGANIZATION_DETAILS,
    payload: organizationDetails,
});