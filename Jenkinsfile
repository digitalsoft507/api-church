pipeline {
    agent any
    stages {
        stage('Clonar Repositorio') {
            steps {
                git 'https://github.com/digitalsoft507/api-church.git'
            }
        }
        stage('Construir') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Pruebas') {
            steps {
                sh 'npm test'
            }
        }
        stage('Desplegar') {
            steps {
                sh 'npm test'
            }
        }
    }
}
