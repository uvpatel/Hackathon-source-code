<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;

header('Content-Type: application/json');

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle different request methods
switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'register':
                    if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Missing required fields']);
                        exit;
                    }

                    $user = new User();
                    if ($user->register($data['username'], $data['email'], $data['password'])) {
                        http_response_code(201);
                        echo json_encode(['message' => 'User registered successfully']);
                    } else {
                        http_response_code(400);
                        echo json_encode(['error' => 'Username or email already exists']);
                    }
                    break;

                case 'login':
                    if (!isset($data['username']) || !isset($data['password'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Missing username or password']);
                        exit;
                    }

                    $user = new User();
                    if ($user->login($data['username'], $data['password'])) {
                        // Generate JWT token
                        $token = [
                            'iat' => time(),
                            'exp' => time() + $_ENV['JWT_EXPIRATION'],
                            'data' => [
                                'user_id' => $user->getId(),
                                'username' => $user->getUsername(),
                                'email' => $user->getEmail()
                            ]
                        ];

                        $jwt = JWT::encode($token, $_ENV['JWT_SECRET'], 'HS256');
                        
                        http_response_code(200);
                        echo json_encode([
                            'message' => 'Login successful',
                            'token' => $jwt,
                            'user' => [
                                'id' => $user->getId(),
                                'username' => $user->getUsername(),
                                'email' => $user->getEmail()
                            ]
                        ]);
                    } else {
                        http_response_code(401);
                        echo json_encode(['error' => 'Invalid credentials']);
                    }
                    break;

                default:
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid action']);
                    break;
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No action specified']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
} 