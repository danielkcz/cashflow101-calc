import { createPlayer } from './Player'
import * as faker from 'faker'
import { getSnapshot } from 'mobx-state-tree'

test('passiveIncome is 0 without assets', () => {
  const player = createPlayer(faker.random.alphaNumeric())
  expect(player.passiveIncome).toBe(0)
})

test('passiveIncome includes dividends from stock', () => {
  const player = createPlayer(faker.random.alphaNumeric())
  player.buyStock({
    name: faker.finance.currencyName(),
    amount: 3,
    dividends: 10,
  })
  expect(player.passiveIncome).toBe(30)
})

test('passiveIncome includes cashFlow from businesses', () => {
  const player = createPlayer(faker.random.alphaNumeric())
  player.buyBusiness({
    name: faker.company.companyName(),
    cashFlow: 500,
  })
  expect(player.passiveIncome).toBe(500)
})

test('totalIncome is passiveIncome with salary', () => {
  const player = createPlayer(faker.random.alphaNumeric())
  player.setSalary(500)
  player.buyBusiness({
    name: faker.company.companyName(),
    cashFlow: 500,
  })
  expect(player.totalIncome).toBe(1000)
})

test('totalExpense is sum of liabilities payment', () => {
  const player = createPlayer(faker.random.alphaNumeric(), { childPayment: 50 })
  player.addLiability({
    name: faker.lorem.word(),
    payment: 500,
  })
  expect(player.totalExpense).toBe(500)
  player.applyLoan(3)
  expect(player.totalExpense).toBe(800)
  player.bornChild()
  player.bornChild()
  expect(player.totalExpense).toBe(900)
})

test('paycheck is difference of totalIncome and totalExpense', () => {
  const player = createPlayer(faker.random.alphaNumeric(), { childPayment: 100 })
  player.setSalary(500)
  expect(player.paycheck).toBe(500)
  player.applyLoan(7)
  expect(player.paycheck).toBe(-200)
  player.buyBusiness({
    name: faker.company.companyName(),
    cashFlow: 600,
  })
  expect(player.paycheck).toBe(400)
  player.bornChild()
  expect(player.paycheck).toBe(300)
  player.repayLoan(3)
  expect(player.paycheck).toBe(600)
})

test('payday adds paycheck to savings', () => {
  const player = createPlayer(faker.random.alphaNumeric(), { savings: 100, salary: 500 })
  player.payday()
  expect(player.savings).toBe(600)
})

test('buyAsset subtracts from savings and adds asset to list', () => {
  const player = createPlayer(faker.random.alphaNumeric(), { savings: 500 })
  const stock = {
    name: faker.finance.currencyName(),
    cost: 10,
    amount: 5,
  }
  player.buyStock(stock)
  expect(player.assets.size).toBe(1)
  expect(player.savings).toBe(450)
})

test('buyStock guards if there is enough savings', () => {
  const player = createPlayer(faker.random.alphaNumeric(), { savings: 10 })
  const stock = {
    name: faker.finance.currencyName(),
    cost: 10,
    amount: 3,
    dividends: 10,
  }
  player.buyStock(stock)
  expect(player.assets.size).toBe(0)
  expect(player.savings).toBe(10)
})

test('buyBusiness guards if there is enough savings', () => {
  const player = createPlayer(faker.random.alphaNumeric(), { savings: 10 })
  const stock = {
    name: faker.finance.currencyName(),
    cost: 10,
    amount: 3,
    dividends: 10,
  }
  player.buyStock(stock)
  expect(player.assets.size).toBe(0)
  expect(player.savings).toBe(10)
})

test('buyDoodad applies for loan with lack of savings', () => {
  const player = createPlayer(faker.random.alphaNumeric(), { savings: 100 })
  player.buyDoodad(1600)
  expect(player.bankLoan.amount).toBe(2)
  expect(player.savings).toBe(500)
})
