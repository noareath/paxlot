# Paxlot

**Decentralized Real Estate Tokenization & Ownership Protocol**

A blockchain-based platform for tokenizing real-world real estate assets, enabling fractional ownership, global investment access, and automated income distribution through smart contracts.

---

## **Overview**

Paxlot consists of multiple Clarity smart contracts working together to represent real estate assets on-chain, facilitate trustless transactions, and distribute rental yields to fractional owners. This protocol removes intermediaries, adds liquidity, and democratizes global real estate access.

**Core Modules (Smart Contracts)**

1. **Registry Contract** – Property/NFT ownership and metadata mapping
2. **Tokenization Contract** – Mints fractional tokens for properties
3. **Escrow Contract** – Handles purchases and transfers via secure escrow
4. **Income Distribution Contract** – Distributes rent yield to token holders
5. **SPV Governance Contract** – Manages real-world legal entity control
6. **Marketplace Contract** – Enables token trading between users
7. **Compliance & Whitelist Contract** – KYC/AML access control
8. **Appraisal & Valuation Contract** – Links valuation oracles to properties
9. **Dispute Resolution Contract** – Handles property-related conflicts
10. **Maintenance Reserve Contract** – Manages pooled reserve funds for property upkeep

---

## **Features**

- **Fractional Ownership of Real Assets**
- **On-chain Property Registry**
- **Rental Yield Distribution**
- **Regulatory-Compliant Token Gatekeeping**
- **Decentralized Trading Marketplace**
- **Smart Governance of SPVs**
- **Maintenance Reserve Automation**
- **Valuation-Backed Pricing**

---

## **Smart Contracts**

### **Registry Contract**
- Maps each real-world asset to an on-chain NFT
- Links metadata, SPV, and legal identifiers
- Ensures unique registration and ownership history

### **Tokenization Contract**
- Converts property NFTs into fractional fungible tokens
- Tracks supply and fractional share ownership
- Integrates with compliance controls

### **Escrow Contract**
- Facilitates secure buying/selling of fractional shares
- Enforces buyer/seller agreement terms
- Optional timelocks and payment conditions

### **Income Distribution Contract**
- Collects rental income
- Distributes STX or stablecoins to token holders
- Supports programmable yield triggers

### **SPV Governance Contract**
- Ties each property token to a legal SPV
- Enables token-based governance voting for decisions
- Supports upgrades and multi-sig approvals

### **Marketplace Contract**
- Peer-to-peer trading of fractional tokens
- Price discovery and bid-ask logic
- Supports both auctions and fixed-price sales

### **Compliance & Whitelist Contract**
- KYC verification and jurisdiction gating
- Role-based access control to investments
- Revocation and blacklisting capabilities

### **Appraisal & Valuation Contract**
- Interfaces with trusted valuation oracles
- Tracks latest appraised values
- Adjusts token pricing, insurance, and dispute inputs

### **Dispute Resolution Contract**
- Mediation between token holders, tenants, and SPVs
- Arbitrated settlement mechanisms
- Penalty enforcements for breaches

### **Maintenance Reserve Contract**
- Automated deductions from income for upkeep
- Tracks and releases funds for verified maintenance
- Supports budgeting and vote-based expenditures

---

## **Installation**

1. Install [Clarinet CLI](https://docs.stacks.co/clarity/clarinet-cli)
2. Clone this repository  
   ```bash
   git clone https://github.com/your-org/paxlot
   cd paxlot
   ```
3. Run tests
    ```bash
    npm test
    ```
4. Deploy contracts
    ```bash
    clarinet deploy
    ```

## **Usage**

Each smart contract serves a dedicated function in the Paxlot ecosystem. Developers and integrators can interact with these modules via exposed public functions or integrate them into DApps and dashboards.

Refer to each contract’s README.md and Clarinet tests for specific instructions.

## **Testing**

Tests are written using Clarinet’s native testing suite and can be run with:
```bash
npm test
```

## **License**

MIT License

