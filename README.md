# Employee Directory — Angular 17 + .NET 8 + Azure

![Build](https://github.com/miteshdekate93/angular-dotnet-azure/actions/workflows/deploy-azure.yml/badge.svg)
![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular)
![.NET](https://img.shields.io/badge/.NET-8.0-purple?logo=dotnet)
![Azure](https://img.shields.io/badge/Azure-App%20Service-0089D6?logo=microsoftazure)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/license-MIT-green)

An enterprise-grade **Employee Directory** and **HR Dashboard** built with Angular 17, .NET 8 Web API, and deployed to **Azure App Service** via GitHub Actions CI/CD. Demonstrates real-world enterprise architecture patterns with Angular Material UI and Azure Infrastructure as Code (Bicep).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Cloud                               │
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  Azure App       │    │  Azure App       │                   │
│  │  Service (SPA)   │───▶│  Service (API)   │                   │
│  │  Angular 17      │    │  .NET 8 Web API  │                   │
│  └──────────────────┘    └────────┬─────────┘                   │
│                                   │                              │
│                          ┌────────▼─────────┐                   │
│                          │  Azure SQL DB /   │                   │
│                          │  PostgreSQL        │                   │
│                          └──────────────────┘                   │
│                                                                  │
│  ┌──────────────────┐                                           │
│  │  App Insights    │  (monitoring + telemetry)                 │
│  └──────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

**Local development:** Docker Compose spins up the full stack in one command.

---

## Features

- ✅ Employee CRUD (create, view, edit, delete)
- ✅ Department management
- ✅ Search and filter with real-time results
- ✅ Pagination and sorting
- ✅ Angular Material UI components
- ✅ JWT authentication
- ✅ Azure App Service deployment via GitHub Actions
- ✅ Azure Bicep IaC templates (Infrastructure as Code)
- ✅ Application Insights telemetry
- ✅ Docker Compose for local development

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Angular + Angular Material | 17 |
| Backend | .NET Web API | 8.0 |
| ORM | Entity Framework Core | 8.0 |
| Database | PostgreSQL / Azure SQL | - |
| Auth | JWT Bearer | - |
| Monitoring | Azure Application Insights | - |
| IaC | Azure Bicep | - |
| CI/CD | GitHub Actions → Azure | - |
| Container | Docker + Docker Compose | - |

---

## Quick Start (Local)

```bash
git clone https://github.com/miteshdekate93/angular-dotnet-azure.git
cd angular-dotnet-azure
docker-compose up --build
```

- Angular App: http://localhost:4200
- API + Swagger: http://localhost:5001/swagger

---

## Azure Deployment

### Prerequisites
- Azure subscription
- Azure CLI installed
- GitHub repo secrets configured (see below)

### Step 1: Deploy Infrastructure
```bash
az login
az group create --name rg-employee-directory --location eastus
az deployment group create \
  --resource-group rg-employee-directory \
  --template-file infra/main.bicep
```

### Step 2: Configure GitHub Secrets
| Secret | Description |
|--------|-------------|
| `AZURE_APP_NAME` | Your Azure Web App name |
| `AZURE_PUBLISH_PROFILE` | Download from Azure Portal → Web App → Get publish profile |

### Step 3: Push to main
The GitHub Actions pipeline automatically deploys on every push to `main`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List employees (paginated) |
| GET | `/api/employees/{id}` | Get employee details |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/departments` | List departments |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/health` | Health check |

---

## Project Structure

```
angular-dotnet-azure/
├── api/                        # .NET 8 Web API
│   ├── Controllers/
│   │   ├── EmployeesController.cs
│   │   ├── DepartmentsController.cs
│   │   └── AuthController.cs
│   ├── Models/
│   │   ├── Employee.cs
│   │   └── Department.cs
│   ├── Data/AppDbContext.cs
│   ├── Program.cs
│   └── Dockerfile
│
├── client/                     # Angular 17 app
│   ├── src/app/
│   │   ├── employees/          # Employee list + detail components
│   │   ├── departments/        # Department components
│   │   ├── services/           # HTTP services
│   │   └── models/             # TypeScript interfaces
│   └── Dockerfile
│
├── infra/
│   ├── main.bicep              # Azure infrastructure template
│   └── README.md               # Azure deployment guide
│
├── docker-compose.yml
└── .github/workflows/
    └── deploy-azure.yml        # CI/CD → Azure App Service
```

---

## License

MIT © [miteshdekate93](https://github.com/miteshdekate93)
