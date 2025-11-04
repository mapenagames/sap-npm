pipeline {
    agent {
        /*
            Dockerfile
            FROM node:18-alpine
            ENV HOME=/home/jenkins
            RUN apk add --no-cache bash git wget curl bash \
                && npm install -g mbt \
                && wget -q -O /usr/local/bin/piper https://github.com/SAP/jenkins-library/releases/latest/download/piper \
                && chmod +x /usr/local/bin/piper

            RUN adduser -D jenkins
            USER jenkins
            WORKDIR /home/jenkins


            docker build -t jenkins-node-piper-mbt:latest .
        */
        docker {
            image 'jenkins-node-piper-mbt'
            args '-u root:root'
        }
    }

    environment {
        WORKDIR = 'demo-npm-real'
    }

    stages {

        stage('Preparar proyecto npm real') {
            steps {
                sh '''
                    hostname
                    hostname -i
                '''
            }
        }

    }

    post {
        always {
            echo 'Pipeline completo con npmExecuteScripts + mtaBuild ejecutado correctamente.'
        }
    }
}
