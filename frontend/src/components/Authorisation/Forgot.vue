<template>
  <div class="forgotScreen">
    <b-container style="width:30%" class="border border-dark">
      <div class="ml-2 mr-2 mt-2 mb-2">
        <b-row class="d-flex justify-content-center">
          <h6>Forgot Password :</h6>
        </b-row>
        <b-row class="d-flex justify-content-center">
          <div class="col-md-12">
            <b-form-group id="emailLabel" label="Email" label-for="username">
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
          <b-button
            class="btn-block mb-2 mt-2"
            type="submit"
            size="lg"
            variant="primary"
            v-on:click="forgot"
            :disabled="disableSubmitButton()"
          >Forgot Password</b-button>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
// import { required } from "vuelidate/lib/validators";
import vh, { email } from "@/helpers/validators";
  import { mapMutations } from 'vuex'

export default {
  name: "Forgot",
  data() {
    return {
      email: ""
    };
  },
  validations: {
    email: vh.vrules(email)
  },
  computed: {
    vmsgEmail() {
      return vh.vmsg(this.$v.email, email);
    }
  },
  methods: {
    ...mapMutations('notification', ['notify']),
    async forgot() {
      const theUser = {
        email: this.email
      };
        this.$store.dispatch("authentication/requestNewPassword", theUser).then(response => 
        this.notify({ msg: response.data.message, type:response.data.messageType })
        );
     },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    disableSubmitButton() {
      if (!this.$v.$invalid) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

