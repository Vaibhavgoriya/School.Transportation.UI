/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from "redux";
import {
  ALL_LANGUAGES,
  CURRENT_ORGANIZATION_DETAILS,
  CURRENT_USER_DETAILS,
  GOOGLE_CAPTCHA_SITE_KEY,
  IS_AUTHENTICATED,
  ORGANIZATION_LOADED,
  SET_LANGUAGE,
} from "./Actions";
import { UserDetails } from "../Models/UserDetails";
import { getUserLang } from "../LanguageUtils";
import { OrganizationDetails } from "../Models/OrganizationDetails";
import { LanguagesResponse } from "../Models/ResponseModels/LanguagesResponse";

interface PostsState {
  currentUserDetails: UserDetails;
  organizationDetails: OrganizationDetails;
  organizationLoaded: boolean;
  isAuthenticated: boolean;
  googleCaptchaSiteKey: string;
  language: string;
  allLanguages: LanguagesResponse[];
}

const initialState: PostsState = {
  currentUserDetails: {
    username: "",
    role: "",
    email: "",
    id: "",
    displayName: "",
    phoneNumber: 0,
    token: "",
    tokenExpiry: new Date(),
  },
  organizationDetails: {
    id: "",
    name: "",
    email: "",
    isActive: false,
  },
  organizationLoaded: false,
  isAuthenticated: false,
  googleCaptchaSiteKey: "",
  language: getUserLang(),
  allLanguages: [],
};

const IncidentDetailsReducer = (
  state = initialState,
  action: any
): PostsState => {
  switch (action.type) {
    case SET_LANGUAGE: {
      return {
        ...state,
        language: action.payload,
      };
    }
    case ALL_LANGUAGES: {
      return {
        ...state,
        allLanguages: action.payload,
      };
    }
    case CURRENT_USER_DETAILS:
      return {
        ...state,
        currentUserDetails: action.payload,
      };
    case CURRENT_ORGANIZATION_DETAILS:
      return {
        ...state,
        organizationDetails: action.payload,
      };
    case ORGANIZATION_LOADED:
      return {
        ...state,
        organizationLoaded: action.payload, // true | false
      };
    case IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case GOOGLE_CAPTCHA_SITE_KEY:
      return {
        ...state,
        googleCaptchaSiteKey: action.payload,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  store: IncidentDetailsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
