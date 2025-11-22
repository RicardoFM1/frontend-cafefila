<template>
  <v-container fluid class="fill-height" style="background-color: #f5f5f5;">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 pa-4" border>
          
          <v-card-title class="text-h5 text-center mb-4 text-brown-darken-3">
            ☕ Acesso ao Dashboard
          </v-card-title>
          
          <v-card-text>
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              density="compact"
              class="mb-4"
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
                class="mb-3"
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
                class="mb-3"
              ></v-text-field>

              <v-btn
                color="brown-darken-1"
                type="submit"
                block
                size="large"
                :loading="loading"
                :disabled="loading"
              >
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
          
          <v-divider class="my-3"></v-divider>
          
          <v-card-actions class="justify-center">
            <router-link to="/cadastro" class="text-decoration-none">
              <v-btn variant="text" color="blue-darken-1">
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
        const usuario = response.data.usuario; 

        localStorage.setItem('jwt_token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));

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