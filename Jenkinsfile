#!/usr/bin/env groovy

pipeline {
    agent {
        docker {
            image 'jenkins-node-piper-mbt:latest'
            args '--user root:root -v /var/run/docker.sock:/var/run/docker.sock  -p 3000:3000'
            reuseNode true
        }
    }
    
    environment {
        // Variables del proyecto
        PROJECT_NAME = 'mi-servidor-web'
        BUILD_VERSION = "${env.BUILD_ID}"
        NODE_ENV = 'production'
        
        // Configuración de rutas
        NPM_CONFIG_CACHE = "${env.WORKSPACE}/.npm"
    }
    
    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5'))
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Verificar Entorno') {
            steps {
                script {
                    echo "🔍 Verificando herramientas en el contenedor..."
                    sh '''
                        set -e
                        echo "=== Versiones de Herramientas ==="
                        node --version
                        npm --version
                        which piper && piper version || echo "Piper disponible"
                        echo "================================"
                    '''
                }
            }
        }
        stage('Checkout Código') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],  // o usa env.BRANCH_NAME
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/mapenagames/sap-npm.git'
                        //credentialsId: 'tu-credencial-git'
                    ]]
                ])
                sh 'ls -la'
            }
        }

        stage('Conf npm y creacion package-lock.json') {
            steps {
                script {
                    echo "📦 Instalando dependencias NPM..."

                    sh '''
                        # Configurar cache de npm
                        npm config set cache "${NPM_CONFIG_CACHE}" --global
                        # Verificar si existe package-lock.json
                        if [ ! -f "package-lock.json" ]; then
                            echo "📝 Generando package-lock.json..."
                            npm install --package-lock-only --no-audit
                        fi
                        # cat package-lock.json
                    '''
                }
            }
        }

        stage('Instalar Dependencias') {
            steps {
                script {
                    echo "📦 Instalando dependencias NPM..."
                    sh '''
                        # Instalar TODAS las dependencias incluyendo desarrollo
                        npm install --include=dev --no-audit --prefer-offline

                        # Verificar instalación
                        echo "=== Dependencias instaladas ==="
                        npm list --depth=0
                    '''
                }
            }
        }

        stage('Validación de Código') {
            steps {
                script {
                    println "salteo paso"
                }
            }
            //parallel {
            //    stage('Validar Sintaxis') {
            //        steps {
            //            script {
            //                echo "🔎 Validando sintaxis del código..."
            //    
            //                sh '''
            //                    # Validar que app.js existe y es ejecutable
            //                    if [ ! -f "app.js" ]; then
            //                        echo "❌ ERROR: app.js no encontrado"
            //                        exit 1
            //                    fi
            //    
            //                    # Verificar sintaxis básica de Node.js
            //                    node -c app.js
            //                    echo "✅ Sintaxis de app.js válida"
            //    
            //                    # Validar package.json
            //                    npm pack --dry-run 2>/dev/null && echo "✅ package.json válido"
            //                '''
            //            }
            //        }
            //    }
            //    stage('Análisis de Seguridad') {
            //        steps {
            //            script {
            //                echo "🔒 Analizando seguridad de dependencias..."
            //                sh '''
            //                    # Auditoría de npm (principal)
            //                    echo "=== Ejecutando npm audit ==="
            //                    npm audit --audit-level high || true
            //                    # Alternativa: auditoría con detalles
            //                    echo "=== Auditoría detallada ==="
            //                    npm audit --json > audit-report.json 2>/dev/null || echo "Auditoría completada"
            //                    # Verificar vulnerabilidades conocidas en dependencias críticas
            //                    echo "=== Revisando dependencias críticas ==="
            //                    npm list --depth=1 | grep -E "(express|debug|lodash|moment)" || echo "Dependencias principales verificadas"
            //                    # Usar un comando Piper que SÍ exista para análisis de código
            //                    echo "=== Análisis con Piper ==="
            //                    piper --help | head -10 || echo "Piper disponible"
            //                    # Análisis alternativo: verificar archivos sensibles
            //                    echo "=== Buscando archivos sensibles ==="
            //                    find . -name "*.env" -o -name "*.key" -o -name "*.pem" | head -5 || echo "No se encontraron archivos sensibles"
            //                '''
            //            }
            //        }
            //    }
            //}
        }
        stage('Debug Dependencias') {
            steps {
                script {
                    echo "🐛 Debug: Investigando problema de dependencias"

                    sh '''
                        echo "=== Estado actual del proyecto ==="
                        npm --version
                        node --version
                        echo "Package.json:"
                        cat package.json
                        echo "=== Contenido de node_modules ==="
                        ls -la node_modules | wc -l
                        du -sh node_modules
                        echo "=== Cache de npm ==="
                        npm config get cache
                        ls -la ~/.npm
                    '''
                }
            }
        }
        stage('Pruebas de Funcionalidad') {
            steps {
                script {
                    echo "🧪 Ejecutando pruebas de funcionalidad..."
                    sh '''
                        # Ejecutar pruebas
                        npx jest --verbose --passWithNoTests --config=jest.config.js
                    '''
                }
            }
        
            post {
                always {
                    // Publicar reportes si se generan
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Cobertura de Pruebas'
                    ])
                }
            }
        }

        stage('Verificar Servicio Web') {
            steps {
                script {
                    echo "🌐 Probando servicio web en puerto 3000..."
                    sh '''
                        # Iniciar servidor en background
                        echo "Iniciando servidor en puerto 3000..."
                        npm start &
                        SERVER_PID=$!
                        
                        # Esperar que el servidor inicie
                        sleep 5
                        
                        # Verificar que el proceso está corriendo usando kill -0
                        if kill -0 $SERVER_PID 2>/dev/null; then
                            echo "✅ Servidor iniciado correctamente (PID: $SERVER_PID)"
                            
                            # Probar que responde en localhost:3000
                            echo "=== Probando endpoints ==="
                            curl -f http://localhost:3000/ && echo "✅ Endpoint / funcionando"
                            curl -f http://localhost:3000/saludo && echo "✅ Endpoint /saludo funcionando"
                            
                            # Detener el servidor
                            kill $SERVER_PID
                            wait $SERVER_PID 2>/dev/null || true
                            echo "🛑 Servidor detenido"
                        else
                            echo "❌ El servidor no pudo iniciarse"
                            exit 1
                        fi
                    '''
                }
            }
        }
    }
}