pipeline {
    agent any

    environment {
        IMAGE_NAME = "playwright-ecommerce"
        CONTAINER_NAME = "playwright-test"
        GIT_REPO = "https://github.com/Xiaodie304/playwright-e-commerce.git"
        GIT_BRANCH = "main"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "$GIT_BRANCH", url: "$GIT_REPO"
            }
        }

        stage('Prepare .env') {
            steps {
                withCredentials([file(credentialsId: 'ENV_FILE', variable: 'ENV_PATH')]) {
                    sh 'cp "$ENV_PATH" .env && cat .env' // Debug kiểm tra nội dung file
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME ."
            }
        }

        stage('Run Tests') {
            steps {
                sh "docker run --name $CONTAINER_NAME $IMAGE_NAME"
            }
        }
    }

    post {
        always {
            sh "docker rm -f $CONTAINER_NAME || true"
            sh "docker rmi $IMAGE_NAME || true"
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}