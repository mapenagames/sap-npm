pipeline {
    agent {
        docker {
            image 'jenkins-node-piper-mbt:latest'
            args '-u root:root' // si necesitás permisos root
        }
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Preparar proyecto NPM') {
            steps {
                sh '''
                    mkdir -p demo-npm-real
                    cd demo-npm-real
                    npm init -y
                    npm install express
                    npm install --save-dev eslint jest babel-cli @babel/core @babel/preset-env
                '''
            }
        }

        stage('Ejecutar Piper npmExecuteScripts') {
            steps {
                sh '''
                    cd demo-npm-real
                    piper npmExecuteScripts --runScripts lint --runScripts test --runScripts build
                '''
            }
        }

        stage('Ejecutar Piper mtaBuild') {
            steps {
                sh 'piper mtaBuild'
            }
        }
    }
}
