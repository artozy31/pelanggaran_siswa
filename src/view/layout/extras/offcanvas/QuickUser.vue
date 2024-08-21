<template>
  <div class="topbar-item">
    <div class="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2" id="kt_quick_user_toggle">
      <span class="font-weight-100 font-size-base d-none d-md-inline mr-1">
        Hi,
      </span>
      <span class="font-weight-bolder font-size-base d-none d-md-inline mr-3">
        {{ currentUser.name }}
      </span>
      <span class="symbol symbol-35 symbol-light-success">
        <span class="symbol-label font-size-h5 font-weight-bold">
          {{ currentUser.name.charAt(0).toUpperCase() }}
        </span>
      </span>
    </div>

    <div id="kt_quick_user" ref="kt_quick_user" class="offcanvas offcanvas-right p-10">
      <!--begin::Header-->
      <div class="offcanvas-header d-flex align-items-center justify-content-between pb-5">
        <h3 class="font-weight-bold m-0">
          Profile User
        </h3>
        <a href="#" class="btn btn-xs btn-icon btn-light btn-hover-primary" id="kt_quick_user_close">
          <i class="ki ki-close icon-xs text-muted"></i>
        </a>
      </div>
      <!--end::Header-->

      <!--begin::Content-->
      <perfect-scrollbar class="offcanvas-content pr-5 mr-n5 scroll" style="max-height: 90vh; position: relative;">
        <!--begin::Header-->
        <div class="d-flex align-items-center mt-5">
          <div class="symbol symbol-100 mr-5">
            <!-- <img class="symbol-label" :src="photoURL" alt="profile photo" /> -->
            <span class="symbol-label font-size-h5 font-weight-bold">
              {{ currentUser.name.charAt(0).toUpperCase() }}
            </span>
            <i class="symbol-badge bg-success"></i>
          </div>
          <div class="d-flex flex-column">
            <router-link to="/" class="font-weight-bold font-size-h5 text-dark-75 text-hover-primary">
              {{ getFullName }}
            </router-link>
            <div class="text-muted mt-1"> {{ currentUser.role }}</div>
            <div class="navi mt-2">
              <a href="#" class="navi-item">
                <span class="navi-link p-0 pb-2">
                  <span class="navi-icon mr-1">
                    <span class="svg-icon svg-icon-lg svg-icon-primary">
                      <!--begin::Svg Icon-->
                      <inline-svg :src="`${BaseURL}media/svg/icons/Communication/Mail-notification.svg`" />
                      <!--end::Svg Icon-->
                    </span>
                  </span>
                  <span class="navi-text text-muted text-hover-primary">
                    {{ currentUser.username }}
                  </span>
                </span>
              </a>
            </div>
            <button class="btn btn-light-primary btn-bold" @click="onLogout">
              Log Out
            </button>
          </div>
        </div>
      </perfect-scrollbar>
      <!--end::Content-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
#kt_quick_user {
  overflow: hidden;
}
</style>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/core/services/store/auth.module";
import KTLayoutQuickUser from "@/assets/js/layout/extended/quick-user.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";

export default {
  name: "KTQuickUser",
  data() {
    return {
      list: []
    };
  },
  mounted() {
    // Init Quick User Panel
    KTLayoutQuickUser.init(this.$refs["kt_quick_user"]);
  },
  methods: {
    onLogout() {
      this.$store
        .dispatch(LOGOUT)
        .then(() => this.$router.push({ name: "login" }));
    },
    closeOffcanvas() {
      new KTOffcanvas(KTLayoutQuickUser.getElement()).hide();
    }
  },
  computed: {
    ...mapGetters(["currentUser"]),

    getFullName() {
      return this.currentUser.name;
    },

    BaseURL() {
      return `${location.origin}/`;
    },

    photoURL() {
      return this.currentUser.photo ? this.BaseURL + this.currentUser.photo : this.BaseURL + 'media/users/user-default.png';
    }
  }
};
</script>
