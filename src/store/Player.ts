import { types, Instance, SnapshotIn } from 'mobx-state-tree'
import { Liability, TLiability, TLiabilityProps } from './Liability'
import { Stock, TStock, TStockProps } from './Stock'
import { Business, TBusiness, TBusinessProps } from './Business'
import R from 'ramda'
import { Loan, LoanSize } from './Loan'
import { Children } from './Children'

type TAsset = TStock | TBusiness

export const Player = types
  .model('Player', {
    name: types.string,
    salary: types.optional(types.number, 0),
    savings: types.optional(types.number, 0),
    bankLoan: types.reference(Loan),
    children: types.reference(Children),
    assets: types.optional(types.map(types.union(Stock, Business)), {}),
    liabilities: types.optional(types.map(types.union(Liability, Loan, Children)), {}),
  })
  .views(self => ({
    get passiveIncome() {
      return R.sum(Array.from(self.assets.values()).map(R.prop('cashFlow')))
    },
    get totalIncome() {
      return self.salary + this.passiveIncome
    },
    get totalExpense() {
      return R.sum(Array.from(self.liabilities.values()).map(R.prop('cashFlow')))
    },
    get paycheck() {
      return this.totalIncome - this.totalExpense
    },
    canBuy(cost: number) {
      return self.savings >= cost
    },
  }))
  .actions(self => ({
    setSalary(salary: number) {
      self.salary = salary
    },
    applyLoan(thousands: number) {
      self.bankLoan.applyLoan(thousands)
      self.savings += thousands * LoanSize
    },
    repayLoan(thousands: number) {
      self.bankLoan.payLoan(thousands)
      self.savings -= thousands * LoanSize
    },
    addLiability(liability: TLiabilityProps) {
      self.liabilities.put(Liability.create(liability))
    },
    buyDoodad(cost: number) {
      if (!self.canBuy(cost)) {
        this.applyLoan(Math.ceil((cost - self.savings) / LoanSize))
      }
      self.savings -= cost
    },
    buyAsset(asset: TAsset) {
      if (self.canBuy(asset.buyCost)) {
        self.savings -= asset.buyCost
        self.assets.put(asset)
      }
    },
    buyStock(stockProps: TStockProps) {
      this.buyAsset(Stock.create(stockProps))
    },
    sellStock(stockId: string, amount: number) {
      ;(self.assets.get(stockId) as TStock)?.sell(amount)
    },
    buyBusiness(business: TBusinessProps) {
      this.buyAsset(Business.create(business))
    },
    sellBusiness(businessId: string) {
      ;(self.assets.get(businessId) as TBusiness)?.sell()
    },
    bornChild() {
      self.children.born()
    },
    payday() {
      self.savings += self.paycheck
    },
  }))

export type TPlayer = Instance<typeof Player>
export type TPlayerProps = SnapshotIn<typeof Player>

type TCreatePlayerOptions = {
  salary: number
  savings: number
  childPayment: number
}

export function createPlayer(
  name: string,
  { salary, savings, childPayment }: Partial<TCreatePlayerOptions> = {},
) {
  const player = Player.create({
    name,
    salary,
    savings,
    bankLoan: 'BankLoan',
    children: 'Children',
    liabilities: {
      BankLoan: Loan.create({
        id: 'BankLoan',
        name: 'Loan',
      }),
      Children: Children.create({
        id: 'Children',
        name: 'Children',
        childPayment,
      }),
    },
  })
  return player
}
