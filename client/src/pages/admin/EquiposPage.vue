<template>
  <div class="content">
    <!-- Welcome Banner -->
    <div class="banner">
      <div>
        <h2>Panel de gestión</h2>
        <p>Administra tu catálogo de equipos, revisa el stock y responde consultas desde un solo lugar.</p>
      </div>
      <div class="quick-actions">
        <router-link to="/" class="btn btn-secondary banner-btn">
          <AppIcon name="language" size="16px" />
          Ver tienda
        </router-link>
        <button class="btn btn-primary banner-btn" @click="openCreateDialog">
          <AppIcon name="add" size="16px" />
          Agregar equipo
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total equipos</div>
        <div class="stat-value">{{ allRows.length }}</div>
        <div class="stat-delta">
          <AppIcon name="arrow_upward" size="14px" />
          Actualizado
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Stock bajo</div>
        <div class="stat-value">{{ lowStockCount }}</div>
        <div class="stat-delta down">
          <AppIcon name="arrow_downward" size="14px" />
          Requiere atención
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Valor inventario</div>
        <div class="stat-value mono">${{ totalValue.toLocaleString() }}</div>
        <div class="stat-delta">
          <AppIcon name="arrow_upward" size="14px" />
          En catálogo
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Categorías</div>
        <div class="stat-value">{{ categoriesCount }}</div>
        <div class="stat-delta">
          <AppIcon name="category" size="14px" />
          Activas
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="section-header-admin">
      <h2>Inventario de equipos</h2>
      <div class="flex items-center gap-3">
        <input class="input" v-model="tableSearch" placeholder="Buscar equipo…" type="text" style="width:240px;">
      </div>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th style="text-align:right;">Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th style="text-align:right;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredRows.length === 0 && !loading">
            <td colspan="6" class="text-center" style="padding:40px;color:var(--muted);">
              No se encontraron equipos
            </td>
          </tr>
          <tr v-for="row in pagedRows" :key="row.id">
            <td>
              <div class="table-product-cell">
                <img class="thumb-table" :src="row.imagen_url || 'https://placehold.co/80x80/e8effe/0052ff?text=PC'" alt="" loading="lazy" />
                <div>
                  <div class="product-name-cell">{{ row.modelo }}</div>
                  <div class="product-meta-cell">{{ row.marca }} · {{ row.procesador }}</div>
                </div>
              </div>
            </td>
            <td><span class="badge">{{ row.categoria_nombre }}</span></td>
            <td class="mono text-right" style="font-weight:700;font-size:15px;">${{ Number(row.precio).toLocaleString() }}</td>
            <td>
              <span :class="['stock-pill', row.stock > 5 ? 'stock-pill-high' : row.stock > 0 ? 'stock-pill-low' : 'stock-pill-out']">
                <span class="dot" />
                {{ row.stock }} uds
              </span>
            </td>
            <td>
              <span :class="['badge', row.condicion === 'refurbished' ? 'badge-warning' : 'badge-success']">
                {{ row.condicion === 'refurbished' ? 'Refurbished' : 'Nuevo' }}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <button class="action-btn" aria-label="Editar" title="Editar" @click="openEditDialog(row)">
                  <AppIcon name="edit" size="16px" />
                </button>
                <button class="action-btn delete" aria-label="Eliminar" title="Eliminar" @click="confirmDelete(row)">
                  <AppIcon name="delete" size="16px" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <span class="page-info">Mostrando {{ startRow }}–{{ endRow }} de {{ filteredRows.length }} equipos</span>
      <div class="page-btns">
        <button class="page-btn" :disabled="currentPage <= 1" @click="currentPage--">
          <AppIcon name="chevron_left" size="14px" />
        </button>
        <button
          v-for="p in displayPages"
          :key="p"
          :class="['page-btn', { active: currentPage === p }]"
          @click="currentPage = p"
        >
          {{ p }}
        </button>
        <button class="page-btn" :disabled="currentPage >= totalPages" @click="currentPage++">
          <AppIcon name="chevron_right" size="14px" />
        </button>
      </div>
    </div>

    <!-- FAB -->
    <button class="fab" aria-label="Agregar equipo" title="Agregar equipo" @click="openCreateDialog">
      <AppIcon name="add" size="22px" />
    </button>

    <!-- Dialog -->
    <Teleport to="body">
      <div class="dialog-overlay" v-if="dialogOpen" @click.self="dialogOpen = false">
        <div class="dialog-modal">
          <div class="dialog-bar">
            <AppIcon name="computer" size="20px" />
            <span>{{ isEditing ? 'Editar Equipo' : 'Nuevo Equipo' }}</span>
            <div style="flex:1;" />
            <button class="action-btn" style="color:#fff;border-color:rgba(255,255,255,0.3);" @click="dialogOpen = false">
              <AppIcon name="close" size="18px" />
            </button>
          </div>
          <div class="dialog-body">
            <form ref="formRef" @submit.prevent="handleSubmit">
              <div class="row q-col-gutter-md" style="display:flex;flex-wrap:wrap;gap:16px;">
                <div style="flex:1 1 calc(50% - 8px);min-width:200px;">
                  <label class="form-label form-label-sm">Marca *</label>
                  <input class="input" v-model="form.marca" required />
                </div>
                <div style="flex:1 1 calc(50% - 8px);min-width:200px;">
                  <label class="form-label form-label-sm">Modelo *</label>
                  <input class="input" v-model="form.modelo" required />
                </div>
                <div style="flex:1 1 calc(50% - 8px);min-width:200px;">
                  <label class="form-label form-label-sm">Procesador *</label>
                  <input class="input" v-model="form.procesador" required />
                </div>
                <div style="flex:1 1 calc(50% - 8px);min-width:200px;">
                  <label class="form-label form-label-sm">RAM *</label>
                  <input class="input" v-model="form.ram" required />
                </div>
                <div style="flex:1 1 calc(50% - 8px);min-width:200px;">
                  <label class="form-label form-label-sm">Almacenamiento *</label>
                  <input class="input" v-model="form.almacenamiento" required />
                </div>
                <div style="flex:1 1 calc(50% - 8px);min-width:200px;">
                  <label class="form-label form-label-sm">Tarjeta Gráfica</label>
                  <input class="input" v-model="form.tarjeta_grafica" />
                </div>
                <div style="flex:1 1 calc(50% - 8px);min-width:200px;">
                  <label class="form-label form-label-sm">Pantalla</label>
                  <input class="input" v-model="form.pantalla" placeholder="Ej: FHD 15.6&quot;" />
                </div>
                <div style="flex:1 1 100%;">
                  <label class="form-label form-label-sm">
                    <input type="checkbox" v-model="form.tactil" style="accent-color:var(--accent);margin-right:8px;width:16px;height:16px;" />
                    Táctil
                  </label>
                </div>
                <div style="flex:1 1 calc(33% - 11px);min-width:150px;">
                  <label class="form-label form-label-sm">Precio *</label>
                  <input class="input mono" v-model.number="form.precio" type="number" step="0.01" min="0" required />
                </div>
                <div style="flex:1 1 calc(33% - 11px);min-width:150px;">
                  <label class="form-label form-label-sm">Stock *</label>
                  <input class="input mono" v-model.number="form.stock" type="number" min="0" required />
                </div>
                <div style="flex:1 1 calc(33% - 11px);min-width:150px;">
                  <label class="form-label form-label-sm">Condición *</label>
                  <select class="input" v-model="form.condicion" required style="cursor:pointer;">
                    <option value="nuevo">Nuevo</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
                <div style="flex:1 1 calc(33% - 11px);min-width:150px;">
                  <label class="form-label form-label-sm">Categoría *</label>
                  <select class="input" v-model="form.categoria_id" required style="cursor:pointer;">
                    <option v-for="c in categoriaOptions" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                  </select>
                </div>
                <div style="flex:1 1 100%;">
                  <label class="form-label form-label-sm">URL de Imagen</label>
                  <input class="input" v-model="form.imagen_url" />
                </div>
                <div style="flex:1 1 100%;">
                  <label class="form-label form-label-sm">Descripción</label>
                  <textarea class="input" v-model="form.descripcion" rows="4" style="resize:vertical;"></textarea>
                </div>
              </div>
              <div class="flex justify-end q-mt-lg" style="display:flex;gap:10px;margin-top:24px;justify-content:flex-end;">
                <button type="button" class="btn btn-secondary" @click="dialogOpen = false">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="submitting">{{ isEditing ? 'Guardar Cambios' : 'Crear Equipo' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { getEquipos, createEquipo, updateEquipo, deleteEquipo } from '../../api/equipos'
import { getCategorias } from '../../api/categorias'

const $q = useQuasar()

const allRows = ref([])
const loading = ref(false)
const tableSearch = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const categoriaOptions = ref([])

const dialogOpen = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const editingId = ref(null)

const defaultForm = () => ({
  marca: '', modelo: '', procesador: '', ram: '', almacenamiento: '',
  tarjeta_grafica: '', precio: null, stock: 0, imagen_url: '', descripcion: '',
  condicion: 'nuevo', pantalla: '', tactil: false, categoria_id: null,
})

const form = ref(defaultForm())

const filteredRows = computed(() => {
  if (!tableSearch.value) return allRows.value
  const q = tableSearch.value.toLowerCase()
  return allRows.value.filter((r) =>
    Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / perPage.value)))
const startRow = computed(() => Math.min((currentPage.value - 1) * perPage.value + 1, filteredRows.value.length))
const endRow = computed(() => Math.min(currentPage.value * perPage.value, filteredRows.value.length))

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredRows.value.slice(start, start + perPage.value)
})

const displayPages = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  return pages.slice(Math.max(0, currentPage.value - 3), currentPage.value + 3)
})

const lowStockCount = computed(() => allRows.value.filter((r) => r.stock > 0 && r.stock <= 3).length)
const totalValue = computed(() => allRows.value.reduce((acc, r) => acc + Number(r.precio) * r.stock, 0))
const categoriesCount = computed(() => new Set(allRows.value.map((r) => r.categoria_id)).size)

async function loadEquipos() {
  loading.value = true
  try {
    const { data } = await getEquipos({ limit: 1000 })
    allRows.value = data.data || []
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Error al cargar equipos' })
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  dialogOpen.value = true
}

function openEditDialog(row) {
  isEditing.value = true
  editingId.value = row.id
  form.value = {
    marca: row.marca, modelo: row.modelo, procesador: row.procesador, ram: row.ram,
    almacenamiento: row.almacenamiento, tarjeta_grafica: row.tarjeta_grafica || '',
    precio: Number(row.precio), stock: row.stock, imagen_url: row.imagen_url || '',
    descripcion: row.descripcion || '', condicion: row.condicion || 'nuevo',
    pantalla: row.pantalla || '', tactil: row.tactil || false, categoria_id: row.categoria_id,
  }
  dialogOpen.value = true
}

async function handleSubmit() {
  submitting.value = true
  try {
    if (isEditing.value) {
      await updateEquipo(editingId.value, form.value)
      $q.notify({ type: 'positive', message: 'Equipo actualizado', icon: 'check_circle' })
    } else {
      await createEquipo(form.value)
      $q.notify({ type: 'positive', message: 'Equipo creado', icon: 'check_circle' })
    }
    dialogOpen.value = false
    loadEquipos()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.error || 'Error al guardar' })
  } finally {
    submitting.value = false
  }
}

function confirmDelete(row) {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Eliminar "${row.marca} ${row.modelo}"?`,
    cancel: { label: 'Cancelar', flat: true, color: 'grey' },
    ok: { label: 'Eliminar', color: 'negative', unelevated: true },
    persistent: true,
  }).onOk(async () => {
    try {
      await deleteEquipo(row.id)
      $q.notify({ type: 'positive', message: 'Equipo eliminado', icon: 'check_circle' })
      loadEquipos()
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Error al eliminar' })
    }
  })
}

onMounted(async () => {
  try {
    const { data } = await getCategorias()
    categoriaOptions.value = data
  } catch { /* */ }
  loadEquipos()
})
</script>

<style scoped>
.content { padding: 28px 32px; max-width: 1400px; }

.quick-actions { display: flex; gap: 10px; }
.banner-btn { font-size: 13px; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }

.section-header-admin {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px; flex-wrap: wrap; gap: 12px;
}
.section-header-admin h2 { font-size: 20px; font-weight: 700; margin: 0; color: var(--fg); }

.pagination {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 18px; flex-wrap: wrap; gap: 12px;
}
.page-info { font-size: 13px; color: var(--muted); }
.page-btns { display: flex; gap: 4px; }

.mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }

@media (max-width: 1024px) {
  .content { padding: 20px; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .stats-row { grid-template-columns: 1fr; }
}
</style>
