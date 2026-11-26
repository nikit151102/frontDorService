<#
.SYNOPSIS
    Универсальный скрипт сборки Angular + Electron в .exe установщик (Версия 2.0 - Multi-Project Safe)
    
.DESCRIPTION
    Исправления для работы с несколькими проектами:
    1. Динамический поиск папки dist (не зависит от имени проекта в angular.json)
    2. Уникальный appId для каждого проекта (поддержка дефисов)
    3. Безопасная передача --base-href=./ через аргументы сборки (не меняет исходники)
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,
    
    [switch]$SkipAngularBuild,
    [switch]$SkipElectronInstall,
    [string]$ElectronVersion = "28.3.3"
)

# ===== КОНФИГУРАЦИЯ =====
$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Join-Path $scriptDir $ProjectName

# Если скрипт запускается из папки проекта - используем текущую директорию
if (Test-Path (Join-Path $scriptDir "angular.json")) {
    $projectDir = $scriptDir
}

$electronDir = Join-Path $projectDir "electron"
$electronDist = Join-Path $electronDir "dist"
$outputDir = Join-Path $projectDir "dist-electron"

# URL для скачивания Electron (зеркало npmmirror)
$electronUrl = "https://npmmirror.com/mirrors/electron/v$ElectronVersion/electron-v$ElectronVersion-win32-x64.zip"

# ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function Write-Step($message, $color = "Yellow") {
    Write-Host "`n▶ $message" -ForegroundColor $color -NoNewline
    Write-Host ""
}

function Write-Success($message) {
    Write-Host "  ✅ $message" -ForegroundColor Green
}

function Write-Error2($message) {
    Write-Host "  ❌ $message" -ForegroundColor Red
}

function Write-Info($message) {
    Write-Host "  ℹ️  $message" -ForegroundColor Cyan
}

function Write-Warn($message) {
    Write-Host "  ⚠️  $message" -ForegroundColor Yellow
}

function Test-Command($command) {
    $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
}

# ===== НАЧАЛО ВЫПОЛНЕНИЯ =====
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🔨 СБОРКА ANGULAR + ELECTRON В .exe УСТАНОВЩИК     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Info "Проект: $ProjectName"
Write-Info "Путь: $projectDir"
Write-Info "Electron версия: $ElectronVersion"

# ===== 1. ПРОВЕРКА СТРУКТУРЫ ПРОЕКТА =====
Write-Step "1. Проверка структуры проекта"

if (-not (Test-Path $projectDir)) {
    Write-Error2 "Папка проекта не найдена: $projectDir"
    exit 1
}

if (-not (Test-Path (Join-Path $projectDir "angular.json"))) {
    Write-Error2 "angular.json не найден. Это не Angular проект?"
    exit 1
}

Write-Success "Структура проекта корректна"

# ===== 2. ПРОВЕРКА NODE.JS =====
Write-Step "2. Проверка Node.js"

if (-not (Test-Command "node")) {
    Write-Error2 "Node.js не установлен! Скачайте с https://nodejs.org/"
    exit 1
}

$nodeVersion = node --version
$npmVersion = npm --version
Write-Success "Node.js $nodeVersion, npm $npmVersion"

# ===== 3. СБОРКА ANGULAR =====
Write-Step "3. Сборка Angular приложения"

if ($SkipAngularBuild) {
    Write-Info "Пропуск сборки Angular (используем существующую)"
} else {
    Push-Location $projectDir
    try {
        Write-Info "Запуск: npm run build -- --base-href=./"
        # Передаем base-href через аргументы, не меняя исходный файл!
        npm run build -- --base-href=./
        if ($LASTEXITCODE -ne 0) {
            Write-Error2 "Ошибка сборки Angular!"
            exit 1
        }
        Write-Success "Angular собран успешно"
    } finally {
        Pop-Location
    }
}

# ===== 4. АВТОМАТИЧЕСКИЙ ПОИСК ПАПКИ DIST (ИСПРАВЛЕНИЕ) =====
Write-Step "4. Поиск папки сборки Angular"

$distRoot = Join-Path $projectDir "dist"
$angularDist = ""

if (-not (Test-Path $distRoot)) {
    Write-Error2 "Папка dist не найдена. Убедитесь, что сборка прошла успешно."
    exit 1
}

# Вариант А: Angular 17+ (dist/<project>/browser/index.html)
$browserFolders = Get-ChildItem -Path $distRoot -Directory -Filter "browser" -Recurse -Depth 2 -ErrorAction SilentlyContinue
foreach ($dir in $browserFolders) {
    if (Test-Path (Join-Path $dir.FullName "index.html")) {
        $angularDist = $dir.FullName
        break
    }
}

# Вариант Б: Angular <17 или кастомная сборка (dist/<project>/index.html)
if (-not $angularDist) {
    $indexFiles = Get-ChildItem -Path $distRoot -Filter "index.html" -Recurse -Depth 2 -ErrorAction SilentlyContinue
    foreach ($file in $indexFiles) {
        if ($file.Directory.Name -ne "browser") {
            $angularDist = $file.Directory.FullName
            break
        }
    }
}

if (-not $angularDist -or -not (Test-Path (Join-Path $angularDist "index.html"))) {
    Write-Error2 "Не удалось найти index.html в папке dist."
    Write-Info "Проверьте имя проекта в angular.json. Ожидалась структура dist/<имя-проекта>/browser или dist/<имя-проекта>"
    exit 1
}

Write-Success "Найдена папка сборки: $angularDist"

# ===== 5. СОЗДАНИЕ СТРУКТУРЫ ELECTRON =====
Write-Step "5. Создание структуры Electron"

if (-not (Test-Path $electronDir)) {
    New-Item -ItemType Directory -Force -Path $electronDir | Out-Null
    Write-Success "Создана папка: electron/"
}

# Создание electron/package.json
$electronPackageJson = Join-Path $electronDir "package.json"

# ИСПРАВЛЕНИЕ: Уникальный appId (разрешаем дефисы и подчеркивания)
$safeAppName = $ProjectName -replace '[^a-zA-Z0-9_-]', ''

$packageJsonContent = @"
{
  "name": "$ProjectName",
  "version": "1.0.0",
  "description": "$ProjectName Desktop Application",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder --win"
  },
  "build": {
    "appId": "com.$safeAppName.app",
    "productName": "$ProjectName",
    "directories": {
      "output": "../dist-electron"
    },
    "files": [
      "dist/**/*",
      "main.js",
      "package.json"
    ],
    "win": {
      "target": "nsis"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  },
  "devDependencies": {
    "electron": "^$ElectronVersion",
    "electron-builder": "^24.9.1"
  }
}
"@

Set-Content -Path $electronPackageJson -Value $packageJsonContent -Encoding UTF8
Write-Success "Создан: electron/package.json (appId: com.$safeAppName.app)"

# Создание electron/main.js
$electronMainJs = Join-Path $electronDir "main.js"
$mainJsContent = @"
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
"@

Set-Content -Path $electronMainJs -Value $mainJsContent -Encoding UTF8
Write-Success "Создан: electron/main.js"

# ===== 6. КОПИРОВАНИЕ ANGULAR В ELECTRON =====
Write-Step "6. Копирование Angular в electron/dist"

if (Test-Path $electronDist) {
    Remove-Item -Recurse -Force $electronDist
}
New-Item -ItemType Directory -Force -Path $electronDist | Out-Null
Copy-Item -Path "$angularDist\*" -Destination $electronDist -Recurse -Force
Write-Success "Скопировано файлов: $((Get-ChildItem $electronDist -Recurse -File).Count)"

# ===== 7. УСТАНОВКА ЗАВИСИМОСТЕЙ =====
Write-Step "7. Установка зависимостей Electron"

Push-Location $electronDir
try {
    if ($SkipElectronInstall -and (Test-Path ".\node_modules\electron-builder")) {
        Write-Info "Пропуск установки (используем существующую)"
    } else {
        Write-Info "Установка electron-builder..."
        npm install electron-builder --save-dev --silent
        Write-Success "electron-builder установлен"
    }
} finally {
    Pop-Location
}

# ===== 8. СКАЧИВАНИЕ ELECTRON =====
Write-Step "8. Установка Electron $ElectronVersion"

$electronExePath = Join-Path $electronDir "node_modules\electron\dist\electron.exe"
$pathTxtPath = Join-Path $electronDir "node_modules\electron\path.txt"

if ((Test-Path $electronExePath) -and (Test-Path $pathTxtPath)) {
    Write-Info "Electron уже установлен, пропускаем скачивание"
} else {
    $zipPath = Join-Path $env:TEMP "electron-v$ElectronVersion.zip"
    $extractPath = Join-Path $electronDir "node_modules\electron\dist"
    
    $electronNodeModules = Join-Path $electronDir "node_modules\electron"
    if (-not (Test-Path $electronNodeModules)) { New-Item -ItemType Directory -Force -Path $electronNodeModules | Out-Null }
    if (-not (Test-Path $extractPath)) { New-Item -ItemType Directory -Force -Path $extractPath | Out-Null }
    
    Write-Info "Скачивание: $electronUrl"
    try {
        Invoke-WebRequest -Uri $electronUrl -OutFile $zipPath -UseBasicParsing
        Write-Success "Архив скачан"
    } catch {
        Write-Error2 "Ошибка скачивания: $_"
        Write-Info "Альтернативное зеркало: https://github.com/electron/electron/releases/download/v$ElectronVersion/electron-v$ElectronVersion-win32-x64.zip"
        exit 1
    }
    
    Write-Info "Распаковка..."
    tar -xf $zipPath -C $extractPath
    Remove-Item $zipPath -Force
    Write-Success "Распаковано"
    
    Write-Info "Установка wrapper пакета..."
    Push-Location $electronDir
    try {
        npm install electron --no-save --ignore-scripts --silent
    } finally {
        Pop-Location
    }
    
    [System.IO.File]::WriteAllText($pathTxtPath, "electron.exe")
    Write-Success "Создан path.txt"
}

if (-not (Test-Path $electronExePath)) {
    Write-Error2 "electron.exe не найден после установки!"
    exit 1
}
Write-Success "Electron $ElectronVersion готов"

# ===== 9. СБОРКА .EXE =====
Write-Step "9. Сборка .exe установщика"

if (Test-Path $outputDir) {
    Remove-Item -Recurse -Force $outputDir
}

Push-Location $electronDir
try {
    Write-Info "Запуск electron-builder..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error2 "Ошибка сборки установщика!"
        exit 1
    }
    Write-Success "Установщик создан"
} finally {
    Pop-Location
}

# ===== 10. РЕЗУЛЬТАТ =====
Write-Step "10. Результат" -Color "Green"

$exeFiles = Get-ChildItem "$outputDir\*.exe" -ErrorAction SilentlyContinue

if ($exeFiles) {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║              🎉 СБОРКА ЗАВЕРШЕНА УСПЕШНО!              ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Info "Папка с установщиком: $outputDir"
    Write-Host ""
    Write-Host "  📦 Созданные файлы:" -ForegroundColor Cyan
    
    foreach ($file in $exeFiles) {
        $sizeMB = [math]::Round($file.Length / 1MB, 2)
        Write-Host "     • $($file.Name) ($sizeMB MB)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "  💡 Для запуска установщика:" -ForegroundColor Cyan
    Write-Host "     Start-Process '$($exeFiles[0].FullName)'" -ForegroundColor Yellow
    Write-Host ""
    
    $openFolder = Read-Host "  Открыть папку с установщиком? (y/n)"
    if ($openFolder -eq 'y' -or $openFolder -eq 'Y') {
        Start-Process explorer.exe -ArgumentList $outputDir
    }
} else {
    Write-Error2 "Установщик не был создан!"
    exit 1
}

# cd D:\services\hot-line
# .\build-exe.ps1 -ProjectName "hotline-admin"


# Пропустить сборку Angular (использовать существующую):
# .\build-exe.ps1 -ProjectName "hotline-admin" -SkipAngularBuild


# Использовать другую версию Electron:
# .\build-exe.ps1 -ProjectName "hotline-admin" -ElectronVersion "29.0.0"


# Полный пропуск установки зависимостей:
# .\build-exe.ps1 -ProjectName "hotline-admin" -SkipAngularBuild -SkipElectronInstall



# Что делает скрипт (по шагам)

# 1 Проверяет что проект существует и содержит angular.json
# 2 Проверяет наличие Node.js и npm
# 3 Собирает Angular (npm run build) + исправляет base href
# 4 Создаёт структуру electron/ с package.json и main.js
# 5 Копирует dist/hotline-admin/browser/* в electron/dist/
# 6 Устанавливает electron-builder через npm
# 7 Скачивает Electron с зеркала npmmirror + создаёт path.txt
# 8 Запускает electron-builder для создания .exe
# 9 Показывает результат и предлагает открыть папку



# Преимущества этого скрипта
# ✅ Полностью автономный — создаёт всё с нуля
# ✅ Идемпотентный — можно запускать повторно
# ✅ Устойчив к ошибкам — проверяет каждый шаг
# ✅ Автоматически исправляет base href в Angular
# ✅ Использует зеркало npmmirror (быстрая загрузка в РФ)
# ✅ Создаёт path.txt без BOM (важно для Node.js)
# ✅ Красивый вывод с прогрессом и эмодзи



# Если скрипт не запускается:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser



# Если npmmirror недоступен
# $electronUrl = "https://github.com/electron/electron/releases/download/v$ElectronVersion/electron-v$ElectronVersion-win32-x64.zip"
