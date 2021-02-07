
<template>
<b-modal v-model="isVisible" id="appModal" @click="open()"  hide-footer :title="title">
    <slot></slot>
 </b-modal>
</template>


<script>
export default {
    name: 'appModal',
  data() {
    return {
        isVisible:false,
        title:"fasfadsf"
    };
  },
  methods: {
        open(pTitle) {
            console.log("liza")
            this.isVisible = true
            this.title = pTitle
        },

        close() {
            this.isVisible = false
        },
    },
}
</script>

