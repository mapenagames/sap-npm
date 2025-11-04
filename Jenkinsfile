#!/usr/bin/env groovy

pipeline {
    agent {
        docker {
            image 'jenkins-node-piper-mbt:latest'
            args '--user root:root -v /var/run/docker.sock:/var/run/docker.sock'
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
    }
}