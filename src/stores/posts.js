import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const usePostsStore = defineStore('counter', () => {
  let contacts = reactive([])

  return { contacts }
})
