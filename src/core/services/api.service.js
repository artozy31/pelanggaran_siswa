import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/jwt.service";
// import { getToken } from "./jwt.service";

/**
 * Service to call HTTP request via Axios
 */
const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_ENDPOINT_DEV;
  },

  /**
   * Set the default HTTPrequest headers
   */
  setHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;

    // Vue.axios.defaults.headers.common[
    //   "domain-api-key"
    // ] = `${process.env.VUE_APP_DOMAIN_API_KEY}`
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource, slug = "") {
    const endpoint = slug ? `${resource}/${slug}` : `${resource}`;
    return Vue.axios.get(endpoint).catch(error => {
      const errorData = error?.response?.data;
      throw new Error(`${errorData?.message}`);
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  /**
 * Send the PATCH HTTP request
 * @param resource
 * @param params
 * @returns {IDBRequest<IDBValidKey> | Promise<void>}
 */
  patch(resource, params) {
    return Vue.axios.patch(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      // console.log(error);
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
};

export default ApiService;
