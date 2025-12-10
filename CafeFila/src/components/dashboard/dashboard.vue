<template>
  <v-app class="app-background">
    <v-overlay
      :model-value="loading"
      class="align-center justify-center opacity-75"
      persistent
      contained
      z-index="9999"
    >
      <div class="text-center">
        <v-progress-circular indeterminate color="amber-lighten-3" size="90" width="10" />
        <p class="mt-6 text-h5 font-weight-bold text-white">
          ☕ A Carregar Dados da Fila...
        </p>
      </div>
    </v-overlay>

    <v-app-bar app color="brown-darken-3" elevation="8">
      <v-container class="py-0 fill-height d-flex justify-space-between align-center">
        <v-toolbar-title
          class="text-amber-lighten-2 font-weight-black text-h4 flex-grow-1 text-md-left text-center"
        >
          <v-icon size="32" class="mr-2">mdi-coffee-to-go</v-icon>
          DASHBOARD DE CAFÉ
        </v-toolbar-title>
        <v-btn
          variant="flat"
          color="white"
          prepend-icon="mdi-exit-to-app"
          class="font-weight-medium rounded-pill"
          @click="abrir"
          size="large"
        >
          Sair
          <span v-if="currentUser" class="ml-1 d-none d-sm-inline font-weight-bold text-brown-darken-3 text-capitalize">
            ({{ currentUser.email.split("@")[0] }})
          </span>
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container fluid class="pa-4 pa-sm-6 main-content-padding">
        <v-row>
          <v-col cols="12">
            <v-alert
              v-if="alertMessage"
              :type="alertType"
              variant="flat"
              closable
              class="my-2 elevation-4 rounded-lg"
              @click:close="alertMessage = null"
              border="start"
              border-color="black"
              prominent
            >
              {{ alertMessage }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-if="!loading" class="mb-6">
          <v-col cols="12" md="6">
            <v-card class="pa-6 elevation-10" color="white" rounded="xl" border>
              <v-card-title
                class="text-h5 font-weight-black text-brown-darken-3 d-flex align-center pb-2"
              >
                <v-icon size="32" class="mr-3 text-amber-darken-3">mdi-account-circle</v-icon>
                O seu Estado na Fila
              </v-card-title>
              <v-divider class="mt-1 mb-4"></v-divider>

              <template v-if="currentUserQueueItem">
                <v-sheet
                  :color="currentUserQueueItem.isNext ? 'green-lighten-5' : 'blue-grey-lighten-5'"
                  class="pa-4 rounded-xl d-flex flex-column flex-sm-row align-center justify-space-between mb-6 elevation-4"
                >
                  <div class="mb-2 mb-sm-0">
                    <div class="text-caption font-weight-bold text-medium-emphasis mb-1">
                      A Sua Posição Atual
                    </div>
                    <v-chip
                      :color="currentUserQueueItem.isNext ? 'green-darken-2' : 'blue-darken-2'"
                      label
                      size="x-large"
                      class="font-weight-black text-uppercase"
                    >
                      <v-icon start size="28">
                        {{
                          currentUserQueueItem.isNext
                            ? "mdi-trophy-gold"
                            : "mdi-numeric-" + currentUserQueueItem.position + "-circle-outline"
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
                  <div class="text-subtitle-1 font-weight-bold mb-4 text-brown-darken-3 d-flex align-center">
                    <v-icon left size="20" class="mr-1">mdi-basket</v-icon> Gerir Seus Pedidos:
                  </div>

                  <v-row align="center" class="mb-3">
    <v-col cols="12" sm="5" class="py-1">
        <div class="font-weight-bold text-brown-darken-2 d-flex align-center text-subtitle-1">
            <v-icon color="brown-darken-2" class="mr-2" size="24">mdi-coffee-outline</v-icon> Café:
        </div>
    </v-col>
    <v-col cols="12" sm="7" class="py-1">
        <div class="d-flex align-center justify-end">
            <v-text-field
                v-model.number="quantidadeCafeDesejada"
                type="number"
                min="0"
                density="compact"
                variant="outlined"
                hide-details
                style="max-width: 150px;" 
                class="text-center font-weight-black"
                
                :disabled="loadingItemUpdate.cafe"
                
                @blur="atualizarPedido('cafe')" 
            >
                <template #append-inner>
                    <v-icon size="small" @click="incrementarQuantidadeLocal('cafe', 1)" :disabled="loadingItemUpdate.cafe">mdi-plus</v-icon>
                </template>
                <template #prepend-inner>
                    <v-icon size="small" @click="incrementarQuantidadeLocal('cafe', -1)" :disabled="loadingItemUpdate.cafe">mdi-minus</v-icon>
                </template>
            </v-text-field>
        </div>
    </v-col>
</v-row>

                 <v-row align="center" class="mb-4">
    <v-col cols="12" sm="5" class="py-1">
        <div class="font-weight-bold text-brown-darken-2 d-flex align-center text-subtitle-1">
            <v-icon color="light-blue-darken-3" class="mr-2" size="24">mdi-filter</v-icon> Filtro:
        </div>
    </v-col>
    <v-col cols="12" sm="7" class="py-1">
        <div class="d-flex align-center justify-end">
            <v-text-field
                v-model.number="quantidadeFiltroDesejada"
                type="number"
                min="0"
                density="compact"
                variant="outlined"
                hide-details
                style="max-width: 150px;"
                class="text-center font-weight-black"
                
                :disabled="loadingItemUpdate.filtro"
                
                @blur="atualizarPedido('filtro')"
            >
                <template #append-inner>
                    <v-icon size="small" @click="incrementarQuantidadeLocal('filtro', 1)" :disabled="loadingItemUpdate.filtro">mdi-plus</v-icon>
                </template>
                <template #prepend-inner>
                    <v-icon size="small" @click="incrementarQuantidadeLocal('filtro', -1)" :disabled="loadingItemUpdate.filtro">mdi-minus</v-icon>
                </template>
            </v-text-field>
        </div>
    </v-col>
</v-row>
                </v-card-text>

                <v-divider class="my-4"></v-divider>

                <v-btn
                  color="red-darken-1"
                  variant="flat"
                  :loading="loadingSair"
                  @click="removerDaFila(currentUserQueueItem)"
                  block
                  class="mt-4 font-weight-black elevation-4 rounded-xl"
                  size="x-large"
                >
                  <v-icon start>mdi-close-circle</v-icon> Sair da Fila
                </v-btn>
              </template>

              <template v-else>
                <v-alert
                  type="info"
                  variant="tonal"
                  density="comfortable"
                  class="mb-6 rounded-lg elevation-2"
                  color="blue-grey"
                  icon="mdi-information-outline"
                >
                  Não está na fila. Adicione um item para entrar!
                </v-alert>

                <v-divider class="my-4"></v-divider>

                <v-card-text class="py-0">
                  <div class="text-subtitle-1 font-weight-bold mb-3 text-brown-darken-3 d-flex align-center">
                     <v-icon left size="20" class="mr-1">mdi-plus-box</v-icon> Entrar na Fila:
                  </div>
                  <v-row class="mt-4">
                    <v-col cols="12" sm="6" class="pa-2">
                      <v-btn
                        block
                        color="brown-darken-1"
                        @click="atualizarPedido('cafe', 1)"
                        :disabled="loadingItemUpdate.cafe || !currentUser"
                        :loading="loadingItemUpdate.cafe === 1"
                        prepend-icon="mdi-coffee-maker-outline"
                        size="large"
                        variant="flat"
                        class="elevation-4 font-weight-black rounded-lg"
                      >
                        Café
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" class="pa-2">
                      <v-btn
                        block
                        color="light-blue-darken-3"
                        @click="atualizarPedido('filtro', 1)"
                        :disabled="loadingItemUpdate.filtro || !currentUser"
                        :loading="loadingItemUpdate.filtro === 1"
                        prepend-icon="mdi-filter-cog-outline"
                        size="large"
                        variant="flat"
                        class="elevation-4 font-weight-black rounded-lg"
                      >
                        Filtro
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </template>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" v-if="proximoComprador">
            <v-card
              color="amber-lighten-5"
              class="pa-6 h-100 elevation-10 border-lg border-amber-darken-2"
              rounded="xl"
            >
              <v-card-title class="text-h4 text-center text-brown-darken-4 font-weight-black mb-2">
                <v-icon size="36" color="amber-darken-3" class="bounce mr-2">mdi-fire</v-icon> PRÓXIMO:
              </v-card-title>

              <v-divider class="mb-6 mt-2"></v-divider>

              <v-card-text class="text-center">
                <v-chip
                  color="brown-darken-2"
                  size="x-large"
                  class="text-h5 font-weight-black mb-4 text-white text-capitalize elevation-2 px-6 py-4"
                >
                  {{ proximoComprador.usuario.email.split("@")[0] }}
                </v-chip>

                <v-sheet class="pa-4 rounded-xl bg-brown-lighten-4 elevation-3 mt-4">
                  <div class="text-subtitle-1 font-weight-bold text-brown-darken-3 mb-2 d-flex align-center justify-center">
                    <v-icon left size="24" class="mr-1">mdi-shopping-outline</v-icon> Itens a Comprar:
                  </div>
                  <p class="text-body-1 font-weight-black text-brown-darken-2">
                    {{ formatarPedidos(proximoComprador) }}
                  </p>
                </v-sheet>
              </v-card-text>

              <v-card-actions class="px-3 pt-6">
                <v-btn
                  block
                  color="green-darken-1"
                  size="x-large"
                  :loading="loadingConcluir"
                  :disabled="!isCurrentUserAdmin || loading"
                  @click="concluirCompra"
                  class="font-weight-black elevation-5 rounded-xl"
                  prepend-icon="mdi-coffee-check"
                >
                  CONFIRMAR COMPRA
                </v-btn>
              </v-card-actions>

              <v-card-subtitle
                v-if="!isCurrentUserAdmin"
                class="text-red-darken-2 text-center mt-3 font-weight-medium text-caption"
              >
                Ação reservada para administradores.
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="!loading && filaCompradores.length === 0">
          <v-col cols="12">
            <v-card class="pa-8 text-center elevation-6" color="green-lighten-5" rounded="xl">
              <v-icon size="60" color="green-darken-2">mdi-cup-water</v-icon>
              <p class="text-h5 mt-4 font-weight-black text-green-darken-2">
                ✨ Fila Vazia! Missão Cumprida. ✨
              </p>
              <p class="text-body-1 text-medium-emphasis mt-2">
                Ninguém precisa comprar neste momento. Aproveite o seu café!
              </p>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else-if="filaCompradoresFiltrada.length > 0 || (filtroAtivo && filaCompradoresFiltrada.length === 0)">
          <v-col cols="12">
            <v-card elevation="8" class="pa-6" rounded="xl">
              <v-card-title
                class="text-h5 text-orange-darken-3 font-weight-black d-flex align-center pb-2"
              >
                <v-icon size="32" class="mr-3">mdi-account-group</v-icon>
                Restante da Fila (Total: {{ restanteDaFilaFiltrada.length }})
              </v-card-title>

              <v-divider class="mt-1 mb-4"></v-divider>

              <v-card-text class="pt-0 pb-2">
                <v-row align="center" class="mb-4">
                  <v-col cols="12" md="4" class="py-1">
                    <v-select
                      v-model="filtroFila.item"
                      :items="itemOptions"
                      label="Filtrar Item"
                      clearable
                      prepend-icon="mdi-filter-variant"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      color="brown-darken-2"
                    />
                  </v-col>

                  <v-col cols="12" md="4" class="py-1">
  <v-autocomplete
    v-model="filtroFila.usuarioId"
    :items="listaUsuarios"
    :item-title="(item) => item.email.split('@')[0]"
    item-value="id"
    label="Filtrar Usuário"
    clearable
    prepend-icon="mdi-account-search"
    variant="outlined"
    density="comfortable"
    hide-details
    color="brown-darken-2"
    
    :custom-filter="filterUser" 
    no-data-text="Usuário não encontrado"
  />
</v-col>

                  <v-col cols="12" md="4" class="py-1 d-flex align-center">
                    <v-text-field
                      v-model="filtroFila.dataInicio"
                      label="Data Mínima (DD/MM/AAAA)"
                      placeholder="DD/MM/AAAA"
                      prepend-icon="mdi-calendar-start"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      maxlength="10"
                      @input="formatarInputData($event, 'dataInicio')"
                      class="mr-2"
                      color="brown-darken-2"
                    />
                    <v-btn color="grey-darken-1" @click="limparFiltrosFila" variant="outlined" class="flex-grow-0" size="large" icon="mdi-close-circle-outline"></v-btn>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

            <v-list density="default" class="bg-transparent pa-2">
    <template v-if="restanteDaFilaFiltrada.length > 0">
        <v-list-item
            v-for="(p, index) in restanteDaFilaFiltrada"
            :key="p.usuario_id"
            class="my-3 pa-4 rounded-xl list-item-hover transition-swing elevation-1"
            :class="{
                'bg-blue-grey-lighten-5 border-s-lg border-blue-darken-1': p.usuario_id === currentUser?.id,
                'bg-white border-b-sm': p.usuario_id !== currentUser?.id,
            }"
        >
            <template v-slot:prepend>
                <v-avatar
                    color="amber-darken-3"
                    size="54"
                    class="font-weight-black white--text elevation-2"
                >
                    {{ filtroAtivo ? index + 1 : index + 2 }}
                </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold text-brown-darken-3 text-subtitle-1 text-capitalize">
                {{ p.usuario.email.split("@")[0] }}
                <v-chip
                    v-if="p.usuario_id === currentUser?.id"
                    color="blue"
                    size="small"
                    class="ml-2 font-weight-black text-uppercase"
                    label
                >
                    VOCÊ
                </v-chip>
            </v-list-item-title>

            <v-list-item-subtitle class="mt-2 font-weight-medium">
                Pedidos:
            </v-list-item-subtitle>

            <div class="d-flex align-center mt-1">
                <v-chip-group>
                    <v-chip
                        v-if="p.cafe > 0"
                        size="small"
                        color="brown-darken-1"
                        prepend-icon="mdi-coffee"
                        class="font-weight-bold"
                    >
                        {{ p.cafe }} Café
                    </v-chip>
                    <v-chip
                        v-if="p.filtro > 0"
                        size="small"
                        color="light-blue-darken-3"
                        prepend-icon="mdi-filter"
                        class="font-weight-bold"
                    >
                        {{ p.filtro }} Filtro
                    </v-chip>
                </v-chip-group>
            </div>
            
            <v-list-item-subtitle class="mt-1 text-caption text-grey-darken-1">
                 <v-icon size="small" class="mr-1">mdi-clock-time-four-outline</v-icon>
                 Desde: {{ formatarData(p.data_criacao) }}
            </v-list-item-subtitle>

            <template v-slot:append>
                <div class="d-flex align-center">
                    <v-btn
                        icon="mdi-arrow-up-circle"
                        size="large"
                        variant="text"
                        color="blue-darken-1"
                        title="Mover para 2ª Posição"
                        :loading="loadingMover"
                        :disabled="!isCurrentUserAdmin || loading"
                        @click="moverParaProximo(p.usuario_id)"
                        class="mr-2"
                    />
                    <v-btn
                        icon="mdi-trash-can"
                        size="large"
                        variant="text"
                        color="red-darken-1"
                        title="Remover da fila"
                        :loading="loading"
                        :disabled="!isCurrentUserAdmin || loading"
                        @click="removerDaFila(p)"
                    />
                </div>
            </template>
        </v-list-item>
    </template>
    <v-card v-else variant="outlined" class="text-center pa-4 text-grey-darken-1 my-3 rounded-lg">
        <v-icon size="36" class="mb-2">mdi-magnify-remove-outline</v-icon>
        <p class="font-weight-medium text-subtitle-1">Nenhum resultado encontrado para os filtros.</p>
    </v-card>
</v-list>

<v-card-subtitle
    v-if="!isCurrentUserAdmin"
    class="text-red-darken-2 text-right mt-2 font-italic text-caption"
>
    Ações de gestão de fila reservadas para administradores.
</v-card-subtitle>

              
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="!loading" class="mt-8">
          <v-col cols="12" md="4">
            <v-card class="pa-6 elevation-8" rounded="xl" color="blue-grey-lighten-5">
              <v-card-title class="text-h6 font-weight-black text-blue-grey-darken-3 pb-2">
                <v-icon size="28" class="mr-2">mdi-history</v-icon>
                Sua Última Compra
              </v-card-title>

              <v-divider class="my-3"></v-divider>

              <template v-if="ultimaCompra">
                <div class="text-body-1 text-blue-grey-darken-3 mb-3">
                  <strong class="font-weight-bold">📅 Data:</strong> {{ formatarData(ultimaCompra.data) }}
                </div>
                <div class="text-body-1 text-blue-grey-darken-3 mb-3">
                  <strong class="font-weight-bold">☕ Itens:</strong> 
                  <v-chip size="small" color="blue-grey-darken-2" class="ml-1 font-weight-bold">{{ ultimaCompra.descricao }}</v-chip>
                </div>
                <div class="text-body-1 text-blue-grey-darken-3">
                  <strong class="font-weight-bold">💲 Total:</strong>
                  <v-chip size="small" color="brown-darken-1" class="ml-1 font-weight-black">
                    {{ ultimaCompra.total }} unid.
                  </v-chip>
                </div>
              </template>

              <template v-else>
                <v-alert type="info" variant="tonal" color="blue-grey" icon="mdi-cup-off-outline" class="rounded-lg">
                  Ainda não realizou compras.
                </v-alert>
              </template>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-card class="pa-6 elevation-8" rounded="xl">
              <v-card-title class="text-h6 font-weight-black text-brown-darken-3 d-flex align-center pb-2">
                <v-icon size="28" class="mr-2">mdi-cart-outline</v-icon>
                Histórico de Compras ({{ listaComprasFiltrada.length }})
              </v-card-title>

              <v-divider class="my-3"></v-divider>

              <v-card-text class="pt-0 pb-2">
                <v-row align="center" class="mb-4">
                  <v-col cols="12" md="4" sm="6" class="py-1">
  <v-autocomplete
    v-model="filtroCompras.usuarioId"
    :items="listaUsuarios"
    :item-title="(item) => item.email.split('@')[0]"
    item-value="id"
    label="Filtrar por Usuário"
    clearable
    prepend-icon="mdi-account-circle"
    variant="outlined"
    density="comfortable"
    hide-details
    color="brown-darken-2"

    :custom-filter="filterUser" 
    no-data-text="Usuário não encontrado"
  />
</v-col>

                  <v-col cols="12" md="3" sm="6" class="py-1">
                    <v-select
                      v-model="filtroCompras.item"
                      :items="['Café', 'Filtro']"
                      label="Filtrar por Item"
                      clearable
                      prepend-icon="mdi-tag-outline"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      color="brown-darken-2"
                    />
                  </v-col>

                  <v-col cols="12" md="3" sm="6" class="py-1">
                    <v-text-field
                      v-model="filtroCompras.data"
                      label="Filtrar por Data (DD/MM/AAAA)"
                      placeholder="DD/MM/AAAA"
                      prepend-icon="mdi-calendar-range"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      maxlength="10"
                      @input="formatarInputData($event, 'data', 'filtroCompras')"
                      color="brown-darken-2"
                    />
                  </v-col>

                  <v-col cols="12" md="2" sm="6" class="py-1 d-flex align-center">
                    <v-btn color="grey-darken-1" @click="limparFiltrosCompras" variant="outlined" class="flex-grow-1" size="large">
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
                class="elevation-0 mt-2"
                no-data-text="Nenhuma compra encontrada ou correspondente aos filtros"
              >
                <template #item.usuario.email="{ item }">
                  <span class="font-weight-black text-capitalize text-brown-darken-3">
                    {{ item.usuario.email.split("@")[0] }}
                  </span>
                </template>

                <template #item.data="{ item }">
                  <v-chip size="small" variant="tonal" color="blue-grey-darken-1">{{ formatarData(item.data) }}</v-chip>
                </template>

                <template #item.descricao="{ item }">
                  <v-chip size="small" color="blue-grey-darken-1" label class="font-weight-medium">{{ item.descricao }}</v-chip>
                </template>

                <template #item.total="{ item }">
                  <span class="font-weight-black text-brown-darken-2 text-h6">{{ item.total }}</span>
                </template>

              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="showInfoDialog" max-width="600">
      <v-card rounded="xl" class="elevation-12">
        <v-card-title
          class="text-h5 font-weight-black bg-brown-darken-4 text-amber-lighten-3 d-flex justify-space-between align-center py-3"
        >
          <v-icon class="mr-2" size="30">mdi-information</v-icon>
          Informações Atuais de Compra
          <v-btn icon="mdi-close" variant="text" color="amber-lighten-3" @click="showInfoDialog = false" />
        </v-card-title>
        <v-card-text class="pt-4 pb-2">
          <div v-html="coffeeInfoText" class="text-body-1 text-medium-emphasis" />
        </v-card-text>
        <v-card-actions class="pt-0 pb-3">
          <v-spacer />
          <v-btn color="red-darken-1" variant="flat" @click="showInfoDialog = false" class="font-weight-bold rounded-lg">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="visible" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="text-h6 font-weight-bold bg-red-darken-1 text-white">
          <v-icon class="mr-2" size="24">mdi-alert-circle-outline</v-icon> Confirmação de Saída
        </v-card-title>
        <v-card-text class="pt-4 pb-2 text-body-1">
          Deseja realmente sair? Você será desconectado do sistema.
        </v-card-text>
        <v-card-actions class="pa-4 pt-2">
          <v-spacer />
          <v-btn variant="outlined" @click="cancelar" :disabled="carregando" class="font-weight-bold">Cancelar</v-btn>
          <v-btn color="red" @click="handleLogout" :loading="carregando" variant="flat" class="font-weight-bold">Sair</v-btn>
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

const formatarData = (isoDate) => {
    if (!isoDate) return 'N/A';
    
    
    const date = new Date(isoDate);

    
    const options = {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        
    };

    // Formata a data para DD/MM HH:mm
    return date.toLocaleString('pt-BR', options);
};

const loadingItemUpdate = reactive({
    cafe: false,
    filtro: false,
});

const quantidadeCafeDesejada = ref(0);
const quantidadeFiltroDesejada = ref(0);

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


watch(currentUserQueueItem, (newVal) => {
    if (newVal) {
        quantidadeCafeDesejada.value = newVal.cafe;
        quantidadeFiltroDesejada.value = newVal.filtro;
    } else {
        quantidadeCafeDesejada.value = 0;
        quantidadeFiltroDesejada.value = 0;
    }
}, { immediate: true, deep: true });


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

const filterUser = (itemTitle, queryText, item) => {
    const username = item.raw.email.split('@')[0].toLowerCase();
    const searchText = queryText.toLowerCase();
    return username.indexOf(searchText) > -1;
};

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

const incrementarQuantidadeLocal = (tipo, delta) => {
    if (tipo === 'cafe') {
        quantidadeCafeDesejada.value = Math.max(0, quantidadeCafeDesejada.value + delta);
    } else if (tipo === 'filtro') {
        quantidadeFiltroDesejada.value = Math.max(0, quantidadeFiltroDesejada.value + delta);
    }
};

const atualizarPedido = async (tipo, quantidadePadrao = null) => {
    if (!currentUser.value) return; 

    const quantidadeRef = tipo === 'cafe' ? quantidadeCafeDesejada : quantidadeFiltroDesejada;
    
   
    if (quantidadePadrao !== null) {
       
        quantidadeRef.value = quantidadePadrao; 
    }
    
   
    const novaQuantidade = quantidadeRef.value;
    
    const quantidadeAtualNaFila = currentUserQueueItem.value ? currentUserQueueItem.value[tipo] : 0;
    
    
    if (novaQuantidade === quantidadeAtualNaFila) {
        return; 
    }
    
    
    loadingItemUpdate[tipo] = true; 
    
    const quantidadeReverter = quantidadeAtualNaFila;

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
            if (res.data.reordenar || (novaQuantidade > 0 && quantidadeAtualNaFila === 0) || (novaQuantidade === 0 && quantidadeAtualNaFila > 0)) {
                 await fetchFila();
            }
        } else {
             await fetchFila();
        }

    } catch (e) {
        console.error("Erro ao atualizar a quantidade:", e);
        
        if (tipo === 'cafe') {
            quantidadeCafeDesejada.value = quantidadeReverter;
        } else if (tipo === 'filtro') {
            quantidadeFiltroDesejada.value = quantidadeReverter;
        }
        
        await fetchFila(); 

        alertType.value = "error";
        alertMessage.value = e.response?.data?.message || "Erro ao atualizar. Dados revertidos.";
    } finally {
        loadingItemUpdate[tipo] = false; 
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