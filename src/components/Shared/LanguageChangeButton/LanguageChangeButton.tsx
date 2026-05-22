import { CommandButton } from "@fluentui/react";
import styles from "./LanguageChangeButton.module.scss";
import { changeLanguage, getSelectedLang } from "../../../LanguageUtils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { SET_LANGUAGE } from "../../../Redux/Actions";
import { RootState } from "../../../Redux/Reducers";
import { ILanguageChangeButtonProps } from "./ILanguageChangeButtonProps";

export function LanguageChangeButton(_props: ILanguageChangeButtonProps) {
  const [selectedLang, setSelectedLang] = useState<string>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const allLanguages = useSelector(
    (state: RootState) => state.store.allLanguages,
  );

  useEffect(() => {
    const selectedLang = getSelectedLang(allLanguages);
    setSelectedLang(
      selectedLang ? selectedLang.selectedLang?.LanguageName : "English",
    );
  }, [allLanguages]);

  function handleMenuClick(locale: string) {
    changeLanguage(locale);
  }

  function setSelectedLanguage(languageName: string) {
    setSelectedLang(languageName);
    dispatch({ type: SET_LANGUAGE, payload: languageName });
  }

  if (!allLanguages || allLanguages.length <= 0) {
    return <></>;
  }

  return (
    <div className={styles.languageFloatingWrapper}>
      <CommandButton
        className={styles.languagePill}
        split
        menuIconProps={{ iconName: "" }}
        menuProps={{
          calloutProps: {
            className: styles.languageCallout,
          },
          items: allLanguages.map((lang) => ({
            key: lang.LanguageCode,
            text: t(lang.LanguageName),
            canCheck: true,
            checked: selectedLang === lang.LanguageName,
            onClick: () => {
              handleMenuClick(lang.LanguageCode);
              setSelectedLanguage(lang.LanguageName);
            },
          })),
        }}
      >
        <span className={styles.iconWrapper}>
          <img src="/assets/images/language-globe.svg" alt="Language" />
        </span>

        <span className={styles.expandContent}>
          <span className={`${styles.languageText} ${styles.colorfulText}`}>
            {t(selectedLang ?? "").toUpperCase()}
          </span>
        </span>
      </CommandButton>
    </div>
  );
}
