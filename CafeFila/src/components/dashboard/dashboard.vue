<template>
  <v-app class="app-background">
    <!-- OVERLAY DE LOADING -->
    <v-overlay
      :model-value="loading"
      class="align-center justify-center"
      persistent
      contained
      z-index="9999"
    >
      <div class="text-center">
        <v-progress-circular indeterminate color="amber-lighten-3" size="72" width="8" />
        <p class="mt-4 text-h6 font-weight-bold text-white">
          A Carregar Dados da Fila...
        </p>
      </div>
    </v-overlay>

    <!-- APP BAR -->
    <v-app-bar app color="brown-darken-4" elevation="4">
      <v-container class="py-0 fill-height d-flex justify-space-between align-center">
        <v-toolbar-title
          class="text-amber-lighten-3 font-weight-black text-h5 text-center flex-grow-1"
        >
          <v-icon class="mr-2">mdi-coffee-to-go</v-icon>
          DASHBOARD DE FILA DE CAFÉ
        </v-toolbar-title>
        <v-btn
          variant="text"
          color="white"
          prepend-icon="mdi-exit-to-app"
          class="font-weight-medium"
          @click="abrir"
        >
          Sair
          <span v-if="currentUser" class="ml-1 d-none d-sm-inline font-weight-light text-capitalize">
            ({{ currentUser.email.split("@")[0] }})
          </span>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- CONTEÚDO PRINCIPAL -->
    <v-main>
      <v-container fluid class="pa-4 main-content-padding">
        <!-- Título e Alert -->
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 font-weight-black mb-2 text-brown-darken-4">
              ☕ Gestão de Fila de Compras
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-4">
              Acompanhe quem precisa comprar Café e Filtros em seguida. ID do Utilizador:
              <span class="font-weight-bold">{{ currentUser?.id || "N/A" }}</span>
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

        <!-- CARD DO USUÁRIO -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card class="pa-6 elevation-6" color="white" rounded="xl">
              <v-card-title
                class="text-h5 font-weight-bold text-brown-darken-3 d-flex align-center"
              >
                <v-icon left size="28" class="mr-2">mdi-account-check</v-icon>
                O seu Estado na Fila
              </v-card-title>
              <v-divider class="mt-1 mb-4"></v-divider>

              <!-- Usuário na fila -->
              <template v-if="currentUserQueueItem">
                <v-sheet
                  :color="currentUserQueueItem.isNext ? 'green-lighten-5' : 'blue-grey-lighten-5'"
                  class="pa-4 rounded-lg d-flex align-center justify-space-between mb-4"
                >
                  <div>
                    <div class="text-caption font-weight-medium text-medium-emphasis">
                      A Sua Posição
                    </div>
                    <v-chip
                      :color="currentUserQueueItem.isNext ? 'green-darken-2' : 'blue-darken-2'"
                      label
                      size="large"
                      class="font-weight-black text-uppercase"
                    >
                      <v-icon start>
                        {{
                          currentUserQueueItem.isNext
                            ? "mdi-trophy-gold"
                            : "mdi-numeric-" + currentUserQueueItem.position + "-circle"
                        }}
                      </v-icon>
                      {{
                        currentUserQueueItem.isNext
                          ? "É O PRÓXIMO!"
                          : `POSIÇÃO Nº ${currentUserQueueItem.position}`
                      }}
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

              <!-- Usuário não está na fila -->
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

              <!-- Adicionar Pedido -->
              <v-divider class="my-4"></v-divider>
              <v-card-text class="py-0">
                <div class="text-subtitle-1 font-weight-bold mb-3 text-brown-darken-3">
                  Adicionar/Atualizar Pedido:
                </div>
                <v-row>
                  <v-col cols="6" class="pa-1">
                    <v-btn
                      block
                      color="brown-darken-1"
                      @click="adicionarItem('cafe')"
                      :disabled="loadingAdicionar || !currentUser"
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
                      :disabled="loadingAdicionar || !currentUser"
                      prepend-icon="mdi-filter-cog"
                      size="large"
                      variant="flat"
                    >
                      Adicionar Filtro
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Próximo comprador -->
          <v-col cols="12" md="6" v-if="proximoComprador">
            <v-card
              color="brown-lighten-5"
              class="pa-6 h-100 elevation-6 card-next-queue"
              rounded="xl"
            >
              <v-card-title class="text-h5 text-center text-brown-darken-4 font-weight-black mb-1">
                <v-icon left size="32" color="amber-darken-3">mdi-fire</v-icon> AGORA É A VEZ DE:
              </v-card-title>

              <v-divider class="mb-4 mt-2"></v-divider>

              <v-card-text>
                <div
                  class="text-h4 font-weight-black mb-4 text-center text-brown-darken-2 text-capitalize"
                >
                  {{ proximoComprador.usuario.email.split("@")[0] }}
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
                  <v-icon left>mdi-coffee-check</v-icon> CONFIRMAR COMPRA
                </v-btn>
              </v-card-actions>

              <v-card-subtitle
                v-if="!isCurrentUserAdmin"
                class="text-red-darken-2 text-center mt-3 font-weight-medium"
              >
                Ação de administrador.
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>

        <!-- Fila vazia -->
        <v-row v-if="!loading && filaCompradores.length === 0">
          <v-col cols="12">
            <v-card class="pa-6 text-center elevation-3" color="green-lighten-5" rounded="xl">
              <v-icon size="40" color="green-darken-2">mdi-cup-water</v-icon>
              <p class="text-h6 mt-3 font-weight-medium text-green-darken-2">
                Missão cumprida! A fila está vazia.
              </p>
              <p class="text-body-2 text-medium-emphasis mt-1">
                Ninguém precisa comprar neste momento. Que alívio!
              </p>
            </v-card>
          </v-col>
        </v-row>

        <!-- Lista filtrada da fila -->
        <v-row v-else-if="filaCompradoresFiltrada.length > 0">
          <v-col cols="12">
            <v-card elevation="4" class="pa-4" rounded="xl">
              <v-card-title
                class="text-h6 text-orange-darken-3 font-weight-bold d-flex align-center"
              >
                <v-icon left class="mr-2">mdi-account-group</v-icon>
                Próximos Compradores (Total: {{ restanteDaFilaFiltrada.length }})
              </v-card-title>

              <v-card-text class="pt-0 pb-2">
                <v-row align="center" class="mb-3">
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="filtroFila.item"
                      :items="itemOptions"
                      label="Filtrar por Item"
                      clearable
                      prepend-icon="mdi-coffee"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="filtroFila.usuario"
                      label="Filtrar por Usuário"
                      clearable
                      prepend-icon="mdi-account-search"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>

                  <v-col cols="12" md="4" class="d-flex gap-2">
                    <v-menu v-model="periodoMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
                      <template #activator="{ props }">
                        <v-text-field
                          v-model="periodoText"
                          label="Filtrar por Período"
                          prepend-icon="mdi-calendar-range"
                          readonly
                          v-bind="props"
                          clearable
                        />
                      </template>
                      <v-date-picker
                        v-model="filtroFila.periodo"
                        type="range"
                        @update:model-value="updatePeriodoText"
                      />
                    </v-menu>
                  </v-col>
                </v-row>

                <v-btn color="grey-darken-1" @click="limparFiltrosFila" variant="text">
                  Limpar Filtros
                </v-btn>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

              <v-list density="default" class="bg-transparent">
                <v-list-item
                  v-for="(p, index) in restanteDaFilaFiltrada"
                  :key="p.usuario_id"
                  class="my-3 pa-3 rounded-lg list-item-hover"
                  :class="{
                    'bg-blue-grey-lighten-5 elevation-1': p.usuario_id === currentUser?.id,
                    'border-b': p.usuario_id !== currentUser?.id,
                  }"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      color="amber-darken-3"
                      size="48"
                      class="font-weight-black white--text elevation-1"
                    >
                      {{ index + 2 }}
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-bold text-brown-darken-3 text-capitalize">
                    {{ p.usuario.email.split("@")[0] }}
                    <v-chip
                      v-if="p.usuario_id === currentUser?.id"
                      color="blue"
                      size="small"
                      class="ml-2 font-weight-medium"
                    >
                      VOCÊ
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle class="mt-1 text-body-2 font-weight-medium">
                    Itens:
                    <span class="text-brown-darken-1 font-weight-bold">{{ formatarPedidos(p) }}</span>
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
                    />
                    <v-btn
                      icon="mdi-trash-can-outline"
                      size="small"
                      variant="text"
                      color="red"
                      title="Remover da fila"
                      :loading="loading"
                      :disabled="!isCurrentUserAdmin || loading"
                      @click="removerDaFila(p)"
                    />
                  </template>
                </v-list-item>
              </v-list>

              <v-card-subtitle
                v-if="!isCurrentUserAdmin"
                class="text-red-darken-2 text-right mt-2 font-italic"
              >
                Apenas administradores podem gerir a ordem da fila.
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- DIALOG DE INFORMAÇÃO -->
    <v-dialog v-model="showInfoDialog" max-width="600">
      <v-card rounded="xl">
        <v-card-title
          class="text-h5 font-weight-bold bg-brown-darken-4 text-white d-flex justify-space-between"
        >
          Informações Atuais de Compra (Pesquisa Web)
          <v-btn icon="mdi-close" variant="text" color="white" @click="showInfoDialog = false" />
        </v-card-title>
        <v-card-text class="pt-4">
          <div v-html="coffeeInfoText" class="text-body-1 text-medium-emphasis" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red-darken-1" variant="text" @click="showInfoDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG DE LOGOUT -->
    <v-dialog v-model="visible" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Deseja realmente sair?</v-card-title>
        <v-card-text>Você será desconectado do sistema.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancelar" :disabled="carregando">Cancelar</v-btn>
          <v-btn color="red" @click="handleLogout" :loading="carregando">Sair</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { connection } from "@/connection/axiosConnection";

// ------------------------------
// REFS E REACTIVES
// ------------------------------
const router = useRouter();
const filaCompradores = reactive([]);
const loading = ref(false);
const loadingAdicionar = ref(false);
const alertMessage = ref(null);
const alertType = ref("info");
const currentUser = ref(null);
const showInfoDialog = ref(false);
const coffeeInfoText = ref("A procurar informações...");
const visible = ref(false);
const carregando = ref(false);

const filtroFila = reactive({
  item: null,
  usuario: "",
  periodo: null,
});
const itemOptions = ["Café", "Filtro"];

const periodoMenu = ref(false);
const periodoText = ref("");

// ------------------------------
// COMPUTED
// ------------------------------
const isCurrentUserAdmin = computed(() => !!currentUser.value?.admin);
const proximoComprador = computed(() => filaCompradores[0] || null);
const restanteDaFilaFiltrada = computed(() => filaCompradoresFiltrada.value.slice(1));
const currentUserQueueItem = computed(() => {
  if (!currentUser.value) return null;
  const index = filaCompradores.findIndex(i => i.usuario_id === currentUser.value.id);
  if (index === -1) return null;
  return { ...filaCompradores[index], position: index + 1, isNext: index === 0 };
});

const filaCompradoresFiltrada = computed(() => {
  return filaCompradores.filter(p => {
    if (filtroFila.item) {
      const key = filtroFila.item === "Café" ? "cafe" : "filtro";
      if (!p[key] || p[key] <= 0) return false;
    }
    if (filtroFila.usuario) {
      const search = filtroFila.usuario.toLowerCase();
      if (!p.usuario.email.toLowerCase().includes(search)) return false;
    }
    if (filtroFila.periodo?.inicio && filtroFila.periodo?.fim && p.created_at) {
      const created = new Date(p.created_at);
      if (created < filtroFila.periodo.inicio || created > filtroFila.periodo.fim) return false;
    }
    return true;
  });
});


// ------------------------------
// FUNÇÕES DE FORMATAÇÃO
// ------------------------------
const formatarDataLocal = iso => {
  const data = new Date(iso);
  return `${String(data.getDate()).padStart(2, "0")}/${
    String(data.getMonth() + 1).padStart(2, "0")
  }/${data.getFullYear()} ${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;
};

const formatarPedidos = item => {
  if (!item) return "✅ Sem itens de compra definidos";
  const needs = [];
  if (item.cafe > 0) needs.push(`☕ Café x${item.cafe}`);
  if (item.filtro > 0) needs.push(`🔽 Filtro x${item.filtro}`);
  if (item.created_at) needs.push(`Entrou na fila em: ${formatarDataLocal(item.created_at)}`);
  return needs.length ? needs.join(" | ") : "✅ Sem itens de compra definidos";
};

// ------------------------------
// FILTROS
// ------------------------------
function updatePeriodoText(value) {
  if (!value || !value.start || !value.end) {
    periodoText.value = "";
    filtroFila.periodo = null;
  } else {
    periodoText.value = `${formatarDataLocal(value.start)} → ${formatarDataLocal(value.end)}`;
    filtroFila.periodo = { inicio: new Date(value.start), fim: new Date(value.end) };
  }
}

const limparFiltrosFila = () => {
  filtroFila.item = null;
  filtroFila.usuario = "";
  filtroFila.periodo = null;
  periodoText.value = "";
  alert("Filtros limpos."); // Ou usar alertMessage se preferir
};

// ------------------------------
// DIALOGS
// ------------------------------
function abrir() { visible.value = true; }
function cancelar() { visible.value = false; }

// ------------------------------
// AÇÕES NA FILA
// ------------------------------
const fetchFila = async () => {
  loading.value = true;
  try {
    const res = await connection.get("/fila");
    filaCompradores.splice(0, filaCompradores.length, ...res.data);
  } catch (e) {
    console.error(e);
    alertMessage.value = "Erro ao carregar a fila";
    alertType.value = "error";
  } finally {
    loading.value = false;
  }
};

const adicionarItem = async tipo => {
  if (!currentUser.value || loading.value) return;
  loadingAdicionar.value = true;
  try {
    if (tipo === "filtro" && (!currentUserQueueItem.value || currentUserQueueItem.value.cafe <= 0)) {
      alertMessage.value = "❌ Não pode adicionar filtro antes de adicionar café.";
      alertType.value = "warning";
      return;
    }
    const res = await connection.patch(`/fila/adicionar_pedido/${tipo}`);
    alertMessage.value = res?.data?.message || `Item ${tipo} adicionado`;
    alertType.value = "success";
    await fetchFila();
  } catch (e) {
    console.error(e);
    alertMessage.value = `Falha ao adicionar ${tipo}`;
    alertType.value = "error";
  } finally {
    loadingAdicionar.value = false;
  }
};

const removerDaFila = async filaItem => {
  if (loading.value) return;
  if (!isCurrentUserAdmin.value && filaItem.usuario_id !== currentUser.value?.id) {
    alertMessage.value = "Só pode remover-se a si mesmo da fila.";
    alertType.value = "warning";
    return;
  }
  loading.value = true;
  try {
    await connection.delete(`/fila/sair/${filaItem.usuario_id}`);
    alertMessage.value = filaItem.usuario_id === currentUser.value?.id
      ? `Saiu da fila.`
      : `${filaItem.usuario.email.split("@")[0]} removido da fila.`;
    alertType.value = "success";
    await fetchFila();
  } catch (e) {
    console.error(e);
    alertMessage.value = "Falha ao remover da fila";
    alertType.value = "error";
  } finally {
    loading.value = false;
  }
};

const moverParaProximo = async id => {
  if (!isCurrentUserAdmin.value || loading.value) return;
  loading.value = true;
  try {
    const res = await connection.patch(`/fila/mover_proximo/${id}`);
    alertMessage.value = res?.data?.message || "Utilizador movido para a 2ª posição.";
    alertType.value = "success";
    await fetchFila();
  } catch (e) {
    console.error(e);
    alertMessage.value = "Falha ao mover utilizador";
    alertType.value = "error";
  } finally {
    loading.value = false;
  }
};

const concluirCompra = async () => {
  if (!proximoComprador.value || !isCurrentUserAdmin.value || loading.value) return;
  loading.value = true;
  try {
    const res = await connection.post(`/fila/concluir/${proximoComprador.value.usuario_id}`);
    alertMessage.value = res?.data?.message || "Compra concluída";
    alertType.value = "success";
    await fetchFila();
  } catch (e) {
    console.error(e);
    alertMessage.value = "Falha ao concluir compra";
    alertType.value = "error";
  } finally {
    loading.value = false;
  }
};

// ------------------------------
// USUÁRIO ATUAL
// ------------------------------
const loadCurrentUser = async () => {
  loading.value = true;
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    alertMessage.value = "Sessão não encontrada";
    alertType.value = "warning";
    loading.value = false;
    return;
  }
  try {
    const res = await connection.get("/usuarios/me");
    currentUser.value = res.data;
    await fetchFila();
  } catch (e) {
    console.error(e);
    alertMessage.value = "Erro ao carregar usuário";
    alertType.value = "error";
    currentUser.value = null;
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  carregando.value = true;
  currentUser.value = null;
  filaCompradores.splice(0, filaCompradores.length);
  alertMessage.value = "Logout realizado com sucesso.";
  alertType.value = "success";
  setTimeout(() => {
    localStorage.removeItem("jwt_token");
    router.push("/login");
  }, 2000);
};

// ------------------------------
// ON MOUNT
// ------------------------------
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
  border: 3px solid #6d4c41 !important;
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
