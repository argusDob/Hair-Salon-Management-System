<template>
  <div class="loginScreen">
    <form @submit.prevent="validateBeforeSubmit">
    <b-container style="width:30%" class="border border-dark">
      <div class="ml-2 mr-2 mt-2 mb-2">
        <b-row class="d-flex justify-content-center">
          <h6>Reset Password</h6>
        </b-row>
        <b-row class="d-flex justify-content-center">
          <div class="col-md-12">
            <b-form-group id="passwordLabel" label="Password" label-for="username">
              <b-form-input
                id="passwordOneInput"
                type="password" 
                placeholder="Enter password"
                v-model="password"
                :state="validateState('password')"
                @input="$v.password.$touch()"
                aria-describedby="passwordFeedback"
              ></b-form-input>
              <p class="text-danger" v-show="$v.password.$error">{{ vmsgPassword }}</p>
            </b-form-group>
          </div>
        </b-row>
        <b-row class="d-flex justify-content-center">
          <div class="col-md-12">
            <b-form-group id="confirmationLabel" label="Confirm Password" label-for="confirmation">
              <b-form-input
                id="passwordConfirmed"
                type="password"
                placeholder="Confirm your password"
                v-model="confirmation"
                @input="$v.confirmation.$touch()"
                :state="validateState('confirmation')"
                required
              ></b-form-input>
              <p class="text-danger" v-show="$v.confirmation.$error">{{ vmsgConfirmation }}</p>
            </b-form-group>
          </div>
        </b-row>
        <div class="d-flex">
          <a bind-href>
          </a>
        </div>
        <b-row class="d-flex justify-content-center">
          <b-button
            class="btn-block mb-2 mt-2"
            type="submit"
            size="lg"
            variant="primary"
            v-on:click="resetPassword"
            :disabled="disableSubmitButton()"
        >Reset Password</b-button>
        </b-row>
      </div>
    </b-container>
    </form>
  </div>
</template>

<script>
// import { required } from "vuelidate/lib/validators";
import vh, { password, confirmation } from "@/helpers/validators";
import { mapMutations } from 'vuex'


export default {
  name: "Login",
  data() {
    return {
      password: "",
      confirmation: "",
    };
  },
  validations: {
     password: vh.vrules(password),
     confirmation: vh.vrules(confirmation)
  },
  submitButton: {
    disable: "disabled"
  },
  computed: {
      vmsgPassword () { return vh.vmsg(this.$v.password, password) },
      vmsgConfirmation () { return vh.vmsg(this.$v.confirmation, confirmation) }

  },
  methods: {
    ...mapMutations('notification', ['notify']),
    async resetPassword() {
      const theData = {}
      theData.passwordOne = this.password
      theData.passwordTwo = this.confirmation
      theData.token = this.$route.params.token
        this.$store.dispatch("authentication/resetPassword", theData).then(response => {
        this.notify({ msg: response.data.message, type:response.data.messageType });
        this.$router.push("/login");
      },error => {
        this.notify({ msg: error.message, type:error.type, info:error })
        })  
    },
     validateBeforeSubmit () {
        this.$v.$touch()
        if (this.$v.$invalid || !this.captchaResponse) return
        this.submitForm()
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

