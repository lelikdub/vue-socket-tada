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
                    <v-card-actions class="cyan">
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
                    <v-card-actions class="cyan lighten-2">
                    <v-spacer/>
                    <v-text-field
                            v-model="messageText"
                            label="Введите сообщение"
                            hide-details
                            solo
                            :maxlength="maxMessageLength"
                    ></v-text-field>
                    <v-btn :loading="messageSending" class="mx-3" @click="sendMessage">
                        Отправить сообщение
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    export default {
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
        this.$connect(this.wssurl + '?username=' + this.userInfo.name, { format: 'json', store: this.$store, reconnection: true })
      },
      computed: {
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
        scrollToElement() {
          const lastelm = this.selectedRoomMessages.length - 1
          if(lastelm>0){
            setTimeout(()=>this.$vuetify.goTo('#room' + lastelm, this.options),450)
          }
        },
        exitRoom () {
          this.selectedItem = null
        },
        logout () {
          this.$store.dispatch('clearUserName')
          this.$router.push('/')
        },
        getRoomHistory (name) {
          if(name){
            this.$store.dispatch('getHistory', name)
          }
        },
        sendMessage () {
          console.log(this.selectedRoomName)
          console.log(this.newRoomName)
          if(this.selectedRoomName || this.newRoomName){
            this.messageSending = true
            let message = {
              room: this.selectedRoomName || this.newRoomName, // название комнаты. Если такой комнаты нет, она будет создана
              text: this.messageText, // текст сообщения
              id: '' // необязательный идентификатор, можно назначить на клиенте, чтобы получить подтверждение получения сообщения сервером
            }
            this.scrollToElement()
            this.$socket.sendObj(message)
            this.messageSending = false

          }
        },
        createRoom () {
          if(this.newRoomName){
            this.messageSending = true
            let message = {
              room: this.newRoomName, // название комнаты. Если такой комнаты нет, она будет создана
              text: this.newRoomText, // текст сообщения
              id: '' // необязательный идентификатор, можно назначить на клиенте, чтобы получить подтверждение получения сообщения сервером
            }
            this.$socket.sendObj(message)
            this.messageSending = false
            this.newRoomDialog = false
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
