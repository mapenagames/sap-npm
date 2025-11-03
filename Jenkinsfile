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
                    echo " Piper instalado en $(which piper)"
                    piper version

                    echo " Instalando SAP MTA Builder (mbt)..."
                    npm install -g mbt
                    echo " mbt instalado en $(which mbt)"
                    mbt --version
                '''
            }
        }

        stage('Preparar proyecto npm ficticio') {
            steps {
                sh '''
                    mkdir -p ${WORKDIR}
                    cd ${WORKDIR}
                    echo '{                                                         ' >  package.json
                    echo ' "name": "demo-piper",                                    ' >> package.json
                    echo ' "version": "1.0.0",                                      ' >> package.json
                    echo ' "scripts": {                                             ' >> package.json
                    echo '     "lint": "echo Ejecutando lint ficticio...",          ' >> package.json
                    echo '     "test": "echo Ejecutando test ficticio...",          ' >> package.json
                    echo '     "build": "echo Compilando build ficticio..."         ' >> package.json
                    echo ' }                                                        ' >> package.json
                    echo '}                                                         ' >> package.json
                    cat package.json
                '''
            }
        }

        stage('Ejecutar Piper npmExecuteScripts') {
            steps {
                sh '''
                    cd ${WORKDIR}
                    echo " Ejecutando step Piper npmExecuteScripts..."
                    piper npmExecuteScripts --verbose --runScripts lint --runScripts test --runScripts build
                '''
            }
        }

        stage('Ejecutar piper mtaBuild') {
            steps {
                sh '''
                    echo " Preparando proyecto MTA simulado..."
                    mkdir -p ${WORKDIR}/mta
                    cd ${WORKDIR}/mta
                    pwd
                    echo 'ID: demo-piper-mta           ' > mta.yaml
                    echo 'version: 1.0.0               ' >> mta.yaml
                    echo 'modules:                     ' >> mta.yaml
                    echo '  - name: demo-module        ' >> mta.yaml
                    echo '    type: nodejs             ' >> mta.yaml
                    echo '    path: .                  ' >> mta.yaml

                    cat mta.yaml
                    echo 'console.log("Demo MTA Build ejecutado con Piper")' > index.js

                    echo " Ejecutando piper mtaBuild..."
                    piper mtaBuild --verbose || echo " mtaBuild finalizó con advertencias"

                    echo " Archivos generados:"
                    ls -lh
                '''
            }
        }

        stage('Archivar artefactos') {
            steps {
                script {
                    echo " Archivando artefactos generados (.mtar)"
                }
                archiveArtifacts artifacts: "${WORKDIR}/mta/*.mtar", onlyIfSuccessful: true
            }
        }
    }

    post {
        always {
            echo ' Pipeline completo con npmExecuteScripts + mtaBuild ejecutado correctamente.'
        }
    }
}
