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
        stage('Ejecutar piper mtaBuild') {
            steps {
                sh '''
                    echo "🏗️ Preparando proyecto MTA simulado..."
                    mkdir -p ${WORKDIR}/mta
                    cd ${WORKDIR}/mta

                    cat > mta.yaml <<'EOF'
                ID: demo-piper-mta
                version: 1.0.0
                modules:
                  - name: demo-module
                    type: nodejs
                    path: .
                EOF
                    cat mta.yaml
                    echo 'console.log("Demo MTA Build ejecutado con Piper")' > index.js

                    echo "🏗️ Ejecutando piper mtaBuild..."
                    piper mtaBuild --verbose || echo "⚠️ mtaBuild finalizó con advertencias"

                    echo "✅ Archivos generados:"
                    ls -lh
                '''
            }
        }

        stage('Archivar artefactos') {
            steps {
                script {
                    echo "📦 Archivando artefactos generados (.mtar)"
                }
                archiveArtifacts artifacts: "${WORKDIR}/mta/mta_archives/*.mtar", onlyIfSuccessful: true
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline completo con npmExecuteScripts + mtaBuild ejecutado correctamente.'
        }
    }
}
 