<template>
  <div>
    <div
      v-if="ISAUTHENTICATE"
      class="d-flex align-items-center justify-content-between"
      @keydown.esc="statusSidebar = false"
      variant="light"
    >
      <b-button
        class="btn-light"
        v-b-toggle.app-side-bar
        @click="burgerMenuSidebar();  toggleIconOnOff();"
        v-on:keyup.esc="navBarStatus()"
        style="margin-left:15.5em"
      >
        <span v-show="!monoaekre">
          <i class="fas fa-plus" style="color:green"></i>
        </span>
        <span v-show="monoaekre">
          <i class="fas fa-minus" style="color:red"></i>
        </span>
      </b-button>
      <router-link :to="{ name: 'userboard'}"></router-link>
      <b-dropdown class="ml-2" variant="light">
        <template #button-content>
          <b-avatar class></b-avatar>
        </template>
        <b-dropdown-item>Edit Profile</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="logout">Log out</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "nav-top-bar",
  data() {
    return {
      menuItems: [],
      statusSidebar: false,
      monoaekre: true
    };
  },
  methods: {
    ...mapMutations("notification", ["notify"]),
    burgerMenuSidebar() {
      this.$parent.burgerMenuSidebar();
    },
    toggleIconOnOff() {
      this.monoaekre = !this.monoaekre;
      this.$store.commit("navBar/SET_NAV_BAR_STATUS", this.monoaekre);
    },
    navBarStatus() {
      console.log("monoaekre");
    },
    async logout() {
      this.$store.dispatch("authentication/logout").then(
        response => {
          localStorage.removeItem("jwt");
          this.notify({ msg: response.data.message, type: response.data.messageType});
          this.$router.push("login");
        },
        error => {
          this.notify({  msg: "Your password or your email are not correct", type: "warning", info: error });
        }
      );
    }
  },
  computed: {
    ...mapGetters("authentication", ["ISAUTHENTICATE"]),
    contentStatusSidebar() {
      return this.$parent.contentStatusSidebar;
    }
    //     isAuthenticated() {
    //       console.log(this.$store.ISAUTHENTICATE)
    //   return this.$store.getters;
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.nav-top-bar {
  width: 100%;
  height: 10vh;
}
</style>
