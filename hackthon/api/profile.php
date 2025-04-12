<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Profile.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;

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
    case 'GET':
        $user = verifyToken();
        $profile = new Profile($user->user_id);
        
        $userProfile = $profile->getProfile();
        $skills = $profile->getSkills();
        $allSkills = Profile::getAllSkills();

        http_response_code(200);
        echo json_encode([
            'profile' => $userProfile,
            'skills' => $skills,
            'available_skills' => $allSkills
        ]);
        break;

    case 'POST':
        $user = verifyToken();
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['action'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No action specified']);
            exit;
        }

        switch ($data['action']) {
            case 'update_profile':
                if (!isset($data['profile'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'No profile data provided']);
                    exit;
                }

                $userModel = new User();
                if ($userModel->updateProfile($data['profile'])) {
                    http_response_code(200);
                    echo json_encode(['message' => 'Profile updated successfully']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to update profile']);
                }
                break;

            case 'update_skills':
                if (!isset($data['skills'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'No skills data provided']);
                    exit;
                }

                $profile = new Profile($user->user_id);
                if ($profile->updateSkills($data['skills'])) {
                    http_response_code(200);
                    echo json_encode(['message' => 'Skills updated successfully']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to update skills']);
                }
                break;

            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
} 