// pipeline {
//     agent any
//     tools {
//         nodejs 'nodejs' // Ensure Node.js is configured in Jenkins
//     }
    
//     environment {
//         SONAR_HOST_URL = 'http://127.0.0.1:9000' // Replace with your SonarQube server URL
//         SONAR_AUTH_TOKEN = credentials('sonarqube') // Store your SonarQube token in Jenkins credentials
//     }
    
//     stages {
//         stage('Checkout Code') {
//             steps {
//                 checkout scmGit(
//                     branches: [[name: '*/main']],
//                     extensions: [],
//                     userRemoteConfigs: [[credentialsId: 'nodeJs-Crud', url: 'https://github.com/THISmann/node-raabbit-receiver']]
//                 )
//             }
//         }
        
//         stage('Install Dependencies') {
//             steps {
//                 sh 'npm install'
//             }
//         }
        
//         stage("Trivy Scan"){
//             steps {
//                  sh '''
//                     docker run --rm -v $(pwd):/workspace -w /workspace aquasec/trivy fs \
//                     --scanners vuln,secret,misconfig \
//                     --format json -o trivy-report.json ./
//                  '''
//             }
//         }
        
//         stage('SonarQube Analysis') {
//             steps {
//                 script {
//                     // Ensure SonarQube Scanner is installed and available
//                     def scannerHome = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
//                     withEnv(["PATH+SONAR=${scannerHome}/bin"]) {
//                         sh '''
//                         sonar-scanner \
//                             -Dsonar.projectKey=sample_project \
//                             -Dsonar.sources=. \
//                             -Dsonar.host.url=$SONAR_HOST_URL \
//                             -Dsonar.login=$SONAR_AUTH_TOKEN \
//                             -Dsonar.exclusions=node_modules/**,dist/**,coverage/**
//                         '''
//                     }
//                 }
//             }
//         }
        
//         stage('Publish Trivy Report') {
//             steps {
//                 script {
//                     // Convert JSON to HTML for better visibility
//                     sh '''
//                     cat trivy-report.json | jq '.' > trivy-report.html
//                     '''

//                     publishHTML(target: [
//                         reportDir: '',
//                         reportFiles: 'trivy-report.html',
//                         reportName: 'Trivy Security Report'
//                     ])
//                 }
//             }
//         }
//     }
    
//     post {
//         always {
//             archiveArtifacts artifacts: 'trivy-report.json', fingerprint: true
//         }
//     }
// }



pipeline {
    agent any
    tools {
        nodejs 'nodejs' // Ensure Node.js is configured in Jenkins
    }
    
    environment {
        SONAR_HOST_URL = 'http://127.0.0.1:9000' // Replace with your SonarQube server URL
        SONAR_AUTH_TOKEN = credentials('sonarqube') // Store your SonarQube token in Jenkins credentials
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[credentialsId: 'nodeJs-Crud', url: 'https://github.com/THISmann/node-raabbit-receiver']]
                )
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage("Trivy Scan") {
            steps {
                sh '''
                    docker run --rm -v $(pwd):/workspace -w /workspace aquasec/trivy fs \
                    --scanners vuln,secret,misconfig \
                    --format json -o trivy-report.json ./
                '''
            }
        }
        
        stage('Convert Trivy Report to SonarQube Format') {
            steps {
                script {
                    // Convert Trivy JSON report to SonarQube Generic Issue Import format
                    sh '''
                    cat trivy-report.json | jq '[.Results[] | select(.Vulnerabilities != null) | .Vulnerabilities[] | {
                        "engineId": "Trivy",
                        "ruleId": .VulnerabilityID,
                        "severity": (if .Severity == "CRITICAL" then "BLOCKER" else .Severity end),
                        "type": "VULNERABILITY",
                        "primaryLocation": {
                            "message": .Description,
                            "filePath": .PkgPath,
                            "textRange": {
                                "startLine": 1,
                                "endLine": 1
                            }
                        }
                    }]' > trivy-sonarqube.json
                    '''
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    // Ensure SonarQube Scanner is installed and available
                    def scannerHome = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    withEnv(["PATH+SONAR=${scannerHome}/bin"]) {
                        sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=sample_project \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_AUTH_TOKEN \
                            -Dsonar.exclusions=node_modules/**,dist/**,coverage/** \
                            -Dsonar.externalIssuesReportPaths=trivy-sonarqube.json
                        '''
                    }
                }
            }
        }
        
        stage('Publish Trivy Report') {
            steps {
                script {
                    // Convert JSON to HTML for better visibility
                    sh '''
                    cat trivy-report.json | jq '.' > trivy-report.html
                    '''

                    publishHTML(target: [
                        reportDir: '',
                        reportFiles: 'trivy-report.html',
                        reportName: 'Trivy Security Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'trivy-report.json', fingerprint: true
        }
    }
}
