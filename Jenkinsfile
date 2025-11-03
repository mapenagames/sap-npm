pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-u root:root'
        }
    }

    environment {
        WORKDIR = 'demo-npm'
    }

    stages {
        stage('Preparar entorno') {
            steps {
                sh '''
                    apk add --no-cache wget git bash
                    wget -q -O piper https://github.com/SAP/jenkins-library/releases/latest/download/piper
                    chmod +x piper
                    mv piper /usr/local/bin/
                    echo "✅ Piper instalado en $(which piper)"
                    piper version
                '''
            }
        }

        stage('Preparar proyecto npm ficticio') {
            steps {
                sh '''
                    mkdir -p ${WORKDIR}
                    cd ${WORKDIR}
                    echo '{
                        "name": "demo-piper",
                        "version": "1.0.0",
                        "scripts": {
                            "lint": "echo Ejecutando lint ficticio...",
                            "test": "echo Ejecutando test ficticio...",
                            "build": "echo Compilando build ficticio..."
                        }
                    }' > package.json
                    cat package.json
                '''
            }
        }

        stage('Ejecutar Piper npmExecuteScripts') {
            steps {
                sh '''
                    cd ${WORKDIR}
                    echo "🏗️ Ejecutando step Piper npmExecuteScripts (modo real controlado)..."
                    piper npmExecuteScripts --verbose --runScripts lint --runScripts test --runScripts build
                '''
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline finalizado correctamente.'
        }
    }
}
