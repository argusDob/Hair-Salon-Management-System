<template>
  <div v-if="message" :class="[alertClass]" class="alert">
      <button type="button" class="close" @click="formsRemove">
          <span aria-hidden="true">&times;</span>
      </button>
      {{ message }}
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    computed: {
      ...mapGetters('formsNotifier', ['message', 'alertClass'])
      
    },
    methods: {
      ...mapMutations('formsNotifier', ['formsRemove'])
    },
      created(){
    setTimeout(()=>{
      this.formsRemove()
    },10000)
      }

   
  }
</script>