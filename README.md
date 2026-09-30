# 🍯 HoneyChain

### Blockchain-Based Honey Traceability & Smart Beekeeping System

> **From Hive to Consumer — Transparent, Traceable and Data-Driven Honey**

HoneyChain is a blockchain-based honey traceability and smart beekeeping platform designed to improve honey authenticity, supply-chain transparency, hive monitoring, and consumer trust.

The system combines **IoT, Artificial Intelligence, Blockchain, IPFS, Oracle services, REST APIs, PostgreSQL and QR-code authentication** into a unified framework connecting the journey of honey from the **beehive to the consumer**.

---

## 📌 Problem Statement

The honey industry faces several challenges:

- Counterfeit and adulterated honey
- Limited visibility into the origin of honey
- Fragmented supply-chain records
- Manual record keeping
- Limited monitoring of hive conditions
- Delayed detection of abnormal hive conditions
- Lack of transparent quality and certification records
- Difficulty for consumers to verify product history
- Limited access to data-driven decision support for beekeepers

---

## 💡 Our Solution

HoneyChain creates a **digital identity for honey batches** and connects that identity with information generated throughout the product lifecycle.

```text
SMART HIVE
    ↓
IoT MONITORING
    ↓
AI ANALYSIS
    ↓
HARVEST
    ↓
DIGITAL HONEY BATCH
    ↓
PROCESSING
    ↓
QUALITY TESTING
    ↓
CERTIFICATION
    ↓
BLOCKCHAIN TRACEABILITY
    ↓
DISTRIBUTION
    ↓
RETAIL
    ↓
QR VERIFICATION
    ↓
CONSUMER
```

> **The history of honey should begin at the hive and remain connected to the product until it reaches the consumer.**

---

## ✨ Key Features

### 🐝 Smart Hive Monitoring
IoT sensors can collect hive-related parameters such as temperature, humidity, weight and other environmental conditions.

### 🤖 AI-Based Analytics
Machine learning can support colony health monitoring, anomaly detection, productivity analysis and early-warning alerts.

### ⛓️ Blockchain Traceability
Critical supply-chain events are recorded on blockchain to provide tamper-evident provenance and verification.

### 📦 Digital Honey Batch
Each harvested honey lot receives a unique digital identity connected to its origin, processing, quality, certification and supply-chain history.

### 📁 IPFS Document Storage
Large supporting files such as laboratory reports, certificates, inspection documents and images can be stored off-chain using IPFS.

### 🔗 Oracle Integration
An oracle provides a controlled bridge between external systems/data and blockchain smart contracts.

### 📱 QR Consumer Verification
Consumers can scan a QR code to access the verified digital history of a honey batch.

---

## 🏗️ System Architecture

```text
                    ┌───────────────────────┐
                    │      SMART HIVE       │
                    │  IoT Sensors/Devices  │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   IoT Communication   │
                    │     MQTT / REST       │
                    └───────────┬───────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │          BACKEND API             │
              │       NestJS / TypeScript       │
              └───────────────┬─────────────────┘
                              │
             ┌────────────────┼─────────────────┐
             │                │                 │
             ▼                ▼                 ▼
      ┌────────────┐   ┌─────────────┐   ┌─────────────┐
      │ PostgreSQL │   │ AI / ML     │   │    IPFS     │
      │  Database  │   │ Analytics   │   │  Documents  │
      └────────────┘   └─────────────┘   └─────────────┘
             │                │                 │
             └────────────────┼─────────────────┘
                              │
                              ▼
                    ┌───────────────────────┐
                    │       ORACLE          │
                    │ External Data Bridge  │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │       BLOCKCHAIN       │
                    │   Solidity Contracts   │
                    │   Polygon Amoy Testnet │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     QR VERIFICATION   │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │       CONSUMER        │
                    └───────────────────────┘
```

---

## 🔄 Complete Workflow

```text
Hive Registration
      ↓
IoT Monitoring
      ↓
AI Analysis
      ↓
Honey Harvest
      ↓
Digital Batch Creation
      ↓
Processing
      ↓
Quality Testing
      ↓
Certification
      ↓
Blockchain Recording
      ↓
Supply-Chain Transfers
      ↓
QR Generation
      ↓
Consumer Verification
```

---

## ⛓️ Blockchain Layer

**Prototype Network:** Polygon Amoy Testnet  
**Smart Contracts:** Solidity  
**Development:** Hardhat  
**Blockchain Client:** ethers.js

Critical events can include:

- Batch creation
- Harvest recording
- Processing events
- Quality/certification references
- Ownership transfers
- Verification records
- IPFS document references

HoneyChain uses blockchain selectively rather than storing every sensor reading on-chain.

---

## 📡 IoT & Smart Hive

Possible monitored parameters include:

```text
Temperature
Humidity
Hive Weight
Acoustic Information
Environmental Conditions
```

Data flow:

```text
Sensors
   ↓
Microcontroller / Gateway
   ↓
MQTT / REST
   ↓
Backend API
   ↓
Database
   ↓
AI Analytics
```

---

## 🤖 AI & Machine Learning

A proposed model for structured hive-data classification is **Random Forest**.

Example input features:

```text
temperature
humidity
hive_weight
weight_change
time_of_day
historical_sensor_values
```

Example outputs:

```text
Normal
Warning
Anomalous
```

AI is intended as decision support and not as a replacement for professional beekeeping or laboratory diagnosis.

---

## 📁 IPFS

Large supporting documents can be stored using IPFS.

```text
Document
   ↓
IPFS
   ↓
CID
   ↓
Blockchain / Database Reference
```

This avoids putting entire files directly on blockchain and helps reduce storage requirements.

---

## 🔗 Oracle

The oracle layer provides a bridge between external systems and blockchain:

```text
External System
      ↓
Oracle
      ↓
Smart Contract
      ↓
Blockchain
```

Potential uses include selected IoT-derived events, verified quality information and external verification services.

---

## 📱 QR Code Verification

A QR code connects the physical product to its digital batch identity.

```text
Consumer
   ↓
QR Scan
   ↓
Batch ID / Verification URL
   ↓
Backend API
   ↓
Database + Blockchain + IPFS
   ↓
Traceability Page
```

The QR code does not need to contain the complete supply-chain history; it acts as the connection to the digital record.

---

## 🚚 Supply Chain

```text
BEEKEEPER
    ↓
PROCESSOR
    ↓
DISTRIBUTOR
    ↓
RETAILER
    ↓
CONSUMER
```

Transfers can validate the sender, receiver, batch, quantity, ownership, status, authorization and timestamp.

---

## 🔐 Backend Architecture

Proposed backend stack:

```text
NestJS
TypeScript
PostgreSQL
Prisma
JWT
Argon2 / bcrypt
Swagger / OpenAPI
Redis / BullMQ
```

Architecture:

```text
Frontend
   ↓
REST API
   ↓
Controllers
   ↓
Services
   ↓
Database / Blockchain / IPFS / AI
```

---

## 🗄️ Database

Potential entities include:

```text
User
Role
Apiary
Hive
Sensor
SensorReading
AIAnalysis
Alert
Harvest
HoneyBatch
BatchDocument
ProcessingRecord
QualityTest
Certification
SupplyChainEvent
Product
QRCode
BlockchainTransaction
IPFSFile
OracleData
Notification
AuditLog
```

---

## 🔐 Security

HoneyChain follows a layered security approach:

- JWT authentication
- Role-based access control
- Input validation
- HTTPS-ready APIs
- CORS configuration
- Security headers
- Rate limiting
- Secure password hashing
- Environment-based secrets
- File validation
- Audit logging
- Blockchain transaction verification
- Idempotent operations

### User Roles

```text
SUPER_ADMIN
ADMIN
BEEKEEPER
PROCESSOR
DISTRIBUTOR
RETAILER
INSPECTOR
CONSUMER
```

---

## 📂 Recommended Project Structure

```text
HoneyChain/
│
├── frontend/
├── backend/
├── blockchain/
├── ml/
├── iot/
├── docs/
├── docker-compose.yml
└── README.md
```

A more detailed structure can be organized as:

```text
backend/src/
├── auth/
├── users/
├── apiaries/
├── hives/
├── sensors/
├── harvest/
├── batches/
├── supply-chain/
├── blockchain/
├── ipfs/
├── oracle/
└── ai/
```

---

## ⚙️ Installation

### Prerequisites

```text
Node.js
npm
Git
PostgreSQL
Python
Docker
```

For blockchain development:

```text
Hardhat
Solidity
Polygon Amoy RPC
Wallet
```

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/HoneyChain.git
cd HoneyChain
```

### Install Backend

```bash
cd backend
npm install
```

### Install Frontend

```bash
cd ../frontend
npm install
```

### Install ML Dependencies

```bash
cd ../ml
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/honeychain

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

POLYGON_RPC_URL=your_polygon_amoy_rpc_url

BLOCKCHAIN_PRIVATE_KEY=your_private_key

CONTRACT_ADDRESS=your_deployed_contract_address

IPFS_API_URL=your_ipfs_api_url

IPFS_GATEWAY_URL=your_ipfs_gateway_url

ORACLE_API_URL=your_oracle_api_url
```

Never commit private keys, passwords or API keys to GitHub.

---

## ▶️ Running the Project

### Backend

```bash
cd backend
npm run start:dev
```

### Frontend

```bash
cd frontend
npm run dev
```

### Blockchain

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat test
```

Deployment example:

```bash
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

---

## 🔌 API Overview

Example API structure:

```text
/api/v1/auth
/api/v1/users
/api/v1/apiaries
/api/v1/hives
/api/v1/sensors
/api/v1/harvests
/api/v1/batches
/api/v1/processing
/api/v1/quality
/api/v1/supply-chain
/api/v1/blockchain
/api/v1/ipfs
/api/v1/oracle
/api/v1/qr
/api/v1/analytics
```

Example verification endpoint:

```http
GET /api/v1/verify/:batchId
```

---

## 📦 Batch Lifecycle

```text
CREATED
   ↓
HARVESTED
   ↓
PROCESSING
   ↓
QUALITY_CHECK
   ↓
CERTIFIED
   ↓
PACKAGED
   ↓
IN_TRANSIT
   ↓
DISTRIBUTED
   ↓
RETAIL
   ↓
SOLD
```

Invalid state transitions should be rejected.

---

## 📈 Scalability

HoneyChain follows a **hybrid architecture**.

High-volume data remains off-chain:

```text
IoT Data
AI Data
Application Data
Large Documents
```

Critical traceability events are recorded on-chain:

```text
Batch Creation
Important Supply-Chain Events
Ownership Changes
Verification Records
Document References
```

Therefore, increasing the number of hives primarily increases database, API and analytics workloads rather than requiring every sensor reading to become a blockchain transaction.

The system can scale through:

- Horizontal API scaling
- Database indexing
- Redis caching
- Background queues
- Load balancing
- IPFS/object storage
- Containerized deployment
- Separate AI inference services

---

## 💰 Economic Feasibility

HoneyChain minimizes unnecessary blockchain costs through its hybrid design:

```text
High-volume data  → Database
Large documents   → IPFS
AI processing     → ML Service
Critical events   → Blockchain
Consumer access   → QR
```

This reduces unnecessary blockchain storage and transaction requirements while retaining verifiable traceability for important events.

QR codes and smartphone-based verification also provide a low-cost consumer interface.

---

## 🔬 Research Foundation

HoneyChain builds upon research in:

- Honey authenticity and laboratory analysis
- Precision apiculture
- IoT-based beehive monitoring
- Machine learning for hive monitoring
- Blockchain-based agricultural traceability
- Decentralized document storage
- Smart beehive architecture

### Research Gap

Existing research generally addresses IoT monitoring, AI analytics, honey authenticity, blockchain traceability and consumer verification as separate areas.

HoneyChain integrates these technologies into a unified framework connecting:

```text
Hive
 ↓
IoT
 ↓
AI
 ↓
Harvest
 ↓
Honey Batch
 ↓
Quality
 ↓
Blockchain
 ↓
Supply Chain
 ↓
QR
 ↓
Consumer
```

The contribution is primarily the **integration and application of these technologies to end-to-end honey traceability and smart beekeeping**.

---

## 🧪 Testing Strategy

HoneyChain can be validated through:

```text
Unit Testing
      ↓
API Testing
      ↓
Database Testing
      ↓
Smart Contract Testing
      ↓
Integration Testing
      ↓
QR Verification Testing
      ↓
End-to-End Testing
```

A complete test flow should cover:

```text
Beekeeper Registration
        ↓
Hive Registration
        ↓
IoT Data
        ↓
AI Analysis
        ↓
Harvest
        ↓
Batch Creation
        ↓
IPFS Document
        ↓
Blockchain Record
        ↓
Processing
        ↓
Quality Verification
        ↓
Supply Chain Transfer
        ↓
QR Generation
        ↓
Consumer Verification
```

---

## ⚠️ Limitations

### Blockchain
Blockchain makes recorded information tamper-evident but does not automatically guarantee that the original physical information was truthful.

### Honey Authenticity
Chemical authenticity still requires appropriate laboratory testing.

### AI
AI predictions depend on the quality, quantity and representativeness of training data.

### IoT
Sensor accuracy, connectivity and hardware reliability affect collected data.

### Prototype Environment
A testnet prototype does not represent all operating conditions of a production-scale national deployment.

---

## 🚀 Future Scope

- Real-world IoT hardware deployment
- Larger and geographically diverse datasets
- Improved ML models
- Computer-vision-based bee monitoring
- Edge AI
- Automated disease/anomaly detection
- Mobile application
- Multi-language consumer verification
- Laboratory-system integration
- Government certification integration
- Advanced analytics dashboards
- Production blockchain deployment
- Multi-region supply-chain deployment
- Extension to additional agricultural products

---

## 📚 References

```text
[1] Tsagkaris, A. S. et al. (2021). Honey authenticity: analytical techniques, state of the art and challenges. RSC Advances, 11, 11273–11294.

[2] Henry, M. et al. (2019). Precision apiculture: Development of a wireless sensor network for honeybee hives. Computers and Electronics in Agriculture, 156, 138–144.

[3] Tashakkori, R., Hamza, A. B. & Crawford, J. (2021). Beemon: An IoT-based beehive monitoring system. Computers and Electronics in Agriculture, 190, 106427.

[4] Salah, K. et al. (2019). Blockchain-Based Soybean Traceability in Agricultural Supply Chain. IEEE Access, 7, 73295–73305.

[5] Kamble, S. S., Gunasekaran, A. & Sharma, R. (2020). Modeling the blockchain enabled traceability in agriculture supply chain. International Journal of Information Management, 52, 101967.

[6] Hadjur, H., Ammar, D. & Lefèvre, L. (2022). Toward an intelligent and efficient beehive: A survey of precision beekeeping systems and services. Computers and Electronics in Agriculture, 192, 106604.

[7] Aydin, A. & Aydin, M. (2022). Design and implementation of a smart beehive and its monitoring system using microservices in the context of IoT and open data. Computers and Electronics in Agriculture, 196, 106897.

[8] Bilik, S. et al. (2024). Machine learning and computer vision techniques in continuous beehive monitoring applications: A survey. Computers and Electronics in Agriculture, 217, 108560.
```

---

## 👥 Contributors

**HoneyChain Team — SIH 2026**

**Domain:** Agriculture / Blockchain / IoT / AI  
**Focus:** Honey Traceability & Smart Beekeeping

---

## 📜 License

This project is developed as a prototype for **Smart India Hackathon 2026**.

Add an appropriate open-source license if the repository is intended for public reuse.

---

# 🍯 HoneyChain

### **Smart Hive → Intelligent Monitoring → Digital Batch → Blockchain Traceability → QR Verification → Consumer Trust**

> **From Hive to Consumer, Every Batch Has a Story.**
