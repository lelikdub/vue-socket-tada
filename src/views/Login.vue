<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
      class="mx-auto"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card
          class="mx-auto my-12"
          max-width="374"
        >
          <v-toolbar
            flex
            flat
            height="100"
          >
            <v-spacer />
            Вход в чат
            <v-spacer />
          </v-toolbar>
          <v-card-text
            class="px-6 py-0"
          >
            <v-form
              @submit.prevent="letsChatting"
              ref="nameform"
            >
              <v-text-field
                v-model="chatName"
                :rules="loginRules"
                label="Имя пользователя"
                name="loginName"
                prepend-icon="mdi-account"
                :minlength="minNamelength"
                :maxlength="maxNamelength"
                outlined
              />
              <v-btn
                type="submit"
                class="d-none"
              >
                submit
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="mb-5"
              :loading="btnloading"
              color="primary"
              @click="letsChatting"
            >
              <v-icon>mdi-login-variant</v-icon> вход
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    name: 'login',
    data: () => ({
      chatName: null,
      btnloading: false,
      max: 8,
      loginRules: [
        v => !!v || 'Пожалуйста, введите имя.',
        v => /^[А-Яа-яA-Za-z0-9_-]*$/.test(v) || 'Только буквы или цифры'
      ],
    }),
    computed: {
      minNamelength () {
        return this.$store.getters.minNamelength
      },
      maxNamelength () {
        return this.$store.getters.maxNamelength
      },
    },
    methods: {
      letsChatting () {
        if(this.$refs.nameform.validate()){
          this.btnloading = true
          this.$store.dispatch('setUserName', this.chatName)
          this.$router.push('/chat')
          this.btnloading = false
        }
      },
    },
  }
</script>
