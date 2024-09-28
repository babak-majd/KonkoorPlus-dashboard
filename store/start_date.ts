import { defineStore } from 'pinia'

export const useStartDate = defineStore('start_date', () => {
  const start_date = useCookie('start_date', { maxAge: 60 * 60 * 24 * 30 })

  function setStartDate(date: string) {
    start_date.value = date
  }

  function getStartDate() {
    return start_date.value
  }

  return {
    setStartDate,
    getStartDate,
  }
})
