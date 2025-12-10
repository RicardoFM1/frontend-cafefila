<template>
  <v-container fluid class="fill-height app-bg-coffee">
    <div class="overlay-gradient"></div>

    <v-row justify="center" align="center" class="w-100">
      <v-col cols="12" sm="10" md="6" lg="4">
        <v-card 
          class="pa-6 elevation-15 rounded-xl card-shadow-coffee" 
          color="white"
          border
        >
          
          <v-card-title class="text-h4 font-weight-black text-center mb-6 text-brown-darken-3">
            <v-icon size="36" color="amber-darken-2" class="mr-2">mdi-coffee</v-icon>
            Login
          </v-card-title>
          
          <v-card-text>
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="flat"
              closable
              class="mb-4 elevation-2 rounded-lg"
              border="start"
              border-color="red-darken-2"
              icon="mdi-alert-circle-outline"
              @click:close="errorMessage = null"
            >
              {{ errorMessage }}
            </v-alert>

            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                v-model="credentials.email"
                label="E-mail"
                name="email"
                prepend-inner-icon="mdi-email-outline"
                type="email"
                variant="outlined"
                color="brown-darken-1"
                :rules="[rules.required, rules.email]"
                required
                class="mb-4"
                density="comfortable"
              ></v-text-field>

              <v-text-field
                v-model="credentials.senha"
                label="Senha"
                name="senha"
                prepend-inner-icon="mdi-lock-outline"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                color="brown-darken-1"
                :rules="[rules.required]"
                required
                class="mb-2"
                density="comfortable"
              ></v-text-field>

              


              <v-btn
                color="brown-darken-1"
                type="submit"
                block
                size="large"
                :loading="loading"
                :disabled="loading"
                class="font-weight-bold elevation-5 rounded-pill"
                prepend-icon="mdi-login"
              >
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
          
          <v-divider class="my-4"></v-divider>
          
          <v-card-actions class="justify-center">
            <router-link to="/cadastro" class="text-decoration-none">
              <v-btn variant="text" color="blue-grey-darken-1" class="font-weight-medium">
                <v-icon start>mdi-account-plus-outline</v-icon>
                Ainda não tem conta? Cadastre-se
              </v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { connection } from "../connection/axiosConnection";

const router = useRouter();
const form = ref(null);
const credentials = reactive({ email: '', senha: '' });
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref(null);

const rules = {
  required: value => !!value || 'Campo obrigatório.',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'E-mail inválido.'
  },
};

const handleLogin = async () => {
    errorMessage.value = null;

    const { valid } = await form.value.validate();
    if (!valid) return;

    loading.value = true;
    try {
        const response = await connection.post('/usuarios/login', credentials);
        
        const token = response.data.token;
        

        localStorage.setItem('jwt_token', token);
      

        router.push('/'); 

    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Erro ao tentar fazer login.';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
.text-decoration-none {
  text-decoration: none;
}
</style>