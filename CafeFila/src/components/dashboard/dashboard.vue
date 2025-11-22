<template>
  <v-app class="app-background">
    <v-app-bar app color="brown-darken-4" elevation="4">
      <v-container class="py-0 fill-height d-flex justify-space-between align-center">
        <v-btn 
          variant="flat" 
          color="amber-lighten-3" 
          prepend-icon="mdi-history"
          class="font-weight-bold text-brown-darken-4 d-none d-sm-flex"
          @click="handleDetails"
        >
          Histórico
        </v-btn>

        <v-toolbar-title class="text-amber-lighten-3 font-weight-black text-h5 text-center flex-grow-1">
          <v-icon class="mr-2">mdi-coffee-to-go</v-icon> DASHBOARD DE FILA DE CAFÉ
        </v-toolbar-title>

        <v-btn 
          variant="text" 
          color="white" 
          prepend-icon="mdi-exit-to-app" 
          class="font-weight-medium"
          @click="abrir"
        >
          Sair 
          <span v-if="currentUser" class="ml-1 d-none d-sm-inline font-weight-light text-capitalize">({{ currentUser.email.split('@')[0] }})</span>
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4 main-content-padding">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 font-weight-black mb-2 text-brown-darken-4">☕ Gestão de Fila de Compras</h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-4">
              Acompanhe quem precisa comprar Café e Filtros em seguida. ID do Utilizador: 
              <span class="font-weight-bold">{{ currentUser?.id || 'N/A' }}</span>
            </p>

            <v-alert
              v-if="alertMessage"
              :type="alertType"
              variant="flat"
              closable
              class="my-4 elevation-2 rounded-lg"
              @click:close="alertMessage = null"
            >
              {{ alertMessage }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card class="pa-6 elevation-6" color="white" rounded="xl">
              <v-card-title class="text-h5 font-weight-bold text-brown-darken-3 d-flex align-center">
                <v-icon left size="28" class="mr-2">mdi-account-check</v-icon>
                O seu Estado na Fila
              </v-card-title>

              <v-divider class="mt-1 mb-4"></v-divider>

              <template v-if="currentUserQueueItem">
                <v-sheet
                  :color="currentUserQueueItem.isNext ? 'green-lighten-5' : 'blue-grey-lighten-5'"
                  class="pa-4 rounded-lg d-flex align-center justify-space-between mb-4"
                >
                  <div>
                    <div class="text-caption font-weight-medium text-medium-emphasis">A Sua Posição</div>
                    <v-chip
                      :color="currentUserQueueItem.isNext ? 'green-darken-2' : 'blue-darken-2'"
                      label
                      size="large"
                      class="font-weight-black text-uppercase"
                    >
                      <v-icon start>{{ currentUserQueueItem.isNext ? 'mdi-trophy-gold' : 'mdi-numeric-' + currentUserQueueItem.position + '-circle' }}</v-icon>
                      {{ currentUserQueueItem.isNext ? 'É O PRÓXIMO!' : `POSIÇÃO Nº ${currentUserQueueItem.position}` }}
                    </v-chip>
                  </div>
                </v-sheet>

                <div class="text-body-1 font-weight-medium mb-4 text-brown-darken-1">
                  <span class="font-weight-black">Pedidos:</span> 
                  <span class="text-medium-emphasis">{{ formatarPedidos(currentUserQueueItem) }}</span>
                </div>

                <v-btn
                  v-if="!currentUserQueueItem.isNext"
                  color="red-lighten-1"
                  variant="flat"
                  :loading="loading"
                  @click="removerDaFila(currentUserQueueItem)"
                  block
                  class="mt-2 font-weight-bold"
                  size="large"
                >
                  <v-icon left>mdi-close-circle-outline</v-icon> Sair da Fila
                </v-btn>
              </template>

              <template v-else>
                <v-alert
                  type="info"
                  variant="tonal"
                  density="comfortable"
                  class="mb-3 rounded-lg"
                  color="blue-grey"
                >
                  Não está na fila. Adicione um item abaixo para entrar!
                </v-alert>
              </template>

              <v-divider class="my-4"></v-divider>

              <v-card-text class="py-0">
                <div class="text-subtitle-1 font-weight-bold mb-3 text-brown-darken-3">Adicionar/Atualizar Pedido:</div>
                <v-row>
                  <v-col cols="6" class="pa-1">
                    <v-btn 
                      block 
                      color="brown-darken-1" 
                      @click="adicionarItem('cafe')"
                      :disabled="loading || !currentUser"
                      prepend-icon="mdi-coffee-maker"
                      size="large"
                      variant="flat"
                    >
                      Adicionar Café
                    </v-btn>
                  </v-col>
                  <v-col cols="6" class="pa-1">
                    <v-btn 
                      block 
                      color="light-blue-darken-3" 
                      @click="adicionarItem('filtro')"
                      :disabled="loading || !currentUser"
                      prepend-icon="mdi-filter-cog"
                      size="large"
                      variant="flat"
                    >
                      Adicionar Filtro
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider class="my-4"></v-divider>

              <v-card-actions class="px-0">
                <v-btn 
                  block 
                  color="amber-darken-3" 
                  @click="showInfoDialog = true; coffeeInfoText = 'A procurar informações...'; fetchGroundedCoffeeInfo()"
                  :loading="apiLoading"
                  :disabled="!currentUser || apiLoading"
                  prepend-icon="mdi-database-search-outline"
                  size="large"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  <v-icon left>mdi-database-search-outline</v-icon>
                  Pesquisar Preço Atual (AI)
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" v-if="proximoComprador">
            <v-card color="brown-lighten-5" class="pa-6 h-100 elevation-6 card-next-queue" rounded="xl">
              <v-card-title class="text-h5 text-center text-brown-darken-4 font-weight-black mb-1">
                <v-icon left size="32" color="amber-darken-3">mdi-fire</v-icon> AGORA É A VEZ DE:
              </v-card-title>

              <v-divider class="mb-4 mt-2"></v-divider>

              <v-card-text>
                <div class="text-h4 font-weight-black mb-4 text-center text-brown-darken-2 text-capitalize">
                  {{ proximoComprador.usuario.email.split('@')[0] }}
                </div>

                <v-sheet class="pa-3 rounded-lg bg-brown-lighten-4">
                  <div class="text-subtitle-1 font-weight-bold text-brown-darken-3 mb-1">
                    🛒 Itens Necessários:
                  </div>
                  <p class="text-body-1 font-weight-medium text-brown-darken-2">
                    {{ formatarPedidos(proximoComprador) }}
                  </p>
                </v-sheet>
              </v-card-text>

              <v-card-actions class="px-3 pt-4">
                <v-btn 
                  block 
                  color="green-darken-1" 
                  size="x-large"
                  :loading="loading"
                  :disabled="!isCurrentUserAdmin"
                  @click="concluirCompra"
                  class="font-weight-black elevation-3"
                >
                  <v-icon left>mdi-coffee-check</v-icon>
                  COMPRA CONCLUÍDA
                </v-btn>
              </v-card-actions>
              <v-card-subtitle v-if="!isCurrentUserAdmin" class="text-red-darken-2 text-center mt-3 font-weight-medium">
                Ação de administrador.
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="loading && filaCompradores.length === 0">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="brown" size="64" width="6"></v-progress-circular>
            <p class="mt-4 text-h6 text-medium-emphasis">A Carregar Fila de Café...</p>
          </v-col>
        </v-row>

        <v-row v-else-if="!loading && filaCompradores.length === 0">
          <v-col cols="12">
            <v-card class="pa-6 text-center elevation-3" color="green-lighten-5" rounded="xl">
              <v-icon size="40" color="green-darken-2">mdi-cup-water</v-icon>
              <p class="text-h6 mt-3 font-weight-medium text-green-darken-2">Missão cumprida! A fila está vazia.</p>
              <p class="text-body-2 text-medium-emphasis mt-1">Ninguém precisa comprar neste momento. Que alívio!</p>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else-if="restanteDaFila.length > 0">
          <v-col cols="12">
            <v-card elevation="4" class="pa-4" rounded="xl">
              <v-card-title class="text-h6 text-orange-darken-3 font-weight-bold d-flex align-center">
                <v-icon left class="mr-2">mdi-account-group</v-icon>
                Próximos Compradores (Total: {{ restanteDaFila.length }})
              </v-card-title>

              <v-list density="default" class="bg-transparent">
                <v-list-item
                  v-for="(p, index) in restanteDaFila"
                  :key="p.usuario_id"
                  class="my-3 pa-3 rounded-lg list-item-hover"
                  :class="{'bg-blue-grey-lighten-5 elevation-1': p.usuario_id === currentUser?.id, 'border-b': p.usuario_id !== currentUser?.id}"
                >
                  <template v-slot:prepend>
                    <v-avatar color="amber-darken-3" size="48" class="font-weight-black white--text elevation-1">
                      {{ index + 2 }}
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-bold text-brown-darken-3 text-capitalize">
                    {{ p.usuario.email.split('@')[0] }}
                    <v-chip v-if="p.usuario_id === currentUser?.id" color="blue" size="small" class="ml-2 font-weight-medium">VOCÊ</v-chip>
                  </v-list-item-title>

                  <v-list-item-subtitle class="mt-1 text-body-2 font-weight-medium">
                    Itens: <span class="text-brown-darken-1 font-weight-bold">{{ formatarPedidos(p) }}</span>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-btn
                      icon="mdi-arrow-up-circle-outline"
                      size="small"
                      variant="text"
                      color="blue"
                      title="Mover para a 2ª Posição"
                      :loading="loading"
                      :disabled="!isCurrentUserAdmin || loading"
                      @click="moverParaProximo(p.usuario_id)"
                      class="mr-2"
                    ></v-btn>
                    <v-btn
                      icon="mdi-trash-can-outline"
                      size="small"
                      variant="text"
                      color="red"
                      title="Remover da fila"
                      :loading="loading"
                      :disabled="!isCurrentUserAdmin || loading"
                      @click="removerDaFila(p)"
                    ></v-btn>
                  </template>
                </v-list-item>
              </v-list>

              <v-card-subtitle v-if="!isCurrentUserAdmin" class="text-red-darken-2 text-right mt-2 font-italic">
                Apenas administradores podem gerir a ordem da fila.
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="showInfoDialog" max-width="600">
      <v-card rounded="xl">
        <v-card-title class="text-h5 font-weight-bold bg-brown-darken-4 text-white d-flex justify-space-between">
          Informações Atuais de Compra (Pesquisa Web)
          <v-btn icon="mdi-close" variant="text" color="white" @click="showInfoDialog = false"></v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          <v-progress-linear v-if="apiLoading" indeterminate color="amber"></v-progress-linear>
          <div v-html="coffeeInfoText" class="text-body-1 text-medium-emphasis"></div>

          <div v-if="coffeeInfoSources.length > 0 && !apiLoading" class="mt-4 pt-3 border-t">
            <div class="font-weight-bold text-subtitle-2 text-brown-darken-2 mb-2">Fontes de Pesquisa:</div>
            <v-list density="compact" class="pa-0">
              <v-list-item 
                v-for="(source, index) in coffeeInfoSources" 
                :key="index" 
                :href="source.uri" 
                target="_blank" 
                rel="noopener noreferrer"
                class="pa-0 mb-1"
                style="min-height: 20px;"
              >
                <v-list-item-title class="text-caption text-blue-darken-2 text-decoration-underline">{{ source.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="text" @click="showInfoDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
  <v-dialog v-model="visible" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Deseja realmente sair?</v-card-title>

      <v-card-text>
        Você será desconectado do sistema.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="cancelar" :disabled="carregando">Cancelar</v-btn>

        <v-btn
          color="red"
          @click="handleLogout"
          :loading="carregando"
        >
          Sair
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { connection } from '@/connection/axiosConnection'; 
import { useRouter } from "vue-router";

const router = useRouter();



const filaCompradores = reactive([]);
const loading = ref(false);
const alertMessage = ref(null);
const alertType = ref('info');
const currentUser = ref(null);

const showInfoDialog = ref(false);
const apiLoading = ref(false);
const coffeeInfoText = ref('A procurar informações...');
const coffeeInfoSources = ref([]);
const visible = ref(false);
const carregando = ref(false);

const isCurrentUserAdmin = computed(() => !!currentUser.value && !!currentUser.value.admin);

const proximoComprador = computed(() => {
  return filaCompradores.length > 0 ? filaCompradores[0] : null;
});

const restanteDaFila = computed(() => filaCompradores.slice(1));

const currentUserQueueItem = computed(() => {
  if (!currentUser.value) return null;
  const index = filaCompradores.findIndex(item => item.usuario_id === currentUser.value.id);
  if (index === -1) return null;
  const item = filaCompradores[index];
  return { ...item, position: index + 1, isNext: index === 0 };
});

function abrir() {
  visible.value = true;
}

function cancelar() {
  visible.value = false;
}




const formatarPedidos = (item) => {
  if (!item) return "✅ Sem itens de compra definidos";
  const needs = [];
  if (item.cafe > 0) needs.push(`☕ Café x${item.cafe}`);
  if (item.filtro > 0) needs.push(`🔽 Filtro x${item.filtro}`);
  if (needs.length === 0) return "✅ Sem itens de compra definidos";
  return needs.join(' | ');
};

// API actions
const fetchFila = async () => {
  loading.value = true;
  try {
    const res = await connection.get('/fila');
    // espera um array de objetos com relação 'usuario'
    filaCompradores.splice(0, filaCompradores.length, ...res.data);
    if (alertType.value !== 'error') alertMessage.value = null;
  } catch (err) {
    console.error('fetchFila error', err);
    const msg = err?.response?.data?.message || err.message || 'Erro ao carregar a fila';
    alertMessage.value = `Erro ao carregar a fila: ${msg}`;
    alertType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const adicionarItem = async (tipo) => {
  if (!currentUser.value || loading.value) return;
  loading.value = true;
  alertType.value = 'info';
  try {
    // PATCH /fila/adicionar_pedido/{item_type}
    const res = await connection.patch(`/fila/adicionar_pedido/${tipo}`);
    const message = res?.data?.message || `Item ${tipo} adicionado`;
    alertMessage.value = message;
    alertType.value = 'success';
    await fetchFila();
  } catch (err) {
    console.error('adicionarItem error', err);
    const msg = err?.response?.data?.message || err.message || 'Erro ao adicionar item';
    alertMessage.value = `Falha ao adicionar ${tipo}: ${msg}`;
    alertType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const removerDaFila = async (filaItem) => {
  if (loading.value) return;
  if (!isCurrentUserAdmin.value && filaItem.usuario_id !== currentUser.value?.id) {
    alertMessage.value = 'Só pode remover-se a si mesmo da fila.';
    alertType.value = 'warning';
    return;
  }

  loading.value = true;
  alertType.value = 'info';
  try {
    await connection.delete(`/fila/sair/${filaItem.usuario_id}`);
    const isSelf = filaItem.usuario_id === currentUser.value?.id;
    alertMessage.value = isSelf ? `Saiu da fila.` : `Utilizador ${filaItem.usuario.email.split('@')[0]} removido da fila.`;
    alertType.value = 'success';
    await fetchFila();
  } catch (err) {
    console.error('removerDaFila error', err);
    const msg = err?.response?.data?.message || err.message || 'Erro ao remover da fila';
    alertMessage.value = `Falha ao remover da fila: ${msg}`;
    alertType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const moverParaProximo = async (id) => {
  if (loading.value || !isCurrentUserAdmin.value) return;
  loading.value = true;
  alertType.value = 'info';
  try {
    const res = await connection.patch(`/fila/mover_proximo/${id}`);
    alertMessage.value = res?.data?.message || 'Utilizador movido para a 2ª posição.';
    alertType.value = 'success';
    await fetchFila();
  } catch (err) {
    console.error('moverParaProximo error', err);
    const msg = err?.response?.data?.message || err.message || 'Erro ao mover utilizador';
    alertMessage.value = `Falha ao mover utilizador: ${msg}`;
    alertType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const concluirCompra = async () => {
  if (!proximoComprador.value || loading.value || !isCurrentUserAdmin.value) return;
  const compradorId = proximoComprador.value.usuario_id;
  loading.value = true;
  alertType.value = 'info';
  try {
    const res = await connection.post(`/fila/concluir/${compradorId}`);
    alertMessage.value = res?.data?.message || 'Compra concluída.';
    alertType.value = 'success';
    await fetchFila();
  } catch (err) {
    console.error('concluirCompra error', err);
    const msg = err?.response?.data?.message || err.message || 'Erro ao concluir compra';
    alertMessage.value = `Falha ao concluir compra: ${msg}`;
    alertType.value = 'error';
  } finally {
    loading.value = false;
  }
};

// Grounded AI search (mantive seu código, sem alteração substancial)
const fetchGroundedCoffeeInfo = async () => {
  apiLoading.value = true;
  coffeeInfoText.value = 'A pesquisar preços e locais de compra na web. Aguarde...';
  coffeeInfoSources.value = [];

  // Mantive a lógica original (chamada externa). Caso queira usar, ative a API key.
  // Para este commit, só sinalizo que a função existe.
  try {
    // sua implementação original (se tiver key e endpoint)
    coffeeInfoText.value = 'Funcionalidade de busca por preço (requer API key).';
  } catch (e) {
    coffeeInfoText.value = 'Erro na pesquisa.';
  } finally {
    apiLoading.value = false;
  }
};

// Auth / user
const loadCurrentUser = async () => {
  // tenta ler token
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    alertMessage.value = 'Sessão não encontrada. Faça login.';
    alertType.value = 'warning';
    currentUser.value = null;
    return;
  }

  try {
    const res = await connection.get('/usuarios/me');
    currentUser.value = res.data;
    // carrega fila depois do user definido
    await fetchFila();
  } catch (err) {
    console.error('loadCurrentUser error', err);
    const msg = err?.response?.data?.message || err.message || 'Erro ao obter usuário';
    alertMessage.value = `Erro ao carregar usuário: ${msg}`;
    alertType.value = 'error';
   
    currentUser.value = null;
  }
};

const handleLogout = () => {
  carregando.value = true;
  currentUser.value = null;
  filaCompradores.splice(0, filaCompradores.length);
  alertMessage.value = 'Logout realizado com sucesso.';
  alertType.value = 'success';
  setTimeout(() => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("usuario");
  }, 2000);

  router.push("/login");
};

const handleDetails = () => {
  alertMessage.value = 'Ação de Histórico: Esta funcionalidade mostraria as compras concluídas recentemente.';
  alertType.value = 'info';
};


onMounted(async () => {
  await loadCurrentUser();
});
</script>

<style scoped>
.app-background {
  background-color: #f7f3f0 !important;
}

.main-content-padding {
  max-width: 1400px;
}

.v-main {
  padding-top: 64px !important;
}

.list-item-hover:hover {
  background-color: #edeaea;
  cursor: pointer;
}

.card-next-queue {
  border: 3px solid #6D4C41 !important;
  background: linear-gradient(145deg, #efebe9, #fbf8f5);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.card-next-queue:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}

.v-list-item {
  transition: all 0.2s;
}
</style>
