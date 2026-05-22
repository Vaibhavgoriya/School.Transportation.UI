/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, ReactNode } from "react";
interface LoadingContextType {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  showLoading: () => void;
  hideLoading: () => void;
  showError: (errorMessage: string) => void;
  hideError: () => void;
}
export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const showLoading = () => {
    setIsLoading(true);
  };
  const hideLoading = () => {
    setIsLoading(false);
  };
  const hideError = () => {
    setIsLoading(false);
    setIsError(false);
  };
  const showError = (errorMessage: string) => {
    setIsLoading(false);
    setIsError(true);
    setErrorMessage(errorMessage);
  };
  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        isError,
        errorMessage,
        showLoading,
        hideLoading,
        showError,
        hideError,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
