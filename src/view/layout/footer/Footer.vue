<template>
  <!-- begin:: Footer -->
  <div class="footer bg-white py-4 d-flex flex-lg-column" id="kt_footer">
    <div class="d-flex align-items-center justify-content-between"
      v-bind:class="{ 'container-fluid': widthFluid, container: !widthFluid }">
      <div class="text-dark">
        <span class="text-muted font-weight-bold">
          {{ (new Date()).toLocaleDateString(undefined, { year:"numeric" }) }} &nbsp;&copy;&nbsp;
        </span>
        <a
          href="https://www.jasamarga.com/"
          target="_blank"
          class="text-dark-75 text-hover-primary"
        >
          SMK Harapan Bangsa
        </a>
      </div>
      <div class="nav nav-dark">
        <a href="/" target="_self" class="nav-link pr-3 pl-0">
          Website Pelanggaran Siswa
        </a>
      </div>
    </div>
  </div>
  <!-- end:: Footer -->
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "KTFooter",
  computed: {
    ...mapGetters(["layoutConfig"]),

    /**
     * Check if footer container is fluid
     */
    widthFluid() {
      return this.layoutConfig("footer.width") === "fluid";
    }
  }
};
</script>
