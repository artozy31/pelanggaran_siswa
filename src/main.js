import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/core/services/store";
import ApiService from "@/core/services/api.service";
import { VERIFY_AUTH } from "@/core/services/store/auth.module";
import { RESET_LAYOUT_CONFIG } from "@/core/services/store/config.module";

Vue.config.productionTip = false;

// Global 3rd party plugins
import "popper.js";
import "tooltip.js";
import PerfectScrollbar from "perfect-scrollbar";
window.PerfectScrollbar = PerfectScrollbar;
import ClipboardJS from "clipboard";
window.ClipboardJS = ClipboardJS;

// Vue 3rd party plugins
import i18n from "@/core/plugins/vue-i18n";
import vuetify from "@/core/plugins/vuetify";
import "@/core/plugins/portal-vue";
import "@/core/plugins/bootstrap-vue";
import "@/core/plugins/perfect-scrollbar";
import "@/core/plugins/highlight-js";
import "@/core/plugins/inline-svg";
import "@/core/plugins/apexcharts";
import "@/core/plugins/treeselect";
import "@/core/plugins/metronic";
import "@mdi/font/css/materialdesignicons.css";
import "@/core/plugins/formvalidation";

// API service init
ApiService.init();

router.beforeEach(async (to, from, next) => {
  // Pastikan kita sudah memeriksa otentikasi sebelum setiap pembebanan halaman.
  await store.dispatch(VERIFY_AUTH);

  // Reset konfigurasi ke keadaan awal
  store.dispatch(RESET_LAYOUT_CONFIG);

  // Gulir halaman ke atas pada setiap perubahan rute
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);

  const isAuthenticated = store.getters["isAuthenticated"];
  const userRole = store.getters["currentUser"].role;
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Pengguna tidak terotentikasi, redirect ke halaman login
      next({ name: "login" });
    } else {
      // Periksa peran pengguna sebelum mengizinkan akses
      const requiredRoles = to.meta.requiredRoles || [];
      if (requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
        // Pengguna memiliki peran yang diperlukan, izinkan akses
        next();
      } else {
        // Pengguna tidak memiliki peran yang diperlukan, redirect ke halaman 404
        next({ name: "404" });
      }
    }
  } else {
    // Halaman tidak memerlukan otentikasi, izinkan akses
    next();
  }
});

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount("#app");

