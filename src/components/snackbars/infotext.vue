<template>
  <v-snackbar
    v-model="InfoText.show"
    :bottom="InfoText.y === 'bottom'"
    :color="InfoText.color"
    :left="InfoText.x === 'left'"
    :multi-line="InfoText.mode === 'multi-line'"
    :right="InfoText.x === 'right'"
    :timeout="InfoText.timeout"
    :top="InfoText.y === 'top'"
    :vertical="InfoText.mode === 'vertical'"
  >
    {{ InfoText.text }}
    <template v-slot:action="{ attrs }">
      <v-btn
              dark
              text
              v-bind="attrs"
              @click="InfoText.show=false"
      >
        <v-icon
                aria-label="Close"
        >
          mdi-close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
  export default {
    name: 'infotext',
    data: () => ({

    }),
    computed: {
      InfoText: {
        get () {
          return this.$store.getters.showInfo
        },
        set (val) {
          this.$store.commit('setInfoText', val)
        },
      },
    },
  }
</script>
