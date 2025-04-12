<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Load environment variables (you'll need to create a .env file)
require_once 'vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Get API key from environment variable
$apiKey = $_ENV['GEMINI_API_KEY'];

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get the raw POST data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['message'])) {
            throw new Exception('No message provided');
        }

        // Prepare the request to Gemini API
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" . $apiKey;
        
        // System prompt for career advice
        $systemPrompt = "You are an AI Career Advisor specializing in helping people find their ideal career paths. 
        You have expertise in:
        - Career path recommendations based on skills and interests
        - Technical and soft skill assessment
        - Resume and interview preparation
        - Industry trends and job market insights
        - Professional development guidance
        
        Always provide:
        1. Clear, actionable advice
        2. Specific examples when possible
        3. Empathetic and encouraging tone
        4. Relevant resources or next steps
        5. Professional and formal language
        
        Focus on helping users discover and achieve their career goals while being realistic about requirements and expectations.";
        
        $requestData = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $systemPrompt . "\n\nUser: " . $data['message'] . "\n\nAssistant: "]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'topK' => 40,
                'topP' => 0.95,
                'maxOutputTokens' => 1024,
            ],
            'safetySettings' => [
                [
                    'category' => 'HARM_CATEGORY_HARASSMENT',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                ],
                [
                    'category' => 'HARM_CATEGORY_HATE_SPEECH',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                ],
                [
                    'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                ],
                [
                    'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                ]
            ]
        ];

        // Make the API call
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);

        $response = curl_exec($ch);
        
        if (curl_errno($ch)) {
            throw new Exception('Curl error: ' . curl_error($ch));
        }

        curl_close($ch);

        // Parse and return the response
        $responseData = json_decode($response, true);
        
        if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
            echo json_encode([
                'success' => true,
                'response' => $responseData['candidates'][0]['content']['parts'][0]['text']
            ]);
        } else {
            throw new Exception('Invalid response from Gemini API');
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
} 