<template>
  <div class="dashboard-container">

    <div class="header-controls">
      <h1>☕ Gestão de Fila</h1>
    </div>

    <p>Controle de pedidos em tempo real</p>

    <!-- BOTÕES PARA ADICIONAR ITENS -->
    <div class="filtro-botoes">

      <div class="tipo-card" @click="adicionarItem('Expresso')">
        <v-img src="/public/image.png" height="90" width="90" cover />
        <button>☕ Café Expresso</button>
      </div>

      <div class="tipo-card" @click="adicionarItem('Filtro')">
        <v-img src="/public/image-copy.png" height="90" width="90" cover />
        <button>🔽 Café Filtro</button>
      </div>

    </div>

    <!-- PEDIDO DO CLIENTE ATUAL -->
    <div v-if="clienteAtual" class="fila-box">

      <h3 style="color:#4b2e19; margin-bottom:10px">
        Novo Pedido – {{ clienteAtual.name }}
      </h3>

      <div 
        v-for="(p, i) in clienteAtual.pedidos" 
        :key="i"
        class="pedido-item"
      >
        <div class="pedido-info">
          <strong>{{ p.tipo }}</strong>
          <small>{{ p.qtd }}x</small>
        </div>

        <div class="btn-actions">

          <button class="btn-ok" @click="incrementar(i)">＋</button>

          <button class="btn-x" @click="decrementar(i)">－</button>

        </div>
      </div>

      <!-- BOTÃO DE CONCLUIR -->
      <button 
        class="btn-ok" 
        style="margin-top:15px;width:100%" 
        @click="concluirPedido"
      >
        ✔ Concluir Pedido
      </button>

    </div>

    <!-- LISTA DA FILA -->
    <div class="titulo-fila">
      <v-icon size="20" color="orange">mdi-alert-circle</v-icon>
      Fila Única
    </div>

    <div class="fila-box">
      <div 
        v-for="p in fila" 
        :key="p.id"
        class="pedido-item"
      >
        <div>
          <strong>{{ p.name }}</strong>

          <small style="display:block; color:#555">
            {{ formatarPedidos(p.pedidos) }}
          </small>
        </div>

        <div class="btn-actions">
          <button class="btn-ok" @click="finalizarPedido(p.id)">✔</button>
          <button class="btn-x" @click="cancelarPedido(p.id)">✖</button>
        </div>
      </div>
    </div>

  </div>
</template>



<script setup>
import { ref, reactive } from 'vue'

/* FILA FINAL */
const fila = reactive([])

/* CLIENTE TEMPORÁRIO (montando pedido antes de enviar p/ fila) */
const clienteAtual = ref(null)

/* CONTADOR DE IDs */
let nextId = 1

/* ADICIONAR ITEM */
const adicionarItem = (tipo) => {

  // Impede escolher filtro antes de expresso
  if (tipo === "Filtro" && (!clienteAtual.value || !clienteAtual.value.pedidos.some(p => p.tipo === "Expresso"))) {
    alert("Você precisa escolher pelo menos um Café Expresso antes!")
    return
  }

  // Criar cliente se ainda não existir
  if (!clienteAtual.value) {
    clienteAtual.value = {
      id: nextId,
      name: "Cliente " + nextId,
      pedidos: [] // [{ tipo, qtd }]
    }
  }

  // Verifica se produto já existe
  const existente = clienteAtual.value.pedidos.find(p => p.tipo === tipo)

  if (existente) {
    existente.qtd++
  } else {
    clienteAtual.value.pedidos.push({ tipo, qtd: 1 })
  }
}

/* AUMENTAR quantidade */
const incrementar = (index) => {
  clienteAtual.value.pedidos[index].qtd++
}

/* DIMINUIR quantidade */
const decrementar = (index) => {
  const item = clienteAtual.value.pedidos[index]

  if (item.qtd > 1) {
    item.qtd--
  } else {
    clienteAtual.value.pedidos.splice(index, 1)
  }

  // se apagou tudo → reset cliente
  if (clienteAtual.value.pedidos.length === 0) {
    clienteAtual.value = null
  }
}

const concluirPedido = () => {

  if (!clienteAtual.value || clienteAtual.value.pedidos.length === 0) {
    alert("Adicione algo ao pedido antes!")
    return
  }

  fila.push({
    id: clienteAtual.value.id,
    name: clienteAtual.value.name,
    pedidos: JSON.parse(JSON.stringify(clienteAtual.value.pedidos))
  })

  nextId++
  clienteAtual.value = null
}


/* REMOVER DA FILA */
const finalizarPedido = (id) => {
  const index = fila.findIndex(p => p.id === id)
  if (index !== -1) fila.splice(index, 1)
}

const cancelarPedido = (id) => {
  const index = fila.findIndex(p => p.id === id)
  if (index !== -1) fila.splice(index, 1)
}

/* FORMATA LISTA NA FILA */
const formatarPedidos = (lista) => {
  return lista.map(i => `${i.tipo} x${i.qtd}`).join(', ')
}

</script>





<style>
@import "../../views/dashboard/dashboard.css";
</style>