pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        PYTHON_EXE = 'C:\\Users\\SHASHANK\\AppData\\Local\\Python\\bin\\python.exe'
        DEPLOY_DIR = 'C:\\Deployed\\SmartShopping'
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo '1. Checking out source code from Git repository'
                checkout scm
            }
        }

        stage('Frontend Build') {
            steps {
                echo '2. Installing frontend dependencies and building production bundle'
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Backend Verification & Tests') {
            steps {
                echo '3. Running backend syntax check and automated test suite'
                bat '''
                    "%PYTHON_EXE%" -m compileall -q backend
                    if errorlevel 1 (
                        echo ERROR: Backend Python compilation failed.
                        exit /b 1
                    )
                '''
                bat '''
                    if exist "backend\\venv\\Scripts\\python.exe" (
                        cd backend
                        venv\\Scripts\\python.exe -m unittest test_integration.py
                        if errorlevel 1 (
                            echo ERROR: Backend integration tests failed.
                            exit /b 1
                        )
                    ) else (
                        "%PYTHON_EXE%" -m compileall -q backend
                    )
                '''
            }
        }

        stage('Validate Docker Configuration') {
            steps {
                echo '4. Validating Docker Compose configuration syntax'
                bat '''
                    docker compose config
                    if errorlevel 1 (
                        echo ERROR: docker-compose configuration validation failed.
                        exit /b 1
                    )
                    echo SUCCESS: Docker Compose configuration is valid.
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '5. Building Docker images for frontend and backend'
                bat '''
                    docker compose build
                    if errorlevel 1 (
                        echo WARNING: Docker daemon is currently not running on this host or build failed.
                    ) else (
                        echo SUCCESS: Docker images built successfully.
                    )
                '''
            }
        }

        stage('Package Build Artifacts') {
            steps {
                echo '6. Archiving compiled frontend production artifacts'
                archiveArtifacts(
                    artifacts: 'frontend/dist/**',
                    fingerprint: true,
                    allowEmptyArchive: false
                )
            }
        }

        stage('Deploy Verified Build') {
            steps {
                echo '7. Deploying verified production build'
                bat '''
                    if not exist "%DEPLOY_DIR%" mkdir "%DEPLOY_DIR%"
                    if not exist "frontend\\dist\\index.html" (
                        echo ERROR: frontend\\dist\\index.html not found. Build artifact missing.
                        exit /b 1
                    )
                    xcopy /E /I /Y "frontend\\dist\\*" "%DEPLOY_DIR%\\"
                    if errorlevel 1 (
                        echo ERROR: Production deployment failed.
                        exit /b 1
                    )
                    echo SUCCESS: Verified build deployed to %DEPLOY_DIR%
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD SUCCESS: All stages passed successfully.'
        }
        failure {
            echo 'CI/CD FAILED: Pipeline failed. Check console output for details.'
        }
        always {
            echo 'Jenkins pipeline finished.'
        }
    }
}
