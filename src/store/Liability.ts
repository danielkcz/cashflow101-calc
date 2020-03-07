import { types, Instance, SnapshotIn } from 'mobx-state-tree'

let c = 0

export const Liability = types
  .model('Liability', {
    id: types.optional(types.identifier, () => `Liability_${c++}`),
    name: types.string,
    debt: types.optional(types.number, 0),
    payment: types.optional(types.number, 0),
  })
  .views(self => ({
    get cashFlow() {
      return self.payment
    },
  }))

export type TLiability = Instance<typeof Liability>
export type TLiabilityProps = SnapshotIn<typeof Liability>
