import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as equiposApi from '../api/equipos'

export const useEquiposStore = defineStore('equipos', () => {
  const equipos = ref([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(12)
  const totalPages = ref(1)
  const loading = ref(false)
  const error = ref(null)

  async function fetchEquipos(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await equiposApi.getEquipos({ page: page.value, limit: limit.value, ...params })
      equipos.value = data.data || []
      total.value = data.total
      totalPages.value = data.totalPages
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar equipos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchEquipo(id) {
    const { data } = await equiposApi.getEquipo(id)
    return data
  }

  async function createEquipo(data) {
    const { data: created } = await equiposApi.createEquipo(data)
    return created
  }

  async function updateEquipo(id, data) {
    const { data: updated } = await equiposApi.updateEquipo(id, data)
    return updated
  }

  async function deleteEquipo(id) {
    await equiposApi.deleteEquipo(id)
  }

  return {
    equipos,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    fetchEquipos,
    fetchEquipo,
    createEquipo,
    updateEquipo,
    deleteEquipo,
  }
})
