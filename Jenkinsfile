
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Downloading project from GitHub'
                checkout scm
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Backend Syntax Check') {
            steps {
                bat '"C:\\Users\\SHASHANK\\AppData\\Local\\Python\\bin\\python.exe" -m compileall -q backend'
            }
        }

        stage('Package Build Artifacts') {
            steps {
                archiveArtifacts(
                    artifacts: 'frontend/dist/**',
                    fingerprint: true
                )
            }
        }

        stage('Deploy Frontend') {
            steps {
                echo 'Deploying Smart Shopping Assistant frontend'

                bat '''
                    if not exist "C:\\Deployed\\SmartShopping" mkdir "C:\\Deployed\\SmartShopping"
                    if not exist "frontend\\dist\\index.html" exit /b 1
                    xcopy /E /I /Y "frontend\\dist\\*" "C:\\Deployed\\SmartShopping\\"
                    if errorlevel 1 exit /b 1
                '''

                echo 'Frontend deployment completed'
            }
        }
    }

    post {
        success {
            echo 'CI/CD SUCCESS: Frontend built, backend syntax checked, and frontend deployed.'
        }

        failure {
            echo 'CI/CD FAILED: Check the Console Output for errors.'
        }

        always {
            echo 'Jenkins pipeline finished.'
        }
    }
}
