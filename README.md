# 🏦 Banking QA Automation Framework

[![Banking QA Automation CI](https://github.com/EFxFLICK/Banking-QA-Automation/actions/workflows/ci.yml/badge.svg)](https://github.com/EFxFLICK/Banking-QA-Automation/actions/workflows/ci.yml)

> **37 automated tests | UI + REST API + Database + Integration | Docker | Allure | GitHub Actions**

Production-style end-to-end QA automation framework for testing a banking application across **UI, REST API, database, and integration layers**.

The framework uses **Playwright + TypeScript** and runs against a reproducible Dockerized ParaBank environment. It validates functional behavior, API contracts, database state, financial transaction integrity, and security-oriented negative scenarios.

-------------------------------------------------------------------------------------

## 🚀 Project Highlights

- ✅ UI automation with Playwright
- ✅ REST API automation using Playwright `APIRequestContext`
- ✅ Runtime JSON schema validation using AJV
- ✅ Real HSQLDB database validation
- ✅ UI → API → Database integration testing
- ✅ Banking account and transaction validation
- ✅ Fund transfer validation
- ✅ Security-oriented negative testing
- ✅ Centralized test data management
- ✅ Page Object Model architecture
- ✅ API service-layer architecture
- ✅ Database query/repository layer
- ✅ Dockerized ParaBank environment
- ✅ Playwright HTML reporting
- ✅ Allure reporting
- ✅ GitHub Actions CI/CD
- ✅ TypeScript strict mode
- ✅ Cross-layer test validation
- ✅ 37 automated tests passing


-------------------------------------------------------------------------------------


## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Playwright | UI & API automation |
| TypeScript | Test framework implementation |
| Node.js | Runtime |
| Playwright Test | Test execution |
| REST API | Backend/API validation |
| AJV | JSON schema validation |
| HSQLDB | Real database validation |
| Docker | Reproducible application environment |
| Allure | Test reporting |
| GitHub Actions | CI/CD |
| dotenv | Environment configuration |
| Faker | Test data generation |
| Git | Version control |


-------------------------------------------------------------------------------------


## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │    Playwright Test  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐     ┌──────────┐     ┌──────────┐
        │    UI    │     │   API    │     │    DB    │
        │   Tests  │     │   Tests  │     │   Tests  │
        └────┬─────┘     └────┬─────┘     └────┬─────┘
             │                │                │
             ▼                ▼                ▼
        Page Objects     API Services     DB Queries
             │                │                │
             ▼                ▼                ▼
        ParaBank UI       REST APIs        HSQLDB
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                    Integration Validation


---------------------------------------------------------------------------------

Integration Flow

The framework validates important banking workflows across multiple layers:

UI Action
   ↓
ParaBank Application
   ↓
REST API
   ↓
Database
   ↓
Business State Validation


Example : 


Transfer $1
   ↓
UI transfer
   ↓
Account balance changes
   ↓
Transaction created
   ↓
API verifies final balance
   ↓
Database verifies transaction + balance



-------------------------------------------------------------------------------------



📁 Project Structure

banking-qa-automation/
│
├── api/
│   ├── clients/
│   ├── models/
│   └── services/
│
├── database/
│   ├── clients/
│   ├── models/
│   └── queries/
│
├── fixtures/
│
├── pages/
│   ├── login-page.ts
│   ├── accounts-overview-page.ts
│   ├── account-details-page.ts
│   └── transfer-funds-page.ts
│
├── schemas/
│
├── test-data/
│
├── tests/
│   ├── api/
│   ├── database/
│   ├── integration/
│   └── ui/
│
├── utils/
│
├── config/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md


-------------------------------------------------------------------------------------


🧪 Test Coverage
Authentication
Valid login
Invalid username
Invalid password
Empty credentials
Password masking
Logout
Session termination
Accounts
Customer retrieval
Account retrieval
Account list validation
Account balance validation
Invalid account handling
Transactions
Transaction retrieval
Transaction list validation
Transaction field validation
Transfer transaction validation
Database transaction verification
Fund Transfers
Successful transfer
Source account validation
Destination account validation
Balance validation
Transaction validation
Invalid source account
Zero amount behavior
Negative amount behavior
Invalid amount format
Empty amount
API Testing
HTTP status validation
Response body validation
JSON schema validation
Authentication validation
Positive scenarios
Negative scenarios
Transfer API validation


Database Testing

Real HSQLDB connection
Account queries
Transaction queries
Transaction field validation
Transfer transaction validation
Source/destination transaction correlation
Database balance validation


Integration Testing

UI → API → Database
The transfer workflow validates the resulting business state across application layers rather than validating only the UI response.

Security-Oriented Testing

The framework includes safe negative security scenarios such as:

Unauthorized page access
Invalid authentication
Empty credentials
Password masking
Logout/session termination
Invalid transfer input

No CAPTCHA/OTP bypass, credential theft, brute-force automation, or exploit development is performed.

-------------------------------------------------------------------------------------

📊 Test Results

Current local regression:
37 Tests
37 Passed
0 Failed

The same project is executed through GitHub Actions against the Dockerized ParaBank environment.

-------------------------------------------------------------------------------------


🐳 Dockerized Test Environment

The project uses ParaBank in Docker to provide a reproducible local banking application and database environment.

Start the environment: docker compose -d up
Check the application: http://localhost:8080/parabank/index.htm
Check container status: docker compose ps
Stop the environment: docker compose down


-------------------------------------------------------------------------------------



⚙️ Installation
Prerequisites
Node.js 22+
Docker Desktop
Git
Install dependencies: npm ci
Install Playwright browser: npx playwright install chromium
Configure environment: COPY .env.example to .env
Default local configuration:

BASE_URL=http://localhost:8080
API_BASE_URL=http://localhost:8080
DB_HOST=localhost
DB_PORT=9001
DB_NAME=parabank
DB_USER=sa
DB_PASSWORD=


-------------------------------------------------------------------------------------


▶️ Running Tests

Start ParaBank: docker compose up -d
Run the complete test suite: npm test
Run UI tests: npm run test:ui
Run tests in headed mode: npm run test:headed
Run tests in debug mode: npm run test:debug
Run TypeScript validation: npm run typecheck


-------------------------------------------------------------------------------------


📈 Test Reports
Playwright HTML Report

Run: npm test
Then,
npm run report

Allure Report
To Generate: npm run report:allure
To Open : npm run report:allure:open
Generated reports are intentionally excluded from Git tracking.

-------------------------------------------------------------------------------------


🔄 CI/CD

GitHub Actions automatically:

Checks out the repository
Installs Node.js
Installs dependencies
Installs Playwright
Starts ParaBank with Docker Compose
Waits for the application
Initializes the ParaBank database
Prepares the HSQLDB JDBC driver
Verifies seed data
Runs TypeScript type checking
Executes Playwright tests
Uploads test reports and results
Collects ParaBank logs

Workflow:
Git Push / Pull Request
          ↓
   GitHub Actions
          ↓
   Docker ParaBank
          ↓
   Database Setup
          ↓
     Typecheck
          ↓
   Playwright Tests
          ↓
   Reports / Artifacts


-------------------------------------------------------------------------------------


🧠 QA Engineering Practices

This framework follows several production-oriented practices:

Page Object Model
Service-layer API abstraction
Database query abstraction
Centralized test data
Environment-based configuration
Strict TypeScript
Runtime schema validation
Independent test design
Playwright auto-waiting
Role/label/test-id oriented locators
Explicit business assertions
Cross-layer validation
Negative testing
Reproducible Docker environment
CI execution
Test reporting

-------------------------------------------------------------------------------------


🔐 Test Data & Security

This project uses a publicly available banking demo application.

No real:

Bank accounts
Financial information
Customer credentials
Payment information
Production secrets

are used.

Environment-specific configuration is stored through .env and is excluded from source control.


-------------------------------------------------------------------------------------



🎯 Project Objective

The primary objective is to demonstrate the ability to design and implement a scalable QA automation framework capable of validating a banking application's:
UI
 ↓
REST API
 ↓
Database
 ↓
Business Rules
 ↓
Integration Behavior

The project emphasizes real cross-layer validation rather than UI-only automation.


-------------------------------------------------------------------------------------



👨‍💻 Author

Abhishek Saini | Senior QA Automation Engineer 

Core focus:
Playwright
TypeScript
API Testing
Database Testing
CI/CD
End-to-End Automation
