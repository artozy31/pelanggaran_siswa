import Vue from "vue";
import Router from "vue-router";
import store from "@/core/services/store";

Vue.use(Router);

const getDefaultRoute = (userRole) => {
  if (userRole && userRole.includes("OSIS")) {
    return { name: "pelanggaran-siswa" };
  } else if (userRole && userRole.includes("GURU")) {
    return { name: "riwayat-siswa" };
  } else {
    return { name: "dashboard-pelanggaran" };
  }
};

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: () => {
        const userRole = store.getters["currentUser"].role;
        return getDefaultRoute(userRole);
      },
      component: () => import("@/view/layout/Layout"),
      meta: {
        requiresAuth: true,  // Tentukan apakah rute memerlukan otentikasi
      },
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/view/pages/Dashboard.vue")
        },
        {
          path: "/builder",
          name: "builder",
          component: () => import("@/view/pages/Builder.vue")
        },
        {
          path: "/pelanggaran-hb/dashboard",
          name: "dashboard-pelanggaran",
          component: () => import("@/view/pages/pelanggaran/Dashboard.vue"),
          meta: {
            requiresAuth: true,  // Tentukan apakah rute memerlukan otentikasi
            requiredRoles: ["ADMIN"]  // Tentukan peran yang diperlukan (sesuaikan dengan kebutuhan Anda)
          },
        },
        {
          path: "/pelanggaran-hb/siswa",
          name: "pelanggaran-siswa",
          component: () => import("@/view/pages/pelanggaran/PelanggaranSiswa.vue"),
          meta: {
            requiresAuth: true,
            requiredRoles: ["ADMIN", "OSIS"]
          },
        },
        {
          path: "/pelanggaran-hb/riwayat-siswa",
          name: "riwayat-siswa",
          component: () => import("@/view/pages/pelanggaran/RiwayatSiswa.vue"),
          meta: {
            requiresAuth: true,
            requiredRoles: ["ADMIN", "GURU"]
          },
        },
        {
          path: "/pelanggaran-hb/manajemen-user",
          name: "master-data-manajemen-user",
          component: () => import("@/view/pages/pelanggaran/master-data/ManajemenUser.vue"),
          meta: {
            requiresAuth: true,
            requiredRoles: ["ADMIN"]
          },
        },
        {
          path: "/pelanggaran-hb/tindak-lanjut",
          name: "master-data-tindak-lanjut",
          component: () => import("@/view/pages/pelanggaran/master-data/TindakLanjut.vue"),
          meta: {
            requiresAuth: true,
            requiredRoles: ["ADMIN"]
          },
        },
        {
          path: "/master-data",
          name: "master-data",
          component: () => import("@/view/pages/pelanggaran/master-data/MasterData.vue"),
          meta: {
            requiresAuth: true,
          },
          children: [
            {
              path: "pelanggaran",
              name: "master-data-pelanggaran",
              component: () => import("@/view/pages/pelanggaran/master-data/MasterPelanggaranSiswa.vue"),
              meta: {
                requiresAuth: true,
                requiredRoles: ["ADMIN"]
              },
            },
            {
              path: "siswa",
              name: "master-data-siswa",
              component: () => import("@/view/pages/pelanggaran/master-data/MasterSiswa.vue"),
              meta: {
                requiresAuth: true,
                requiredRoles: ["ADMIN"]
              },
            },
            {
              path: "kelas",
              name: "master-data-kelas",
              component: () => import("@/view/pages/pelanggaran/master-data/MasterKelas.vue"),
              meta: {
                requiresAuth: true,
                requiredRoles: ["ADMIN"]
              },
            },
            {
              path: "wali-kelas",
              name: "master-data-wali-ke;as",
              component: () => import("@/view/pages/pelanggaran/master-data/MasterWaliKelas.vue"),
              meta: {
                requiresAuth: true,
                requiredRoles: ["ADMIN"]
              },
            },
            {
              path: "jenis-pelanggaran",
              name: "master-data-jenis-pelanggaran",
              component: () => import("@/view/pages/pelanggaran/master-data/MasterJenisPelanggaran.vue"),
              meta: {
                requiresAuth: true,
                requiredRoles: ["ADMIN"]
              },
            },
            {
              path: "kategori-pelanggaran",
              name: "master-data-kategori-pelanggaran",
              component: () => import("@/view/pages/pelanggaran/master-data/MasterKategoriPelanggaran.vue"),
              meta: {
                requiresAuth: true,
                requiredRoles: ["ADMIN"]
              },
            },
          ]
        },
        {
          path: "/profile",
          name: "profile",
          component: () => import("@/view/pages/profile/Profile.vue"),
          meta: {
            requiresAuth: true,
            requiredRoles: ["ADMIN", "GURU", "OSIS"]
          },
          children: [
            {
              path: "profile-1",
              name: "profile-1",
              component: () => import("@/view/pages/profile/Profile-1.vue")
            },
            {
              path: "profile-2",
              name: "profile-2",
              component: () => import("@/view/pages/profile/Profile-2.vue")
            },
            {
              path: "profile-3",
              name: "profile-3",
              component: () => import("@/view/pages/profile/Profile-3.vue")
            },
            {
              path: "profile-4",
              name: "profile-4",
              component: () => import("@/view/pages/profile/Profile-4.vue")
            }
          ]
        }
      ]
    },
    {
      path: "/custom-error",
      name: "error",
      component: () => import("@/view/pages/error/Error.vue"),
      children: [
        {
          path: "error-1",
          name: "error-1",
          component: () => import("@/view/pages/error/Error-1.vue")
        },
        {
          path: "error-2",
          name: "error-2",
          component: () => import("@/view/pages/error/Error-2.vue")
        },
        {
          path: "error-3",
          name: "error-3",
          component: () => import("@/view/pages/error/Error-3.vue")
        },
        {
          path: "error-4",
          name: "error-4",
          component: () => import("@/view/pages/error/Error-4.vue")
        },
        {
          path: "error-5",
          name: "error-5",
          component: () => import("@/view/pages/error/Error-5.vue")
        },
        {
          path: "error-6",
          name: "error-6",
          component: () => import("@/view/pages/error/Error-6.vue")
        }
      ]
    },
    {
      path: "/",
      component: () => import("@/view/pages/auth/login_pages/Login-1"),
      children: [
        {
          name: "login",
          path: "/login",
          component: () => import("@/view/pages/auth/login_pages/Login-1")
        },
        {
          name: "register",
          path: "/register",
          component: () => import("@/view/pages/auth/login_pages/Login-1")
        }
      ]
    },
    {
      path: "*",
      redirect: "/404"
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/view/pages/error/Error-1.vue")
    }
  ]
});
