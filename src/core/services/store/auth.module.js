import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import router from "@/router";
import axios from "axios";
import Swal from "sweetalert2";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_PASSWORD = "updateUser";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_AUTO_LOGOUT = "setAutoLogout";
export const SET_PASSWORD = "setPassword";
export const SET_ERROR = "setError";

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken(),
  isLoggingOut: false,
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  isLoggingOut(state) {
    return state.isLoggingOut;
  }
};

const cookieFunction = {
  getCookie(name) {
    const cookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${name}=`));

    if (!cookie) {
      return null;
    }

    return decodeURIComponent(cookie.split("=")[1]);
  }
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise((resolve, reject) => {
      const csrfTokenEndpoint = `${process.env.VUE_APP_BASE_ENDPOINT_DEV}`;
      const endpoint = `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/auth/login`;
      axios.defaults.withCredentials = true;

      axios.get(`${csrfTokenEndpoint}/sanctum/csrf-cookie`, { withCredentials: true })
        .then(() => {
          const csrfToken = cookieFunction.getCookie('XSRF-TOKEN');
          axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;

          ApiService.post(endpoint, credentials, {
            headers: {
              'Accept': 'application/json',
              'X-XSRF-TOKEN': cookieFunction.getCookie('XSRF-TOKEN')
            }, withCredentials: true
          }).then(({ data }) => {
            let dataUserLogin = data;
            context.commit(SET_AUTH, dataUserLogin);
            resolve(data);
          })
            .catch(({ error }) => {
              Swal.fire({
                title: "",
                text: "Email atau Password salah !",
                icon: "error",
                confirmButtonClass: "btn btn-secondary",
                heightAuto: false
              });
              context.commit(SET_ERROR, error);
              reject(error);
            });
        })
    })
  },
  [LOGOUT](context) {
    if (context.getters.isLoggingOut) {
      // Jika sedang logout, hentikan proses logout lagi
      return;
    }

    context.commit(SET_AUTO_LOGOUT, false);

    const endpoint = `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/auth/logout`;
    ApiService.setHeader();
    ApiService.post(endpoint)
      .then(() => {
        context.commit(PURGE_AUTH);
        context.commit(SET_AUTO_LOGOUT, false);
      })
      .catch((err) => {
        context.commit(SET_AUTO_LOGOUT, false);
        const error = err;
        // console.log('error ==> ', error)
        context.commit(SET_ERROR, error);
      });
  },
  [REGISTER](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("login", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },
  [VERIFY_AUTH](context) {
    const currentUser = context.getters.currentUser;
    // console.log('==============> currentUser', currentUser);
    if (Object.keys(currentUser).length > 0 && JwtService.getToken()) {
      const checkIn = currentUser.last_used_at;
      const expiresIn = currentUser.expires_at * 1000;

      const currTime = new Date().getTime();
      const expirationTime = checkIn + expiresIn;
      const timeLeft = expirationTime - currTime;

      // Jika waktu kadaluwarsa sesi sudah tercapai, lakukan logout
      if (currTime > expirationTime) {
        setTimeout(() => {
          if (location.pathname !== '/login') {
            router.push('/login');
          }
          context.dispatch(LOGOUT);
        }, timeLeft);
        // Hentikan pemrosesan lebih lanjut
        return;
      }
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [UPDATE_PASSWORD](context, payload) {
    const password = payload;

    return ApiService.put("password", password).then(({ data }) => {
      context.commit(SET_PASSWORD, data);
      return data;
    });
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user.user;
    state.errors = {};
    JwtService.saveToken(user.token);
  },
  [SET_PASSWORD](state, password) {
    state.user.password = password;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    JwtService.destroyToken();
  },
  [SET_AUTO_LOGOUT](state, value) {
    state.isLoggingOut = value;
  },
};

export default {
  state,
  actions,
  mutations,
  getters
};