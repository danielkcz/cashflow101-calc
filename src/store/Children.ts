import { types, Instance } from 'mobx-state-tree'
import { Liability } from './Liability'

export const Children = Liability.named('Children')
  .props({
    amount: types.optional(types.number, 0),
    childPayment: types.optional(types.number, 0),
  })
  .views(self => ({
    get cashFlow() {
      return self.amount * self.childPayment
    },
  }))
  .actions(self => ({
    born(amount: number = 1) {
      self.amount += amount
    },
  }))

export type TChildren = Instance<typeof Children>
