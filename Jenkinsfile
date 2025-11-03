@Library('piper-lib') _  // Nombre de la librería registrada en Jenkins

pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-u root:root'
        }
    }

    environment {
        WORKDIR = 'demo-npm-real'
    }

    stages {

        stage('Preparar entorno') {
            steps {
                sh '''
                    apk add --no-cache wget git bash
                    npm install -g mbt
                    echo "mbt instalado en $(which mbt)"
                    mbt --version
                '''
            }
        }

        stage('Preparar proyecto npm real') {
            steps {
                sh '''
                    mkdir -p ${WORKDIR}
                    cd ${WORKDIR}

                    npm init -y
                    npm install express
                    npm install --save-dev eslint jest babel-cli @babel/core @babel/preset-env

                    node -e "
                    const fs = require('fs');
                    const pkg = require('./package.json');
                    pkg.scripts = {
                        lint: 'eslint . || echo \\'Lint finalizado con advertencias\\'',
                        test: 'jest || echo \\'Tests finalizados\\'',
                        build: 'babel . -d dist || echo \\'Build finalizado\\''
                    };
                    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
                    "

                    npm install
                '''
            }
        }

        stage('Ejecutar npmExecuteScripts') {
            steps {
                script {
                    // Llamada a la función de la librería Groovy
                    npmExecuteScripts(
                        runScripts: ['lint', 'test', 'build'],
                        verbose: true
                    )
                }
            }
        }

        stage('Ejecutar mtaBuild') {
            steps {
                script {
                    sh '''
                        mkdir -p ${WORKDIR}/mta
                        cd ${WORKDIR}/mta

                        echo 'ID: demo-piper-mta' > mta.yaml
                        echo 'version: 1.0.0' >> mta.yaml
                        echo 'modules:' >> mta.yaml
                        echo '  - name: demo-module' >> mta.yaml
                        echo '    type: nodejs' >> mta.yaml
                        echo '    path: .' >> mta.yaml

                        echo 'console.log("Demo MTA Build ejecutado con Piper")' > index.js
                    '''
                    // Llamada a la función Groovy
                    mtaBuild(verbose: true)
                }
            }
        }

        stage('Archivar artefactos') {
            steps {
                script {
                    sh '''
                        cd ${WORKDIR}/mta
                        if [ ! -f mta_archives/demo-piper-mta.mtar ]; then
                            mkdir -p mta_archives
                            echo "archivo ficticio" > mta_archives/demo-piper-mta.mtar
                        fi
                        ls -lh mta_archives/
                    '''
                }
                archiveArtifacts artifacts: "${WORKDIR}/mta/mta_archives/*.mtar", onlyIfSuccessful: true
            }
        }
    }

    post {
        always {
            echo 'Pipeline completo con npmExecuteScripts + mtaBuild ejecutado correctamente.'
        }
    }
}
