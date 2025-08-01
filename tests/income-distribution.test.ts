import { describe, it, expect, beforeEach } from "vitest"

const mockContract = {
  admin: "ST1ADMIN123",
  balances: new Map(),
  propertySupply: new Map(),
  propertyIncome: new Map(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  registerProperty(caller: string, propertyId: number, totalSupply: number) {
    if (!this.isAdmin(caller)) return { error: 100 }
    if (totalSupply <= 0) return { error: 103 }
    if (this.propertySupply.has(propertyId)) return { error: 101 }
    this.propertySupply.set(propertyId, totalSupply)
    return { value: true }
  },

  setBalance(caller: string, propertyId: number, owner: string, amount: number) {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.balances.set(`${propertyId}-${owner}`, amount)
    return { value: true }
  },

  depositIncome(caller: string, propertyId: number, amount: number) {
    if (!this.isAdmin(caller)) return { error: 100 }
    const current = this.propertyIncome.get(propertyId) || 0
    this.propertyIncome.set(propertyId, current + amount)
    return { value: true }
  },

  claimIncome(caller: string, propertyId: number) {
    const supply = this.propertySupply.get(propertyId)
    if (!supply) return { error: 101 }

    const balance = this.balances.get(`${propertyId}-${caller}`) || 0
    if (balance <= 0) return { error: 102 }

    const totalIncome = this.propertyIncome.get(propertyId) || 0
    const claim = Math.floor((totalIncome * balance) / supply)
    this.propertyIncome.set(propertyId, totalIncome - claim)

    return { value: claim }
  },

  getClaimable(caller: string, propertyId: number) {
    const supply = this.propertySupply.get(propertyId)
    if (!supply) return { error: 101 }
    const balance = this.balances.get(`${propertyId}-${caller}`) || 0
    const totalIncome = this.propertyIncome.get(propertyId) || 0
    return { value: Math.floor((totalIncome * balance) / supply) }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },
}

describe("Income Distribution Contract", () => {
  beforeEach(() => {
    mockContract.admin = "ST1ADMIN123"
    mockContract.propertySupply = new Map()
    mockContract.propertyIncome = new Map()
    mockContract.balances = new Map()
  })

  it("registers a property", () => {
    const result = mockContract.registerProperty("ST1ADMIN123", 1, 10000)
    expect(result).toEqual({ value: true })
  })

  it("rejects non-admin property registration", () => {
    const result = mockContract.registerProperty("ST1USER999", 1, 10000)
    expect(result).toEqual({ error: 100 })
  })

  it("sets balance and deposits income", () => {
    mockContract.registerProperty("ST1ADMIN123", 1, 10000)
    const balanceResult = mockContract.setBalance("ST1ADMIN123", 1, "ST2INVESTOR456", 3000)
    const depositResult = mockContract.depositIncome("ST1ADMIN123", 1, 9000)
    expect(balanceResult).toEqual({ value: true })
    expect(depositResult).toEqual({ value: true })
  })

  it("calculates claimable income correctly", () => {
    mockContract.registerProperty("ST1ADMIN123", 1, 10000)
    mockContract.setBalance("ST1ADMIN123", 1, "ST2INVESTOR456", 2500)
    mockContract.depositIncome("ST1ADMIN123", 1, 10000)
    const claimable = mockContract.getClaimable("ST2INVESTOR456", 1)
    expect(claimable).toEqual({ value: 2500 })
  })

  it("claims income and reduces pool", () => {
    mockContract.registerProperty("ST1ADMIN123", 2, 5000)
    mockContract.setBalance("ST1ADMIN123", 2, "ST3HOLDER999", 1000)
    mockContract.depositIncome("ST1ADMIN123", 2, 5000)
    const claim = mockContract.claimIncome("ST3HOLDER999", 2)
    expect(claim).toEqual({ value: 1000 })

    const remaining = mockContract.propertyIncome.get(2)
    expect(remaining).toBe(4000)
  })

  it("transfers admin", () => {
    const result = mockContract.transferAdmin("ST1ADMIN123", "ST2NEWADMIN")
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe("ST2NEWADMIN")
  })
})
