import { types, Instance } from 'mobx-state-tree'
import { Liability } from './Liability'

export const LoanSize = 1000
export const LoanPayment = 100

export const Loan = Liability.named('Loan')
  .props({
    amount: types.optional(types.number, 0),
  })
  .views(self => ({
    get cashFlow() {
      return self.amount * LoanPayment
    },
  }))
  .actions(self => ({
    applyLoan(increment: number) {
      self.amount += increment
    },
    payLoan(decrement: number) {
      self.amount -= decrement
    },
  }))

export type TLoan = Instance<typeof Loan>
