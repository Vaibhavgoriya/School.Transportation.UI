import { UserDetails } from "../Models/UserDetails";
import { CURRENT_USER_DETAILS, IS_AUTHENTICATED } from "../Redux/Actions";
import store from "../Redux/Store";
import ServiceConstants from "../Services/ServiceConstants";

class AuthSessionManager {
  private static serviceConstants = new ServiceConstants();
  private static logoutCallbacks: (() => void)[] = [];
  private static logoutTimer: ReturnType<typeof setTimeout> | null = null;

  public static startSessionTimeout(timeout: number) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    if (timeout <= 0) {
      this.clearSession();
      return;
    }

    this.logoutTimer = setTimeout(() => {
      this.clearSession();
    }, timeout);
  }

  public static clearSession() {
    localStorage.removeItem(this.serviceConstants.LocalStorageCacheName);
    sessionStorage.removeItem(
      this.serviceConstants.SessionStorageAuthenticationTokenKey,
    );

    // 🔥 Dispatch directly
    store.dispatch({ type: CURRENT_USER_DETAILS, payload: new UserDetails() });
    store.dispatch({ type: IS_AUTHENTICATED, payload: false });

    // Notify all subscribers
    [...this.logoutCallbacks].forEach(cb => cb());
  }

  public static onLogout(callback: () => void) {
    if (!this.logoutCallbacks.includes(callback)) {
      this.logoutCallbacks.push(callback);
    }
  }

  public static removeLogout(callback: () => void) {
    this.logoutCallbacks = this.logoutCallbacks.filter((cb) => cb !== callback);
  }
}

export default AuthSessionManager;
