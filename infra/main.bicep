// Azure Bicep template — Employee Directory infrastructure
// Deploy: az deployment group create --resource-group rg-employee --template-file main.bicep

@description('Location for all resources')
param location string = resourceGroup().location

@description('Application name prefix')
param appName string = 'employee-directory'

@description('App Service Plan SKU')
@allowed(['B1', 'B2', 'S1', 'P1v3'])
param sku string = 'B1'

@description('PostgreSQL admin password')
@secure()
param dbAdminPassword string

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${appName}-plan'
  location: location
  sku: {
    name: sku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// API Web App (.NET 8)
resource apiWebApp 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-api'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|8.0'
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Production'
        }
      ]
    }
    httpsOnly: true
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${appName}-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

// PostgreSQL Flexible Server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: '${appName}-db'
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: 'pgadmin'
    administratorLoginPassword: dbAdminPassword
    storage: {
      storageSizeGB: 32
    }
    version: '16'
  }
}

output apiUrl string = 'https://${apiWebApp.properties.defaultHostName}'
output appInsightsKey string = appInsights.properties.InstrumentationKey
