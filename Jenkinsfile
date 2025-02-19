pipeline {
    agent any

    environment {
        IMAGE_NAME = "playwright-ecommerce"
        CONTAINER_NAME = "playwright-test"
        GIT_REPO = "https://github.com/Xiaodie304/playwright-e-commerce.git"
        GIT_BRANCH = "main"
    }

    stages {
        stage('Checkout Code') { // Checkout code from GIT_REPO
            steps {
                git branch: "$GIT_BRANCH", url: "$GIT_REPO"
            }
        }

        stage('Prepare .env') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'ENV_FILE', variable: 'ENV_PATH')]) {
                        sh 'cp "$ENV_PATH" .env'
                        sh 'cat .env' // Debug kiểm tra nội dung file
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t $IMAGE_NAME ."
                }
            }
        }

        stage('Run Tests') { // Run tests in Docker container
            steps {
                script {
                    sh """
                        docker run --name $CONTAINER_NAME \
                        --env-file .env \
                        $IMAGE_NAME || true
                    """
                }
            }
        }

        stage('Cleanup') { 
            steps {
                script {
                    sh """
                        docker rm -f $CONTAINER_NAME || true
                        docker rmi -f $IMAGE_NAME || true
                    """
                }
            }
        }
    }
}
