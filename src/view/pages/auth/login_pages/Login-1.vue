<template>
  <div class="d-flex flex-column flex-root">
    <div class="login login-1 d-flex flex-lg-row flex-column-fluid bg-white" :class="{
      'login-signin-on': this.state == 'signin',
      'login-signup-on': this.state == 'signup',
      'login-forgot-on': this.state == 'forgot'
    }" id="kt_login">
      <!--begin::Aside-->
      <div class="login-aside d-flex flex-column flex-row-auto">
        <!-- Logo HB -->
        <div class="aside-img d-flex flex-row-fluid bgi-no-repeat bgi-position-y-center bgi-position-x-center" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
      </div>
      <!--begin::Aside-->
      <!--begin::Content-->
      <div class="login-content flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
        <div class="d-flex flex-column-fluid flex-center">
          <!--begin::Signin-->
          <div class="login-form login-signin">
            <form class="form" novalidate="novalidate" id="kt_login_signin_form">
              <div class="pb-13 pt-lg-0 pt-5">
                <h3 class="font-weight-bolder text-dark text-center font-size-h4 font-size-h1-lg">
                  Selamat Datang di website Pelanggaran Harapan Bangsa
                </h3>
              </div>
              <div class="form-group">
                <label class="font-size-h6 font-weight-bolder text-dark">Email</label>
                <div id="example-input-group-1" label="" label-for="example-input-1">
                  <v-text-field type="text" name="email" ref="email" v-model="form.email" outlined></v-text-field>
                  <!-- <v-text-field class="form-control form-control-solid h-auto py-1 px-2 rounded-lg" type="text" name="email"
                    ref="email" v-model="form.email" outlined></v-text-field> -->
                </div>
              </div>
              <div class="form-group">
                <div class="d-flex justify-content-between mt-n5">
                  <label class="font-size-h6 font-weight-bolder text-dark pt-5">Password</label>
                </div>
                <div id="example-input-group-2" label="" label-for="example-input-2">
                  <v-text-field type="password" name="password" ref="password" v-model="form.password" outlined></v-text-field>
                  <!-- <input class="form-control form-control-solid h-auto py-7 px-6 rounded-lg" type="password"
                    name="password" ref="password" v-model="form.password" autocomplete="off" /> -->
                </div>
              </div>
              <div class="pb-lg-0 pb-5 text-center">
                <button ref="kt_login_signin_submit"
                  class="btn btn-blue-style font-weight-bolder font-size-h6 px-15 py-4 my-3 mr-3"
                  :disabled="checkValidForms">
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!--end::Content-->
    </div>
  </div>
</template>

<!-- Load login custom page styles -->
<style lang="scss">
@import "@/assets/sass/pages/login/login-1.scss";
</style>

<script>
import formValidation from "@/assets/plugins/formvalidation/dist/es6/core/Core";

// FormValidation plugins
import Trigger from "@/assets/plugins/formvalidation/dist/es6/plugins/Trigger";
import Bootstrap from "@/assets/plugins/formvalidation/dist/es6/plugins/Bootstrap";
import SubmitButton from "@/assets/plugins/formvalidation/dist/es6/plugins/SubmitButton";

import KTUtil from "@/assets/js/components/util";
import { mapGetters, mapState } from "vuex";
import { LOGIN, LOGOUT } from "@/core/services/store/auth.module";
import Swal from "sweetalert2";

export default {
  name: "login-1",
  data() {
    return {
      state: "signin",
      // Remove this dummy login info
      form: {
        email: "",
        password: ""
      },

      // rules: {
      //   email: [
      //     v => !!v || "Email harus diisi",
      //     v => /.+@.+\..+/.test(v) || "E-mail must be valid",

      //   ],
      //   password: [
      //     v => !!v || "Password harus diisi",
      //     v => (v && v.length >= 8) || "Password minimal 8 karakter"
      //   ]
      // }
    };
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    }),
    ...mapGetters(["currentUser"]),

    checkValidForms() {
      const { form } = this;

      const formIsFilled = !!(form.email && form.password);
      const isPasswordValid = (form.password.length >= 8);

      return !(formIsFilled && isPasswordValid);
    },

    backgroundImage() {
      return (
        process.env.BASE_URL + "media/logos/logo-HB.png"
      );
    }
  },
  mounted() {
    const signin_form = KTUtil.getById("kt_login_signin_form");

    this.fv = formValidation(signin_form, {
      fields: {
        email: {
          validators: {
            notEmpty: {
              message: "Email harus di isi"
            }
          }
        },
        password: {
          validators: {
            notEmpty: {
              message: "Password harus di isi"
            }
          }
        }
      },
      plugins: {
        trigger: new Trigger(),
        submitButton: new SubmitButton(),
        bootstrap: new Bootstrap()
      }
    });

    this.fv.on("core.form.valid", () => {
      var email = this.form.email;
      var password = this.form.password;

      // clear existing errors
      this.$store.dispatch(LOGOUT);
      // console.log('*** LOGOUT =====> ', LOGOUT)

      // set spinner to submit button
      const submitButton = this.$refs["kt_login_signin_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");

      // send login request
      this.$store
        .dispatch(LOGIN, { email, password })
        // go to which page after successfully login
        .then(() => {
          const cek_role = this.$store.getters["currentUser"].role;
          // console.log('*** cek_role =====> ', cek_role);
          if(cek_role == 'OSIS') {
            this.$router.push({ name: "pelanggaran-siswa" })
          } else if (cek_role == 'GURU') {
            this.$router.push({ name: "riwayat-siswa" })
          } else {
            this.$router.push({ name: "dashboard-pelanggaran" })
          }
        })
        .catch(() => {
          Swal.fire({
            title: "",
            text: "Email atau Password salah !",
            icon: "error",
            confirmButtonClass: "btn btn-secondary",
            heightAuto: false
          });
        });
      submitButton.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
        );
    });

    this.fv.on("core.form.invalid", () => {
      Swal.fire({
        title: "",
        text: "Please, provide correct data!",
        icon: "error",
        confirmButtonClass: "btn btn-secondary",
        heightAuto: false
      });
    });
  },
  methods: {
    showForm(form) {
      this.state = form;
      var form_name = "kt_login_" + form + "_form";
      KTUtil.animateClass(
        KTUtil.getById(form_name),
        "animate__animated animate__backInUp"
      );
    }
  }
};
</script>
