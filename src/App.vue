<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <div class="v-toolbar-title">
          <div class="v-toolbar-title__placeholder">
            Radio 538 - Code is Cashen
          </div>
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-dialog v-model="reset_Dialog" persistent max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on" elevation="0">
            <span class="mr-2">Reset</span>
            <v-icon>mdi-restart</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5">
            Reset history?
          </v-card-title>
          <v-card-text>This will delete all guesses from your history. This action can not be reversed.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="resetDialog(false)">
              CANCEL
            </v-btn>
            <v-btn color="red darken-1" text @click="resetDialog(true)">
              RESET
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-main>
      <v-form v-model="valid" ref="form">
        <v-container>
          <v-row justify="center" align-content="center">
            <v-col cols="12" sm="3">
              <v-text-field v-model="newGuess" :rules="guessRules" :counter="5" label="5-Digit Guess" required ref="guess"
                v-on:keyup.enter="validateAdd(newGuess, newNCorrect)"></v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
              <v-text-field v-model="newNCorrect" :rules="nCorrectRules"
                v-on:keyup.enter="validateAdd(newGuess, newNCorrect)" label="# Of Correct Digits in the Right Positions"
                required></v-text-field>
            </v-col>

            <v-col cols="12" sm="3" align-self="center">
              <v-btn @click="validateAdd(newGuess, newNCorrect)" color="primary" elevation="3"
                :disabled="!(newGuess.length == 5) || !newNCorrect || newNCorrect > 5 || newNCorrect < 0 || !/([0-9]){5}/.test(newGuess) || !/([0-5]){1}/.test(newNCorrect)"
                block>Add
                Guess</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <v-container fluid>
        <v-row justify="center" align-content="center">
          <v-col cols="12" md="4">
            <v-card class="mx-auto" max-width="500">
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

              <v-virtual-scroll :items="guesses" item-height="50" min-height="190" bench="10"
                :height="guesses.length >= 10 ? 380 : guesses.length * 50 + 10" max-height="380">
                <template v-slot:default="{ item }">
                  <v-list-item>

                    <v-list-item-content>
                      <v-list-item-title>
                        <v-badge :color="item.nc == 0 ? 'red' : 'green'" :content="item.nc">
                          {{ item.value }}

                        </v-badge>
                      </v-list-item-title>
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
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="mx-auto" max-width="500">
              <v-card-title class="white--text orange darken-4">
                {{ solutions.length }} Possible Solutions

                <v-spacer></v-spacer>
              </v-card-title>

              <v-card-text class="pt-4">
                These are possible solutions for the current game. It only considers the history for possible solutions.
              </v-card-text>

              <v-divider></v-divider>

              <v-virtual-scroll :items="solutions" item-height="50" bench="10" max-height="380" min-height="60"
                :height="solutions.length >= 10 ? 380 : solutions.length * 50 + 10">
                <template v-slot:default="{ item }">
                  <v-list-item>

                    <v-list-item-content>
                      <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn @click="newGuess = item">

                        <v-icon color="green" small>
                          mdi-plus
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-virtual-scroll>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="result_Dialog" persistent max-width="500">
        <v-card>
          <v-card-title class="text-h5">
            Congratulations!
          </v-card-title>
          <v-card-text>You found the only possible answer: {{ solutions[0] }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="result_Dialog = false">
              RETURN
            </v-btn>
            <v-btn color="green darken-1" text @click="resetDialog(true)">
              START OVER
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="error_Dialog" persistent max-width="500">
        <v-card class="d-flex flex-column">
          <v-card-title class="text-h5">
            Error
          </v-card-title>
          <v-card-text>Considering all your guesses, there is no possible solution.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="error_Dialog = false">
              RETURN
            </v-btn>
            <v-btn color="green darken-1" text @click="errorDialog(false)">
              REMOVE LAST GUESS
            </v-btn>
            <v-btn color="red darken-1" text @click="errorDialog(true)">
              RESTART ALL
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="notification" timeout="5000">
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="notification = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    valid: false,
    text: '',
    reset_Dialog: false,
    result_Dialog: false,
    error_Dialog: false,
    notification: false,
    newGuess: '',
    newNCorrect: '',
    guessRules: [
      v => !!v || 'Guess must be 5 digits',
      v => (v.length == 5) || 'Guess must be 5 digits',
      v => /([0-9]){5}/.test(v) || 'Guess must be 5 digits',
    ],
    nCorrectRules: [
      v => !!v || 'Number of correct digits and positions is required. (0-5)',
      v => v >= 0 || v <= 5 || '# should be between 0 and 5',
      v => /([0-5]){1}/.test(v) || '# should be between 0 and 5',
    ],

    guesses: [],
    solutions: ['00000'].concat(Array.from({ length: 100000 }, (_, i) => '0'.repeat(4 - Math.floor(Math.log10(i + 0.1))) + String(i)).splice(1)),


  }),

  methods: {
    // Resets all textfields
    resetAll() {
      this.resetValidation();
      this.newGuess = ''
      this.newNCorrect = ''
      this.$refs.guess.focus();
    },

    // Action on when the Error Dialog has been dismissed
    errorDialog(remove) {
      this.error_Dialog = false;
      if (remove) {
        this.resetDialog(true);
      }
      else {
        this.guesses = this.guesses.slice(1, this.guesses.length);
        this.resetSolutions();
        this.resetAll();
      }
    },

    // Action on when the Reset Dialog has been dismissed
    resetDialog(confirm) {
      this.result_Dialog = false;
      this.reset_Dialog = false;
      if (confirm) {
        this.guesses = new Array();
        this.resetSolutions();
        this.resetAll();
      }
    },

    // After resetting the inputfields, it does not fullfill the validationrules.
    // Therefore, there is a reset. 
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    // Solutions will be reset to original state, to avoid inconsistent results
    resetSolutions() {
      this.solutions = ['00000'].concat(Array.from({ length: 100000 }, (_, i) => '0'.repeat(4 - Math.floor(Math.log10(i + 0.1))) + String(i)).splice(1))
    },

    // The newly given 5-digit guess will be checked if it already exists in
    // the history. If so, do nothing or alert. If not, then move on to add the 
    // guess to the history.
    validateAdd(newGuess, newNCorrect) {
      if (newNCorrect >= 6 || newNCorrect <= -1) {
        // Invalid value for Correct Digits
        return 0;
      }
      if (!/([0-9]){5}/.test(newGuess)) {
        // Invalid value for guesss
        return 0;
      }
      for (const guess in this.guesses) {
        if (this.guesses[guess].value == newGuess) {
          this.text = "This guess already exists.";
          this.notification = true
          return 0;
        }
      }
      this.guesses.unshift({
        value: newGuess,
        nc: Number(newNCorrect)
      });
      this.resetAll();
    },

    // Remove a specified guess from the history
    deleteGuess(guessValue) {
      this.guesses = this.guesses.filter(guess => guess.value !== guessValue);
    },

    // Returns the number of same digits in the same positions between
    // two inputs.
    checkSimilarities(x, y) {
      var counter = 0;
      for (let i = 0; i < x.length; i++) {
        if (x[i] == y[i]) {
          counter++;
        }
      }
      return counter;
    },

    // Calculate all available solutions
    updateSolutions() {
      this.resetSolutions();
      var a = this.solSet;
      for (const guess in this.guesses) {
        const currentGuess = this.guesses[guess].value;
        a.forEach(x => { if (this.checkSimilarities(x, currentGuess) != this.guesses[guess].nc) { a.delete(x) } });
      }
      this.solutions = (Array.from(a));
    },
  },

  // Computed: kinda like a serverless computer
  computed: {
    console: () => console,
    window: () => window,
    solSet() {
      return new Set(this.solutions);
    },
  },

  // Watch: Performs actions when a variable changed value
  watch: {
    guesses(hist) {
      localStorage.guesses = JSON.stringify(hist);
      this.updateSolutions();
    },
    solutions() {
      if (this.solutions.length == 0) {
        this.error_Dialog = true
      }
      if (this.solutions.length == 1) {
        this.result_Dialog = true
      }
    },
  },

  // Mounted(): Performs actions when page is loaded
  mounted() {
    if (localStorage.guesses) {
      this.guesses = JSON.parse(localStorage.guesses);
    }
    this.updateSolutions();
  },
};
</script>