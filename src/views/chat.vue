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
                    sm="4"
                    md="4"
            >
                <v-card
                        class="mx-auto"
                >
                    <v-toolbar
                            color="cyan"
                            dark
                    >
                        <v-toolbar-title>Hi, {{userInfo.name}}</v-toolbar-title>

                        <v-spacer></v-spacer>

                        <v-btn v-if="showHistory" @click="reconnectSocket" icon>
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                        <v-btn @click="logout" icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-list height="80vh" class="scroll" three-line>
                        <v-subheader
                            key="header"
                        >Комнаты</v-subheader>
                        <v-list-item-group
                                v-model="selectedItem"
                                color="primary"
                        >
                            <template v-for="(item,index) in rooms">
                                <v-list-item
                                        :key="'room' + index"
                                        @click="getRoomHistory(item.name)"
                                >
                                    <v-list-item-content>
                                        <v-list-item-title>{{item.name}}</v-list-item-title>
                                        <v-list-item-subtitle> <strong>{{item.last_message.sender?item.last_message.sender.username:''}}</strong> - {{item.last_message.text}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider
                                        :key="index"
                                ></v-divider>
                            </template>
                        </v-list-item-group>
                    </v-list>
                    <v-card-actions class="cyan" v-if="!showHistory">
                        <v-spacer/>
                        <v-dialog
                                v-model="newRoomDialog"
                                persistent
                                max-width="600px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                        color="primary"
                                        dark
                                        v-bind="attrs"
                                        v-on="on"
                                >
                                    Создать комнату
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">Создать новую комнату</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field
                                                        v-model="newRoomName"
                                                        label="Название комнаты"
                                                        hide-details
                                                        outlined
                                                        :maxlength="maxRoomNamelength"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field
                                                        v-model="newRoomText"
                                                        label="Приветственное слово"
                                                        hide-details
                                                        outlined
                                                        :maxlength="maxMessageLength"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="newRoomDialog = false"
                                    >
                                        Отмена
                                    </v-btn>
                                    <v-btn
                                            color="green darken-1"
                                            text
                                            @click="createRoom"
                                    >
                                        Создать комнату
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-spacer/>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col
                    cols="12"
                    sm="8"
                    md="8"
                    v-if="selectedItem || selectedItem===0"
            >
                <v-card
                        class="ml-md-0 mr-md-6"
                >
                    <v-toolbar
                            color="cyan lighten-2"
                    >
                        <v-toolbar-title>Room: {{rooms[selectedItem]?rooms[selectedItem].name:''}}</v-toolbar-title>

                        <v-spacer></v-spacer>

                        <v-btn @click="exitRoom" icon>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-list  height="80vh" class="scroll chat"  three-line>
                        <v-subheader
                                key="header"
                        >Сообщения</v-subheader>

                            <template v-for="(item,index) in selectedRoomMessages">
                                <v-list-item :key="'room' + index"  :id="'room' + index" :class="item.sender.username === userInfo.name?'teal accent-1':''">

                                    <v-list-item-content>
                                        <v-list-item-title>{{item.sender.username}}</v-list-item-title>
                                        <v-list-item-subtitle>{{item.text}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider
                                        :key="index"
                                ></v-divider>
                            </template>
                    </v-list>
                    <v-card-actions class="cyan lighten-2" v-if="!showHistory">
                    <v-spacer/>
                        <v-form
                                @submit.prevent="sendMessage"
                                ref="newmessage"
                                class="d-md-flex col-12"
                        >
                            <v-text-field
                                    v-model="messageText"
                                    label="Введите сообщение"
                                    hide-details
                                    solo
                                    width="100%"
                                    :maxlength="maxMessageLength"
                            ></v-text-field>
                            <v-btn :loading="messageSending" class="mx-3 mt-1" type="submit">
                                Отправить сообщение
                            </v-btn>
                        </v-form>
                </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog
                v-model="loading"
                persistent
                overlay-opacity="1"
                :width="300"
        >
            <v-card
                    :color="reconnectInfo.show?'lime lighten-5 pa-2':'primary pa-2'"
                    :dark="!reconnectInfo.show"
            >
                <v-card-text v-if="reconnectInfo.show">
                    {{reconnectInfo.text}}
                </v-card-text>
                <v-card-text v-else>
                    Загрузка...
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    />
                </v-card-text>
                <v-card-actions class="text-center" v-if="reconnectInfo.show">
                    <v-row>
                        <v-col cols="12">
                            <v-btn @click="reconnectSocket">повторное подключение</v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-btn @click="showHistory=true">показать историю</v-btn>
                        </v-col>
                    </v-row>

                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    export default {
      name: 'chats',
      data () {
       return {
         newRoomDialog: false,
         messageText: null,
         newRoomName: null,
         header: 'Комнаты',
         selectedItem: null,
         messageSending: false,
         duration: 300,
         offset: 10,
         easing: 'easeInOutCubic',
         scrollContainer: 'div.chat',
         newRoomText: this.$store.state.userInfo.name + ' create room',
       }
      },
      mounted () {
        this.$store.dispatch('getRooms')
        if (!this.$store.getters.isConnected) {
          this.$connect(this.wssurl + '?username=' + this.userInfo.name, { format: 'json', store: this.$store })
        }
      },
      computed: {
        loading() {
          if(this.$store.getters.showHistory)return false
          return this.$store.getters.isConnecting
        },
        reconnectInfo() {
          return this.$store.getters.reconnectInfo
        },
        showHistory: {
          get: function () {
            return this.$store.getters.showHistory
          },
          set: function (newValue) {
            this.$store.commit('setShowRoomHistory', newValue)
          },
        },
        options () {
          return {
            duration: this.duration,
            offset: this.offset,
            easing: this.easing,
            container: this.scrollContainer,
          }
        },
        wssurl () {
          return this.$store.getters.wssurl
        },
        rooms () {
          return this.$store.getters.rooms
        },
        userInfo () {
          return this.$store.getters.userInfo
        },
        selectedRoomMessages () {
          return this.$store.getters.selectedRoomMessages
        },
        selectedRoomName () {
          return this.$store.getters.selectedRoomName
        },
        maxRoomNamelength () {
          return this.$store.getters.maxRoomNamelength
        },
        maxMessageLength () {
          return this.$store.getters.maxMessageLength
        }
      },
      watch: {
        selectedRoomMessages(){
          this.scrollToElement()
        }
      },
      methods: {
        reconnectSocket() {
          this.$connect(this.wssurl + '?username=' + this.userInfo.name, { format: 'json', store: this.$store })
        },
        scrollToElement() {
          const lastelm = this.selectedRoomMessages.length - 1
          if(lastelm>0){
            setTimeout(()=>this.$vuetify.goTo('#room' + lastelm, this.options),600)
          }
        },
        exitRoom () {
          this.selectedItem = null
        },
        logout () {
          this.$store.dispatch('clearUserName')
          this.$disconnect()
          this.$router.push('/')
        },
        getRoomHistory (name) {
          if(name){
            this.$store.dispatch('getHistory', name)
          }
        },
        async sendMessage () {
          if(this.selectedRoomName){
            this.messageSending = true
            let message = {
              room: this.selectedRoomName, // название комнаты. Если такой комнаты нет, она будет создана
              text: this.messageText, // текст сообщения
              id: '' // необязательный идентификатор, можно назначить на клиенте, чтобы получить подтверждение получения сообщения сервером
            }
            await this.$socket.sendObj(message)
            this.scrollToElement()
            this.messageSending = false
            this.messageText = null
          }
        },
        async createRoom () {
          if(this.newRoomName){
            this.messageSending = true
            let message = {
              room: this.newRoomName, // название комнаты. Если такой комнаты нет, она будет создана
              text: this.newRoomText, // текст сообщения
              id: '' // необязательный идентификатор, можно назначить на клиенте, чтобы получить подтверждение получения сообщения сервером
            }
            await this.$socket.sendObj(message)
            this.messageSending = false
            this.newRoomDialog = false
            this.selectedItem = 0

          }
        }
      }
    }
</script>

<style>
    .scroll {
        overflow-y: scroll
    }
</style>
