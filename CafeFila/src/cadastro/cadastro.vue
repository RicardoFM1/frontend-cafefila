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
            <v-icon size="36" color="amber-darken-2" class="mr-2">mdi-account-plus</v-icon>
            Criar Nova Conta
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

            <v-alert
              v-if="successMessage"
              type="success"
              variant="flat"
              class="mb-4 elevation-2 rounded-lg"
              border="start"
              border-color="green-darken-2"
              icon="mdi-check-circle-outline"
            >
              {{ successMessage }}
            </v-alert>

            <v-form @submit.prevent="handleCadastro" ref="form">
              <v-text-field
                v-model="newUser.email"
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
                v-model="newUser.senha"
                label="Senha"
                name="senha"
                prepend-inner-icon="mdi-lock-outline"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                color="brown-darken-1"
                :rules="[rules.required, rules.senha]"
                @focus="showRequirements = true"
                @blur="showRequirements = false"
                required
                class="mb-1"
                density="comfortable"
              ></v-text-field>

              <v-expand-transition>
                <v-card 
                  v-show="showRequirements" 
                  variant="flat" 
                  class="mb-4 pa-3 bg-grey-lighten-4 rounded-lg"
                  >
                  <v-card-subtitle class="font-weight-bold text-caption text-brown-darken-2">
                    <v-icon size="small" class="mr-1">mdi-security</v-icon>
                    Requisitos Mínimos:
                  </v-card-subtitle>
                  <v-list density="compact" class="py-0 bg-transparent">
                    <v-list-item :class="getRuleClass(reqs.length)" min-height="20" class="px-2">
                      <v-icon :icon="getRuleIcon(reqs.length)" size="small" class="mr-2"></v-icon>
                      Pelo menos 8 caracteres
                    </v-list-item>
                    <v-list-item :class="getRuleClass(reqs.upper)" min-height="20" class="px-2">
                      <v-icon :icon="getRuleIcon(reqs.upper)" size="small" class="mr-2"></v-icon>
                      Uma letra maiúscula (A-Z)
                    </v-list-item>
                    <v-list-item :class="getRuleClass(reqs.lower)" min-height="20" class="px-2">
                      <v-icon :icon="getRuleIcon(reqs.lower)" size="small" class="mr-2"></v-icon>
                      Uma letra minúscula (a-z)
                    </v-list-item>
                    <v-list-item :class="getRuleClass(reqs.number)" min-height="20" class="px-2">
                      <v-icon :icon="getRuleIcon(reqs.number)" size="small" class="mr-2"></v-icon>
                      Um número (0-9)
                    </v-list-item>
                    <v-list-item :class="getRuleClass(reqs.special)" min-height="20" class="px-2">
                      <v-icon :icon="getRuleIcon(reqs.special)" size="small" class="mr-2"></v-icon>
                      Um caractere especial (@$!%*?&)
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-expand-transition>
              
              <v-text-field
                v-model="newUser.confirm_senha"
                label="Confirmar Senha"
                name="confirm_senha"
                prepend-inner-icon="mdi-lock-check-outline"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                color="brown-darken-1"
                :rules="[rules.required, rules.confirmSenha]"
                required
                class="mb-6"
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
                prepend-icon="mdi-chevron-right"
                text="Cadastrar"
              >
                
              </v-btn>
            </v-form>
          </v-card-text>
          
          <v-divider class="my-4"></v-divider>
          
          <v-card-actions class="justify-center">
            <router-link to="/login" class="text-decoration-none">
              <v-btn variant="text" color="blue-grey-darken-1" class="font-weight-medium">
                <v-icon start>mdi-arrow-left</v-icon>
                Já tenho conta. Fazer Login
              </v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { connection } from "../connection/axiosConnection";

const router = useRouter();
const form = ref(null);
const newUser = reactive({ email: '', senha: '', confirm_senha: '' });
const loading = ref(false);
const showPassword = ref(false);
const showRequirements = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);

const reqs = reactive({
  length: computed(() => newUser.senha.length >= 8),
  upper: computed(() => /[A-Z]/.test(newUser.senha)),
  lower: computed(() => /[a-z]/.test(newUser.senha)),
  number: computed(() => /\d/.test(newUser.senha)),
  special: computed(() => /[@$!%*?&#^()_+\-=\[\]{};:'"\\|,.<>\/?]/.test(newUser.senha)),
});

const getRuleClass = (valid) => (valid ? 'text-green-darken-2' : 'text-red-darken-2');
const getRuleIcon = (valid) => (valid ? 'mdi-check-circle' : 'mdi-close-circle');

const rules = {
  required: value => !!value || 'Campo obrigatório.',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'E-mail inválido.'
  },
  senha: value => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};:'"\\|,.<>\/?]).{8,}$/;
    return pattern.test(value) || 'A senha não atende a todos os requisitos.';
  },
  confirmSenha: value => value === newUser.senha || 'As senhas não conferem.',
};

const handleCadastro = async () => {
    errorMessage.value = null;
    successMessage.value = null;
    
    const { valid } = await form.value.validate();
    if (!valid) return;

    loading.value = true;
    try {
        const response = await connection.post('/usuarios', {
            email: newUser.email,
            senha: newUser.senha,
        });
        
        successMessage.value = response.data.message + ' Redirecionando para login...';
        
        Object.assign(newUser, { email: '', senha: '', confirm_senha: '' });
        form.value.resetValidation();
        
        setTimeout(() => {
            router.push('/login');
        }, 3000);

    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Erro ao tentar cadastrar usuário.';
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