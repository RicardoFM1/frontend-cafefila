<template>
  <div class="dashboard-container">


    <div class="header-controls">
      <h1>☕ Gestão de Fila</h1>
      
    </div>

    <p>Controle de pedidos em tempo real</p>

    <!-- BOTÕES DE TIPO DE CAFÉ -->
    <div class="filtro-botoes">
      <button 
        :class="{ ativo: tipoSelecionado === 'expresso' }"
        @click="tipoSelecionado = 'expresso'"
      >
        ☕ Café Expresso
      </button>

      <button 
        :class="{ ativo: tipoSelecionado === 'filtro' }"
        @click="tipoSelecionado = 'filtro'"
      >
        🔽 Café Filtro
      </button>
    </div>

    <!-- CARDS DE STATUS -->
    <div class="stats-wrapper">
      <div class="stat-card">
        <v-icon size="32">mdi-account-group</v-icon>
        Na fila
      </div>

      <div class="stat-card">
        <v-icon size="32">mdi-coffee</v-icon>
        Em Preparo
      </div>

      <div class="stat-card">
        <v-icon size="32">mdi-timer</v-icon>
        Tempo Médio
      </div>

      <div class="stat-card">
        <v-icon size="32">mdi-trending-up</v-icon>
        Hoje
      </div>
    </div>

    <!-- FILA SELECIONADA -->
    <div class="titulo-fila">
      <v-icon size="20" color="orange">mdi-alert-circle</v-icon>
      Fila {{ tipoSelecionado === 'expresso' ? 'Expresso' : 'Filtro' }}
    </div>

    <div class="fila-box">
      <div class="pedido-item">
        <div class="pedido-info">
          <strong>Maria Silva</strong>
          <small>Expresso Duplo</small>
        </div>

        <div class="pedido-status">
          <span class="tag-status">Preparando ☕</span>
          <span>2 min</span>
        </div>

        <div class="btn-actions">
          <button class="btn-ok">✔</button>
          <button class="btn-x">✖</button>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, reactive, computed } from 'vue'

/* DUAS FILAS */
const filas = reactive({
  expresso: [
    { id: 1, name: 'Maria Silva', coffee: 'Expresso Duplo', time: '2 min', status: 'preparing' },
  ],
  filtro: [
    { id: 1, name: 'João Santos', coffee: 'Café Coado', time: '3 min', status: 'waiting' },
  ]
})

/* FILA ATUAL (COMPATÍVEL COM O TEMPLATE) */
const tipoSelecionado = ref("expresso")

/* FILA ATUAL DINÂMICA */
const filaAtual = computed(() => filas[tipoSelecionado.value])

/* TEXTOS DOS STATUS */
const statusTexto = {
  preparing: "Preparando ☕",
  waiting: "Aguardando"
}

/* AÇÕES DOS BOTÕES */
const finalizarPedido = (id) => {
  filas[tipoSelecionado.value] =
    filas[tipoSelecionado.value].filter(o => o.id !== id)
}

const cancelarPedido = (id) => {
  filas[tipoSelecionado.value] =
    filas[tipoSelecionado.value].filter(o => o.id !== id)
}
</script>


<style scoped>
@import "../../views/dashboard/dashboard.css";
</style>
