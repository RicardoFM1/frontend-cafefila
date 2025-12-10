<template>
  <v-app class="app-background">
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

    <v-main>
      <v-container fluid class="pa-4 main-content-padding">
        <v-row>
          <v-col cols="12">
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

        <v-row v-if="!loading" class="mb-6">
          <v-col cols="12" md="6">
            <v-card class="pa-6 elevation-6" color="white" rounded="xl">
              <v-card-title
                class="text-h5 font-weight-bold text-brown-darken-3 d-flex align-center"
              >
                <v-icon left size="28" class="mr-2">mdi-account-check</v-icon>
                O seu Estado na Fila
              </v-card-title>
              <v-divider class="mt-1 mb-4"></v-divider>

              <template v-if="currentUserQueueItem">
                <v-sheet
                  :color="currentUserQueueItem.isNext ? 'green-lighten-5' : 'blue-grey-lighten-5'"
                  class="pa-4 rounded-lg d-flex align-center justify-space-between mb-4 elevation-2"
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
                
                <v-card-text class="py-0">
                  <div class="text-subtitle-1 font-weight-bold mb-3 text-brown-darken-3">
                    Gerir Seus Pedidos na Fila:
                  </div>

                  <v-row align="center" class="mb-3">
                    <v-col cols="5" class="pa-1">
                      <div class="font-weight-medium text-brown-darken-2 d-flex align-center">
                        <v-icon color="brown-darken-2" class="mr-1">mdi-coffee-outline</v-icon> Café:
                      </div>
                    </v-col>
                    <v-col cols="7" class="pa-1">
                      <div class="d-flex align-center">
                        <v-btn
                          icon="mdi-minus"
                          size="small"
                          color="red-lighten-1"
                          :disabled="currentUserQueueItem.cafe <= 0 || loadingItemUpdate.cafe"
                          :loading="loadingItemUpdate.cafe === -1"
                          @click="alterarQuantidade('cafe', -1)"
                          variant="flat"
                          class="mr-2"
                        />
                        <v-chip
                          size="large"
                          color="brown-darken-1"
                          class="font-weight-bold"
                        >
                          {{ currentUserQueueItem.cafe }}
                        </v-chip>
                        <v-btn
                          icon="mdi-plus"
                          size="small"
                          color="green-darken-1"
                          :disabled="loadingItemUpdate.cafe"
                          :loading="loadingItemUpdate.cafe === 1"
                          @click="alterarQuantidade('cafe', 1)"
                          variant="flat"
                          class="ml-2"
                        />
                      </div>
                    </v-col>
                  </v-row>

                  <v-row align="center" class="mb-4">
                    <v-col cols="5" class="pa-1">
                      <div class="font-weight-medium text-brown-darken-2 d-flex align-center">
                        <v-icon color="light-blue-darken-3" class="mr-1">mdi-filter</v-icon> Filtro:
                      </div>
                    </v-col>
                    <v-col cols="7" class="pa-1">
                      <div class="d-flex align-center">
                        <v-btn
                          icon="mdi-minus"
                          size="small"
                          color="red-lighten-1"
                          :disabled="currentUserQueueItem.filtro <= 0 || loadingItemUpdate.filtro"
                          :loading="loadingItemUpdate.filtro === -1"
                          @click="alterarQuantidade('filtro', -1)"
                          variant="flat"
                          class="mr-2"
                        />
                        <v-chip
                          size="large"
                          color="light-blue-darken-3"
                          class="font-weight-bold"
                        >
                          {{ currentUserQueueItem.filtro }}
                        </v-chip>
                        <v-btn
                          icon="mdi-plus"
                          size="small"
                          color="green-darken-1"
                          :disabled="loadingItemUpdate.filtro"
                          :loading="loadingItemUpdate.filtro === 1"
                          @click="alterarQuantidade('filtro', 1)"
                          variant="flat"
                          class="ml-2"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider class="my-4"></v-divider>

                <v-btn
                  color="red-lighten-1"
                  variant="flat"
                  :loading="loadingSair"
                  @click="removerDaFila(currentUserQueueItem)"
                  block
                  class="mt-2 font-weight-bold elevation-2"
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
                  Não está na fila. Adicione um item para entrar!
                </v-alert>
                
                <v-divider class="my-4"></v-divider>
                
                <v-card-text class="py-0">
                  <div class="text-subtitle-1 font-weight-bold mb-3 text-brown-darken-3">
                    Entrar na Fila:
                  </div>
                  <v-row>
                    <v-col cols="6" class="pa-1">
                      <v-btn
                        block
                        color="brown-darken-1"
                        @click="alterarQuantidade('cafe', 1)"
                        :disabled="loadingItemUpdate.cafe || !currentUser"
                        :loading="loadingItemUpdate.cafe === 1"
                        prepend-icon="mdi-coffee-maker"
                        size="large"
                        variant="flat"
                        class="elevation-2"
                      >
                        Adicionar Café
                      </v-btn>
                    </v-col>
                    <v-col cols="6" class="pa-1">
                      <v-btn
                        block
                        color="light-blue-darken-3"
                        @click="alterarQuantidade('filtro', 1)"
                        :disabled="loadingItemUpdate.filtro || !currentUser"
                        :loading="loadingItemUpdate.filtro === 1"
                        prepend-icon="mdi-filter-cog"
                        size="large"
                        variant="flat"
                        class="elevation-2"
                      >
                        Adicionar Filtro
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </template>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" v-if="proximoComprador">
            <v-card
              color="brown-lighten-5"
              class="pa-6 h-100 elevation-6 card-next-queue border-lg border-amber-darken-2"
              rounded="xl"
            >
              <v-card-title class="text-h5 text-center text-brown-darken-4 font-weight-black mb-1">
                <v-icon left size="32" color="amber-darken-3" class="bounce">mdi-fire</v-icon> AGORA É A VEZ DE:
              </v-card-title>

              <v-divider class="mb-4 mt-2"></v-divider>

              <v-card-text>
                <div
                  class="text-h4 font-weight-black mb-4 text-center text-brown-darken-2 text-capitalize"
                >
                  {{ proximoComprador.usuario.email.split("@")[0] }}
                </div>
                <v-sheet class="pa-4 rounded-lg bg-brown-lighten-4 elevation-1">
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
                  :loading="loadingConcluir"
                  :disabled="!isCurrentUserAdmin || loading"
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

        <v-row v-else-if="filaCompradoresFiltrada.length > 0 || (filtroAtivo && filaCompradoresFiltrada.length === 0)">
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
                      label="Item"
                      clearable
                      prepend-icon="mdi-coffee"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>

                  <v-col cols="12" md="4">
    <v-select
        v-model="filtroFila.usuarioId"
        :items="listaUsuarios"
        :item-title="(item) => item.email.split('@')[0]" 
        item-value="id"
        label="Usuário"
        clearable
        prepend-icon="mdi-account-search"
        variant="outlined"
        density="compact"
        hide-details
    />
</v-col>

                  <v-col cols="12" md="4" class="d-flex align-center">
                    <v-text-field
                      v-model="filtroFila.dataInicio"
                      label="Data Mínima (Opcional)"
                      placeholder="DD/MM/AAAA"
                      prepend-icon="mdi-calendar-start"
                      variant="outlined"
                      density="compact"
                      hide-details
                      maxlength="10"
                      @input="formatarInputData($event, 'dataInicio')"
                      class="mr-2"
                    />
                    <v-btn color="grey-darken-1" @click="limparFiltrosFila" variant="outlined" class="flex-grow-0">
                      Limpar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

              <v-list density="default" class="bg-transparent">
                <template v-if="restanteDaFilaFiltrada.length > 0">
                  <v-list-item
                    v-for="(p, index) in restanteDaFilaFiltrada"
                    :key="p.usuario_id"
                    class="my-3 pa-3 rounded-lg list-item-hover transition-swing"
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
                        {{ filtroAtivo ? index + 1 : index + 2 }}
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
                        :loading="loadingMover"
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
                </template>
                <v-card v-else variant="outlined" class="text-center pa-4 text-grey-darken-1 my-3">
                  <v-icon size="30" class="mb-2">mdi-magnify-remove-outline</v-icon>
                  <p class="font-weight-medium">Nenhum resultado encontrado para os filtros.</p>
                </v-card>
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

        <v-row v-if="!loading" class="mt-8">
          
          <v-col  cols="12" md="4">
            <v-card class="pa-5 elevation-6" rounded="xl" color="blue-grey-lighten-5">
              <v-card-title class="text-h6 font-weight-bold text-blue-grey-darken-3">
                <v-icon left class="mr-2">mdi-history</v-icon>
                Sua Última Compra
              </v-card-title>

              <v-divider class="my-3"></v-divider>

              <template v-if="ultimaCompra">
                <div class="text-body-1 text-blue-grey-darken-3 mb-2">
                  <strong class="font-weight-black">Data:</strong> {{ formatarData(ultimaCompra.data) }}
                </div>
                <div class="text-body-1 text-blue-grey-darken-3 mb-2">
                  <strong class="font-weight-black">Itens:</strong> {{ ultimaCompra.descricao }}
                </div>
                <div class="text-body-1 text-blue-grey-darken-3">
                  <strong class="font-weight-black">Total:</strong> 
                  <v-chip size="small" color="blue-grey-darken-2" class="ml-1 font-weight-bold">
                    {{ ultimaCompra.total }} unid.
                  </v-chip>
                </div>
              </template>

              <template v-else>
                <v-alert type="info" variant="tonal" color="blue-grey">
                  Ainda não realizou compras.
                </v-alert>
              </template>
            </v-card>
          </v-col>

          
          <v-col cols="12" md="8">
            <v-card class="pa-5 elevation-6" rounded="xl">
              <v-card-title class="text-h6 font-weight-bold text-brown-darken-3 d-flex align-center">
                <v-icon left class="mr-2">mdi-cart-outline</v-icon>
                Histórico de Compras ({{ listaComprasFiltrada.length }})
              </v-card-title>

              <v-divider class="my-3"></v-divider>

              <v-card-text class="pt-0 pb-2">
                <v-row align="center" class="mb-3">
                  <v-col cols="12" md="4" sm="6">
    <v-select
        v-model="filtroCompras.usuarioId"
        :items="listaUsuarios"
        :item-title="(item) => item.email.split('@')[0]"  
        item-value="id"
        label="Filtrar por Usuário"
        clearable
        prepend-icon="mdi-account-circle"
        variant="outlined"
        density="compact"
        hide-details
    />
</v-col>

                  <v-col cols="12" md="3" sm="6">
                    <v-select
                      v-model="filtroCompras.item"
                      :items="['Café', 'Filtro']"
                      label="Filtrar por Item"
                      clearable
                      prepend-icon="mdi-tag-outline"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>

                  <v-col cols="12" md="3" sm="6">
                    <v-text-field
                      v-model="filtroCompras.data"
                      label="Filtrar por Data"
                      placeholder="DD/MM/AAAA"
                      prepend-icon="mdi-calendar-range"
                      variant="outlined"
                      density="compact"
                      hide-details
                      maxlength="10"
                      @input="formatarInputData($event, 'data', 'filtroCompras')"
                    />
                  </v-col>

                  <v-col cols="12" md="2" sm="6" class="d-flex align-center">
                    <v-btn color="grey-darken-1" @click="limparFiltrosCompras" variant="outlined" class="flex-grow-1">
                      Limpar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              
              <v-data-table
                :headers="headersCompras"
                :items="listaComprasFiltrada"
                item-key="id"
                density="comfortable"
                class="elevation-0"
                no-data-text="Nenhuma compra encontrada ou correspondente aos filtros"
              >
                <template #item.usuario.email="{ item }">
                  <span class="font-weight-medium text-capitalize">
                    {{ item.usuario.email.split("@")[0] }}
                  </span>
                </template>
                
                <template #item.data="{ item }">
                  {{ formatarData(item.data) }}
                </template>

                <template #item.descricao="{ item }">
                  <v-chip size="small" color="blue-grey-darken-1" label>{{ item.descricao }}</v-chip>
                </template>

                <template #item.total="{ item }">
                  <span class="font-weight-bold text-brown-darken-2">{{ item.total }}</span>
                </template>

              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="showInfoDialog" max-width="600">
      <v-card rounded="xl">
        <v-card-title
          class="text-h5 font-weight-bold bg-brown-darken-4 text-white d-flex justify-space-between"
        >
          Informações Atuais de Compra
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
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { connection } from "@/connection/axiosConnection";

const router = useRouter();
const filaCompradores = reactive([]);
const listaUsuarios = reactive([]); 
const loading = ref(false);
const listaCompras = ref([]); 
const ultimaCompra = ref(null);

const headersCompras = ref([
    { title: 'Data', key: 'data' },
    { title: 'Usuário', key: 'usuario.email' }, 
    { title: 'Descrição', key: 'descricao' },
    { title: 'Total de Itens', key: 'total' },
]);

const formatarData = (iso) => {
    if (!iso) return 'N/A';
    const data = new Date(iso);
    return `${String(data.getDate()).padStart(2, "0")}/${
        String(data.getMonth() + 1).padStart(2, "0")
    }/${data.getFullYear()} ${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;
};

const loadingItemUpdate = reactive({
    cafe: 0,
    filtro: 0,
});
const alertMessage = ref(null);
const alertType = ref("info");
const currentUser = ref(null);
const showInfoDialog = ref(false);
const coffeeInfoText = ref("A procurar informações...");
const visible = ref(false);
const carregando = ref(false);

const filtroFila = reactive({
    item: null,
    usuarioId: null,
    dataInicio: "",
});

const filtroCompras = reactive({
    usuarioId: null,
    item: null,
    data: null,
});

const itemOptions = ["Café", "Filtro"];

const isCurrentUserAdmin = computed(() => !!currentUser.value?.admin);

const _currentUserQueueItemState = ref(null);

const proximoComprador = computed(() => filaCompradores[0] || null);

const currentUserQueueItem = computed(() => {
    if (!_currentUserQueueItemState.value) return null;
    const index = filaCompradores.findIndex(i => i.usuario_id === _currentUserQueueItemState.value.usuario_id);
    
    return { 
        ..._currentUserQueueItemState.value, 
        position: index !== -1 ? index + 1 : 1,
        isNext: index === 0 
    };
});


watch(filaCompradores, (newFila) => {
    if (currentUser.value) {
        const item = newFila.find(i => i.usuario_id === currentUser.value.id);
        if (item) {
            _currentUserQueueItemState.value = item;
        } else if (_currentUserQueueItemState.value && !item) {
            _currentUserQueueItemState.value = null;
        }
    }
}, { deep: true });


watch(currentUser, (newUser) => {
    if (newUser) {
        const item = filaCompradores.find(i => i.usuario_id === newUser.id);
        _currentUserQueueItemState.value = item || null;
    } else {
        _currentUserQueueItemState.value = null;
    }
});


const filtroAtivo = computed(() => {
    return !!(filtroFila.item || filtroFila.usuarioId || (filtroFila.dataInicio && filtroFila.dataInicio.length === 10));
});

const parseDataBR = (dataStr) => {
    if (!dataStr || dataStr.length !== 10) return null;
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(ano, mes - 1, dia);
};


const filaCompradoresFiltrada = computed(() => {
    return filaCompradores.filter(p => {
        if (filtroFila.item) {
            const key = filtroFila.item === "Café" ? "cafe" : "filtro";
            if (!p[key] || p[key] <= 0) return false;
        }
        
        if (filtroFila.usuarioId) {
            if (p.usuario_id !== filtroFila.usuarioId) return false;
        }

        if (p.created_at) {
            const dataCriacao = new Date(p.created_at);
            
            if (filtroFila.dataInicio && filtroFila.dataInicio.length === 10) {
                const inicio = parseDataBR(filtroFila.dataInicio);
                if (inicio) {
                    inicio.setHours(0, 0, 0, 0);
                    if (dataCriacao < inicio) return false;
                }
            }
        }

        return true;
    });
});


const listaComprasFiltrada = computed(() => {
    if (!listaCompras.value) return [];
    
    return listaCompras.value.filter(compra => {
        const { usuarioId, item, data } = filtroCompras;
        let pass = true;

        if (usuarioId !== null && compra.usuario_id !== usuarioId) {
            pass = false;
        }

        if (item) {
            const itemLower = item.toLowerCase();
            if (!compra.descricao.toLowerCase().includes(itemLower)) {
                pass = false;
            }
        }
        
        if (data && data.length === 10) {
            const compraDate = formatarData(compra.data).split(' ')[0]; 
            if (compraDate !== data) {
                pass = false;
            }
        }

        return pass;
    });
});

const restanteDaFilaFiltrada = computed(() => {
    if (filtroAtivo.value) {
        return filaCompradoresFiltrada.value;
    }
    return filaCompradoresFiltrada.value.slice(1);
});

const formatarInputData = (event, campo, target = 'filtroFila') => {
    const targetObject = target === 'filtroFila' ? filtroFila : filtroCompras;
    let valor = event.target.value.replace(/\D/g, ""); 
    if (valor.length > 8) valor = valor.slice(0, 8);

    if (valor.length >= 5) {
        valor = valor.slice(0, 2) + "/" + valor.slice(2, 4) + "/" + valor.slice(4);
    } else if (valor.length >= 3) {
        valor = valor.slice(0, 2) + "/" + valor.slice(2);
    }
    
    targetObject[campo] = valor;
};

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

const limparFiltrosFila = () => {
    filtroFila.item = null;
    filtroFila.usuarioId = null;
    filtroFila.dataInicio = "";
    alertMessage.value = "Filtros da fila limpos.";
    alertType.value = "info";
};

const limparFiltrosCompras = () => {
    filtroCompras.usuarioId = null;
    filtroCompras.item = null;
    filtroCompras.data = null;
    alertMessage.value = "Filtros de compras limpos.";
    alertType.value = "info";
};

function abrir() { visible.value = true; }
function cancelar() { visible.value = false; }

const fetchUsuarios = async () => {
    try {
        const res = await connection.get("/usuarios");
        listaUsuarios.splice(0, listaUsuarios.length, ...res.data);
    } catch (e) {
        console.error("Erro ao buscar usuários", e);
    }
};

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


const alterarQuantidade = async (tipo, delta) => {
    if (!currentUser.value) return; 

    const isEntering = delta > 0 && !_currentUserQueueItemState.value;
    let currentItem = isEntering ? { cafe: 0, filtro: 0, usuario_id: currentUser.value.id, created_at: new Date().toISOString() } : _currentUserQueueItemState.value;
    
    if (!currentItem) return; 

    const novaQuantidade = currentItem[tipo] + delta;

    if (novaQuantidade < 0) return;

    
    let tempItem = { ...currentItem }; 
    tempItem[tipo] = novaQuantidade;
    
    
    loadingItemUpdate[tipo] = delta; 


    if (isEntering) {
        _currentUserQueueItemState.value = tempItem;
    } else {
    
        _currentUserQueueItemState.value[tipo] = novaQuantidade; 
    }
    
    try {
        const token = localStorage.getItem("jwt_token");
        const res = await connection.patch(
            "fila/atualizar_quantidade",
            {
                tipo: tipo,
                quantidade: novaQuantidade
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        alertType.value = "success";
        alertMessage.value = res.data.message || "Quantidade atualizada com sucesso";

        
    
        if (res.data.filaItem) {
            _currentUserQueueItemState.value = res.data.filaItem;
            
            if (isEntering || res.data.reordenar) { 
                await fetchFila();
            }
        } else {
          
            if (isEntering) { 
                await fetchFila();
            } else {
            
                await fetchCurrentUserItem(); 
            }
        }

    } catch (e) {
      
        console.error("Erro ao atualizar a quantidade:", e);
        
        if (_currentUserQueueItemState.value) {
            _currentUserQueueItemState.value[tipo] = currentItem[tipo]; 
        }
        
        await fetchFila(); 

        alertType.value = "error";
        alertMessage.value = e.response?.data?.message || "Erro ao atualizar. Dados revertidos.";
    } finally {
        loadingItemUpdate[tipo] = 0; 
    }
};


const fetchCurrentUserItem = async () => {
    try {
        const res = await connection.get(`/fila/${currentUser.value.id}`); 
        _currentUserQueueItemState.value = res.data; 
    } catch (e) {
        console.error("Erro ao buscar item do usuário.", e);
      
    }
}

const loadingSair = ref(false)
const removerDaFila = async filaItem => {
    if (loadingSair.value) return;
    if (!isCurrentUserAdmin.value && filaItem.usuario_id !== currentUser.value?.id) {
        alertMessage.value = "Só pode remover-se a si mesmo da fila.";
        alertType.value = "warning";
        return;
    }
    loadingSair.value = true;
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
        loadingSair.value = false;
    }
};

const loadingMover = ref(false)
const moverParaProximo = async id => {
    if (!isCurrentUserAdmin.value || loadingMover.value) return;
    loadingMover.value = true;
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
        loadingMover.value = false;
    }
};

const loadingConcluir = ref(false)

const concluirCompra = async () => {
    if (!proximoComprador.value || !isCurrentUserAdmin.value || loadingConcluir.value) return;
    loadingConcluir.value = true;
    try {
        const res = await connection.post(`/fila/concluir/${proximoComprador.value.usuario_id}`);
        alertMessage.value = res?.data?.message || "Compra concluída";
        alertType.value = "success";
        await fetchFila(); 
        await listarCompras(); 
      
    } catch (e) {
        console.error(e);
        alertMessage.value = "Falha ao concluir compra";
        alertType.value = "error";
    } finally {
        loadingConcluir.value = false;
    }
};


const loadCurrentUser = async () => {
    loading.value = true;
    const token = localStorage.getItem("jwt_token");
    if (!token) {
        alertMessage.value = "Sessão não encontrada";
        alertType.value = "warning";
        loading.value = false;
        router.push("/login")
        return;
    }
    try {
        const res = await connection.get("/usuarios/me");
        currentUser.value = res.data;
        await fetchUsuarios(); 
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


async function listarCompras() {
    try {
        const res = await connection.get("/compras");
        if (res.status === 200) {
            listaCompras.value = res.data; 

            if (listaCompras.value.length > 0 && currentUser.value) {
                
                const userCompras = listaCompras.value
                    .filter(c => c.usuario_id === currentUser.value.id)
                    .sort((a, b) => new Date(b.data) - new Date(a.data)); 
                
                
                if (userCompras.length > 0) {
                    ultimaCompra.value = userCompras[0];
                } else {
                    ultimaCompra.value = null;
                }
            }
        }
    } catch (err) {
        console.error("Erro ao listar compras:", err);
    }
}

onMounted(async () => {
    if(!localStorage.getItem("token")){
      router.push("/login")
    }
    await loadCurrentUser();
    await listarCompras();
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