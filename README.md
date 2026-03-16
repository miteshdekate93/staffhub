# StaffHub — Employee Directory

![CI](https://github.com/miteshdekate93/staffhub/actions/workflows/deploy-azure.yml/badge.svg)
![Angular](https://img.shields.io/badge/Angular-17-red)
![.NET 8](https://img.shields.io/badge/.NET-8-purple)
![Azure](https://img.shields.io/badge/Azure-App%20Service-blue)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

An enterprise-style employee directory app built with Angular and .NET 8, designed to be deployed to Azure App Service. Demonstrates Angular Material UI, REST API design, and cloud deployment with Infrastructure as Code.

## What It Does

HR dashboard to manage employees — search, filter, view profiles, manage departments. The API is ready to deploy to Azure with one command using the included Bicep templates.

## Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | Angular 17 + Angular Material |
| Backend | .NET 8 Web API |
| Database | PostgreSQL + Entity Framework Core |
| Auth | JWT Bearer tokens |
| Cloud | Azure App Service |
| IaC | Azure Bicep (infrastructure as code) |
| CI/CD | GitHub Actions |
| Local dev | Docker Compose |

## Run It Locally

```bash
git clone https://github.com/miteshdekate93/staffhub.git
cd staffhub
docker-compose up --build
```
- Angular app: http://localhost:4200
- API + Swagger: http://localhost:5001/swagger

## Deploy to Azure

```bash
# 1. Login to Azure
az login
az group create --name rg-staffhub --location eastus

# 2. Deploy infrastructure (App Service + PostgreSQL)
az deployment group create \
  --resource-group rg-staffhub \
  --template-file infra/main.bicep \
  --parameters dbAdminPassword=YourPassword123!

# 3. Push to main — GitHub Actions deploys automatically
```

See `infra/main.bicep` for the full Azure resource definitions.

## Project Structure

```
staffhub/
├── api/           .NET 8 Web API (employees, departments, auth)
├── client/        Angular 17 app (Angular Material UI)
├── infra/         Azure Bicep templates (IaC)
└── docker-compose.yml
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List employees (search + pagination) |
| POST | `/api/employees` | Add employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Remove employee (soft delete) |
| GET | `/api/departments` | List departments |
