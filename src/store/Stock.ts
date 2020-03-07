import { types, Instance, SnapshotIn, destroy } from 'mobx-state-tree'

let c = 0

export const Stock = types
  .model('Stock', {
    id: types.optional(types.identifier, () => `Stock_${c++}`),
    name: types.string,
    cost: types.optional(types.number, 0),
    amount: types.optional(types.number, 0),
    dividends: types.optional(types.number, 0),
  })
  .views(self => ({
    get buyCost() {
      return self.amount * self.cost
    },
    get cashFlow() {
      return self.amount * self.dividends
    },
  }))
  .actions(self => ({
    sell(amount: number) {
      self.amount -= amount
      if (self.amount === 0) {
        destroy(self)
      }
    },
  }))

export type TStock = Instance<typeof Stock>
export type TStockProps = SnapshotIn<typeof Stock>
