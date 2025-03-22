pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "task-manager-backend"
        FRONTEND_IMAGE = "task-manager-frontend"
        POSTGRES_IMAGE = "postgres"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/Hannan2004/Cloud-Mini-Project.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    sh 'docker build -t ${BACKEND_IMAGE} ./backend'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    sh 'docker build -t ${FRONTEND_IMAGE} ./frontend'
                }
            }
        }

        stage('Start Services with Docker Compose') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh 'docker-compose exec backend npm test || true'
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    sh 'docker system prune -f'
                }
            }
        }
    }
}