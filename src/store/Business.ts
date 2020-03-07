import { types, Instance, destroy, SnapshotIn } from 'mobx-state-tree'

let c = 0

export const Business = types
  .model('Business', {
    id: types.optional(types.identifier, () => `Business_${c++}`),
    name: types.string,
    cost: types.optional(types.number, 0),
    downPay: types.optional(types.number, 0),
    cashFlow: types.optional(types.number, 0),
  })
  .views(self => ({
    get buyCost() {
      return self.downPay
    },
  }))
  .actions(self => ({
    sell() {
      destroy(self)
    },
  }))

export type TBusiness = Instance<typeof Business>
export type TBusinessProps = SnapshotIn<typeof Business>
