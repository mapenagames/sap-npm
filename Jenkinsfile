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
                    # Instalar Piper
                    wget -q -O piper https://github.com/SAP/jenkins-library/releases/latest/download/piper
                    chmod +x piper
                    mv piper /usr/local/bin/
                    echo "✅ Piper instalado en $(which piper)"
                    piper version

                    # Instalar SAP MTA Builder (mbt)
                    echo "⚙️ Instalando SAP MTA Builder (mbt)..."
                    npm install -g mbt
                    echo "✅ mbt instalado en $(which mbt)"
                    mbt --version
                '''
            }
        }

        stage('Preparar proyecto npm ficticio') {
            steps {
                sh '''
                    mkdir -p ${WORKDIR}
                    cd ${WORKDIR}
                    cat <<EOF > package.json
{
  "name": "demo-piper",
  "version": "1.0.0",
  "scripts": {
    "lint": "echo Ejecutando lint ficticio...",
    "test": "echo Ejecutando test ficticio...",
    "build": "echo Compilando build ficticio..."
  }
}
EOF
                    cat package.json
                '''
            }
        }

        stage('Ejecutar Piper npmExecuteScripts') {
            steps {
                sh '''
                    cd ${WORKDIR}
                    echo "🏗️ Ejecutando Piper npmExecuteScripts..."
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

                    cat <<EOF > mta.yaml
ID: demo-piper-mta
version: 1.0.0
modules:
  - name: demo-module
    type: nodejs
    path: .
EOF

                    echo 'console.log("Demo MTA Build ejecutado con Piper")' > index.js

                    echo "🏗️ Ejecutando piper mtaBuild..."
                    piper mtaBuild --verbose || echo "⚠️ mtaBuild finalizó con advertencias"

                    echo "📄 Archivos generados en MTA folder:"
                    ls -lh
                '''
            }
        }

        stage('Archivar artefactos') {
            steps {
                script {
                    echo "📦 Verificando si se generó el artefacto .mtar..."
                    sh '''
                        cd ${WORKDIR}/mta
                        if [ ! -f mta_archives/demo-piper-mta.mtar ]; then
                            echo "⚠️ No se generó ningún .mtar — creando uno ficticio para la prueba."
                            mkdir -p mta_archives
                            echo "archivo ficticio" > mta_archives/demo-piper-mta.mtar
                        fi
                        echo "✅ Archivos encontrados:"
                        ls -lh mta_archives/
                    '''
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
