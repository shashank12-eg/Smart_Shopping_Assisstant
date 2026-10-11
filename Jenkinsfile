
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
                bat 'py -3 -m compileall -q backend'
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
    }

    post {
        success {
            echo 'CI SUCCESS: Frontend built and backend syntax checked.'
        }

        failure {
            echo 'CI FAILED: Check the Console Output for errors.'
        }

        always {
            echo 'Jenkins pipeline finished.'
        }
    }
}
