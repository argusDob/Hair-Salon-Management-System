<template>
  <div class="loginScreen">
    <b-container style="width:30%" class="border border-dark">
      <div class="ml-2 mr-2 mt-2 mb-2">
        <b-row class="d-flex justify-content-center">
          <h6>LOG IN :</h6>
        </b-row>
        <b-row class="d-flex justify-content-center">
          <div class="col-md-12">
            <b-form-group id="emailLabel" label="Username" label-for="username">
              <b-form-input
                id="emailInput"
                type="email"
                placeholder="Enter email"
                v-model="email"
                :state="validateState('email')"
                @input="$v.email.$touch()"
                aria-describedby="emailFeddback"
              ></b-form-input>
              <p class="text-danger" v-show="$v.email.$error">{{ vmsgEmail }}</p>
            </b-form-group>
          </div>
        </b-row>
        <b-row class="d-flex justify-content-center">
          <div class="col-md-12">
            <b-form-group id="passwordLabel" label="Password" label-for="password">
              <b-form-input
                id="passwordInput"
                type="password"
                placeholder="Enter your password"
                :state="validateState('password')"
                v-model="password"
                @input="$v.password.$touch()"
                required
              ></b-form-input>
              <p class="text-danger" v-show="$v.password.$error">{{ vmsgPassword }}</p>
            </b-form-group>
          </div>
        </b-row>
        <div class="d-flex">
          <a bind-href>
            <router-link to="/forgot">Forgot Password?</router-link>
          </a>
        </div>
        <b-row class="d-flex justify-content-center">
          <b-button
            class="btn-block mb-2 mt-2"
            type="submit"
            size="lg"
            variant="primary"
            v-on:click="loginUser"
            :disabled="disableSubmitButton()"
        >Log-in</b-button>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
// import { required } from "vuelidate/lib/validators";
import vh, { email, password } from "@/helpers/validators";
import { mapMutations } from 'vuex'


export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  validations: {
    email: vh.vrules(email),
    password: vh.vrules(password)
  },
  submitButton: {
    disable: "disabled"
  },
  computed: {
    vmsgEmail() {
      return vh.vmsg(this.$v.email, email);
    },
    vmsgPassword() {
      return vh.vmsg(this.$v.password, password);
    }
  },
  methods: {
    ...mapMutations('notification', ['notify']),
    async loginUser() {
      const theUser = {
        username: this.email,
        password: this.password
      };
        this.$store.dispatch("authentication/loginUser", theUser).then(response => {
        this.notify({ msg: response.data.message, type:response.data.messageType });
        this.$router.push("dashboard");
      },error => {
        this.notify({ msg: "Your password or your email are not correct", type:'warning', info:error })
        })  

    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    disableSubmitButton(){  if((!this.$v.$invalid)) { return false; } else { return true; } }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

</style>