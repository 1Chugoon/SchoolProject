# СТАДИЯ 1: Базовый образ для запуска (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# Открываем порт 8080 (стандарт для .NET 8)
EXPOSE 8080
# Отключаем телеметрию dotnet и настраиваем культуру, если нужно
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1

# СТАДИЯ 2: Сборка (SDK)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Копируем файлы проектов для восстановления зависимостей (кеширование слоев)
COPY ["LearningPlatform.Api/LearningPlatform.Api.csproj", "LearningPlatform.Api/"]
COPY ["LearningPlatform.Application/LearningPlatform.Application.csproj", "LearningPlatform.Application/"]
COPY ["LearningPlatform.Domain/LearningPlatform.Domain.csproj", "LearningPlatform.Domain/"]
COPY ["LearningPlatform.Infrastructure/LearningPlatform.Infrastructure.csproj", "LearningPlatform.Infrastructure/"]

# Восстанавливаем зависимости
RUN dotnet restore "LearningPlatform.Api/LearningPlatform.Api.csproj"

# Копируем весь исходный код и собираем
COPY . .
WORKDIR "/src/LearningPlatform.Api"
RUN dotnet build "LearningPlatform.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# СТАДИЯ 3: Публикация
FROM build AS publish
RUN dotnet publish "LearningPlatform.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# СТАДИЯ 4: Финальный образ
FROM base AS final
WORKDIR /app
# Копируем только готовый результат из стадии публикации
COPY --from=publish /app/publish .

# Запускаем от имени не-root пользователя (безопасность)
USER $APP_UID

ENTRYPOINT ["dotnet", "LearningPlatform.Api.dll"]