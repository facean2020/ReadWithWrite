# ReadWithWrite

A basic ASP.NET Core Web API application built with .NET 10.

## Project Structure

- **ReadWithWriteApi** - ASP.NET Core Web API project with a sample WeatherForecast endpoint

## Prerequisites

- .NET 10 SDK or later

## Getting Started

### Build the Project

```bash
cd ReadWithWriteApi
dotnet build
```

### Run the Application

```bash
cd ReadWithWriteApi
dotnet run
```

The API will start on:
- HTTP: `http://localhost:5115`
- HTTPS: `https://localhost:7174`

### Test the API

Once the application is running, you can test the Weather Forecast endpoint:

```bash
curl http://localhost:5115/weatherforecast
```

### OpenAPI Documentation

In development mode, OpenAPI documentation is available at:
- `http://localhost:5115/openapi/v1.json`

## Features

- Built with .NET 10
- Minimal API approach
- OpenAPI/Swagger support
- Sample WeatherForecast endpoint demonstrating GET operations
- HTTPS redirection configured
- Development and production environment settings