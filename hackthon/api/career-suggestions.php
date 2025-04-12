<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Profile.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Google\Cloud\AIPlatform\V1\PredictionServiceClient;
use Google\Cloud\AIPlatform\V1\PredictRequest;
use Google\Cloud\AIPlatform\V1\PredictResponse;

header('Content-Type: application/json');

// Verify JWT token
function verifyToken() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided']);
        exit;
    }

    $token = str_replace('Bearer ', '', $headers['Authorization']);
    
    try {
        $decoded = JWT::decode($token, $_ENV['JWT_SECRET'], ['HS256']);
        return $decoded->data;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle different request methods
switch ($method) {
    case 'POST':
        $user = verifyToken();
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['message'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No message provided']);
            exit;
        }

        // Initialize Gemini API client
        $client = new PredictionServiceClient([
            'credentials' => json_decode($_ENV['GEMINI_API_KEY'], true)
        ]);

        // Get user profile and skills
        $profile = new Profile($user->user_id);
        $skills = $profile->getSkills();
        $userProfile = $profile->getProfile();

        // Prepare context for Gemini
        $context = "User Profile:\n";
        $context .= "Education Level: " . $userProfile['education_level'] . "\n";
        $context .= "Current Occupation: " . $userProfile['current_occupation'] . "\n";
        $context .= "Years of Experience: " . $userProfile['years_experience'] . "\n\n";
        
        $context .= "User Skills:\n";
        foreach ($skills as $skill) {
            $context .= "- " . $skill['name'] . " (Level " . $skill['proficiency_level'] . ")\n";
        }

        // Prepare prompt for Gemini
        $prompt = $context . "\nUser Question: " . $data['message'] . "\n\nProvide a detailed career suggestion based on the user's profile and skills.";

        try {
            // Call Gemini API
            $request = new PredictRequest();
            $request->setEndpoint('projects/your-project/locations/global/publishers/google/models/gemini-pro');
            $request->setInstances([['content' => $prompt]]);
            
            $response = $client->predict($request);
            $suggestion = $response->getPredictions()[0]['content'];

            // Save suggestion to database
            $profile->addCareerSuggestion($suggestion, 0.8); // Assuming confidence score of 0.8
            $profile->addChatMessage($data['message'], true);
            $profile->addChatMessage($suggestion, false);

            http_response_code(200);
            echo json_encode([
                'suggestion' => $suggestion,
                'confidence_score' => 0.8
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to get career suggestion: ' . $e->getMessage()]);
        }
        break;

    case 'GET':
        $user = verifyToken();
        $profile = new Profile($user->user_id);
        
        $suggestions = $profile->getCareerSuggestions();
        $chatHistory = $profile->getChatHistory();

        http_response_code(200);
        echo json_encode([
            'suggestions' => $suggestions,
            'chat_history' => $chatHistory
        ]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
} 