import { create } from 'zustand'

export const getRentalPrice = (days) => {
  const base = { 1: 30, 2: 60, 3: 80, 4: 100, 5: 120, 6: 140, 7: 160 }
  if (days <= 7) return base[days] || 0
  return 160 + (days - 7) * 20  // +20€ par jour au-delà de 7
}

export const useReservationStore = create((set) => ({
  deliveryType: null,
  deliveryAddress: '',
  startDate: null,
  startTime: '10:00',
  durationDays: null,
  endDate: null,
  rentalPrice: 0,
  paymentType: null,

  setDeliveryType: (type) => set({ deliveryType: type }),
  setDeliveryAddress: (address) => set({ deliveryAddress: address }),
  setStartDate: (date) => set({ startDate: date }),
  setStartTime: (time) => set({ startTime: time }),
  setDurationDays: (days) => {
    set((state) => {
      let endDate = null
      if (state.startDate && days) {
        endDate = new Date(state.startDate)
        endDate.setDate(endDate.getDate() + days - 1)
      }
      return { durationDays: days, rentalPrice: getRentalPrice(days), endDate }
    })
  },
  setPaymentType: (type) => set({ paymentType: type }),

  getTotalNow: () => {
    const s = useReservationStore.getState()
    if (s.paymentType === 'online') {
      return s.rentalPrice + (s.deliveryType === 'delivery' ? 10 : 0)
    }
    if (s.paymentType === 'onsite') {
      return s.deliveryType === 'delivery' ? 15 : 5
    }
    return 0
  },

  reset: () => set({
    deliveryType: null, startDate: null, startTime: '10:00',
    durationDays: null, endDate: null, rentalPrice: 0, paymentType: null,
  }),
}))
