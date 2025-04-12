<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($data->action)) {
        switch ($data->action) {
            case 'signup':
                // Signup logic
                if (!empty($data->first_name) && !empty($data->last_name) && 
                    !empty($data->email) && !empty($data->password)) {
                    
                    $user->first_name = $data->first_name;
                    $user->last_name = $data->last_name;
                    $user->email = $data->email;
                    $user->password = $data->password;

                    if ($user->emailExists()) {
                        http_response_code(400);
                        echo json_encode(array("message" => "Email already exists."));
                        exit;
                    }

                    if ($user->create()) {
                        http_response_code(201);
                        echo json_encode(array(
                            "message" => "User was created successfully.",
                            "user" => array(
                                "id" => $user->id,
                                "first_name" => $user->first_name,
                                "last_name" => $user->last_name,
                                "email" => $user->email
                            )
                        ));
                    } else {
                        http_response_code(503);
                        echo json_encode(array("message" => "Unable to create user."));
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
                }
                break;

            case 'login':
                // Login logic
                if (!empty($data->email) && !empty($data->password)) {
                    $user->email = $data->email;
                    
                    if ($user->emailExists() && $user->validatePassword($data->password)) {
                        http_response_code(200);
                        echo json_encode(array(
                            "message" => "Login successful.",
                            "user" => array(
                                "id" => $user->id,
                                "first_name" => $user->first_name,
                                "last_name" => $user->last_name,
                                "email" => $user->email
                            )
                        ));
                    } else {
                        http_response_code(401);
                        echo json_encode(array("message" => "Login failed. Invalid credentials."));
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
                }
                break;

            default:
                http_response_code(400);
                echo json_encode(array("message" => "Invalid action."));
                break;
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Action is required."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?> 