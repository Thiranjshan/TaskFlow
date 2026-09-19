pipeline {
    agent any
    stages{
        stage('Clone'){
            steps{
                git branch: 'main', url: 'https://github.com/Thiranjshan/TaskFlow.git'
            }
            }
        stage('Deploy'){
            steps{
                sh 'docker compose down'
                sh 'docker compose up --build -d'
            }
        }
    }
}