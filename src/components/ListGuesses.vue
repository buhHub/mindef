<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-title class="white--text orange darken-4">
      History

      <v-spacer></v-spacer>
    </v-card-title>

    <v-card-text class="pt-4">
      This list shows the history of taken guesses with corresponding number of correct digits at the
      correct
      position.
    </v-card-text>

    <v-divider></v-divider>

    <v-virtual-scroll :items="guesses" :item-height="50" min-height="190" bench="10">
      <template v-slot:default="{ item }">
        <v-list-item>

          <v-list-item-content>
            <v-list-item-title>{{ item.value }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-content>
            <v-list-item-title>{{ item.nc }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn @click="deleteGuess(item.value)">

              <v-icon color="red darken-4" small>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
</template>

<script>

  export default {
    name: 'ListGuesses',

    data: () => ({
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/getting-started/pre-made-layouts',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
    }),
  }
</script>
