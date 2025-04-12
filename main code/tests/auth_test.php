<?php
// Test script for authentication system
echo "Starting authentication system tests...\n\n";

// Test data
$testUser = [
    'first_name' => 'Test',
    'last_name' => 'User',
    'email' => 'test@example.com',
    'password' => 'Test@123'
];

// Function to make API requests
function makeRequest($url, $data) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'response' => json_decode($response, true)
    ];
}

// Test Signup
echo "Testing Signup...\n";
$signupResponse = makeRequest('http://localhost/hackathon/hackathon2/api/auth.php', [
    'action' => 'signup',
    'first_name' => $testUser['first_name'],
    'last_name' => $testUser['last_name'],
    'email' => $testUser['email'],
    'password' => $testUser['password']
]);

if ($signupResponse['code'] === 201) {
    echo "✅ Signup successful!\n";
    echo "Response: " . json_encode($signupResponse['response'], JSON_PRETTY_PRINT) . "\n\n";
} else {
    echo "❌ Signup failed!\n";
    echo "Status code: " . $signupResponse['code'] . "\n";
    echo "Response: " . json_encode($signupResponse['response'], JSON_PRETTY_PRINT) . "\n\n";
}

// Test Login with correct credentials
echo "Testing Login with correct credentials...\n";
$loginResponse = makeRequest('http://localhost/hackathon/hackathon2/api/auth.php', [
    'action' => 'login',
    'email' => $testUser['email'],
    'password' => $testUser['password']
]);

if ($loginResponse['code'] === 200) {
    echo "✅ Login successful!\n";
    echo "Response: " . json_encode($loginResponse['response'], JSON_PRETTY_PRINT) . "\n\n";
} else {
    echo "❌ Login failed!\n";
    echo "Status code: " . $loginResponse['code'] . "\n";
    echo "Response: " . json_encode($loginResponse['response'], JSON_PRETTY_PRINT) . "\n\n";
}

// Test Login with incorrect password
echo "Testing Login with incorrect password...\n";
$wrongLoginResponse = makeRequest('http://localhost/hackathon/hackathon2/api/auth.php', [
    'action' => 'login',
    'email' => $testUser['email'],
    'password' => 'WrongPassword123'
]);

if ($wrongLoginResponse['code'] === 401) {
    echo "✅ Login with wrong password correctly rejected!\n";
    echo "Response: " . json_encode($wrongLoginResponse['response'], JSON_PRETTY_PRINT) . "\n\n";
} else {
    echo "❌ Login with wrong password not properly handled!\n";
    echo "Status code: " . $wrongLoginResponse['code'] . "\n";
    echo "Response: " . json_encode($wrongLoginResponse['response'], JSON_PRETTY_PRINT) . "\n\n";
}

// Test Signup with existing email
echo "Testing Signup with existing email...\n";
$duplicateSignupResponse = makeRequest('http://localhost/hackathon/hackathon2/api/auth.php', [
    'action' => 'signup',
    'first_name' => $testUser['first_name'],
    'last_name' => $testUser['last_name'],
    'email' => $testUser['email'],
    'password' => $testUser['password']
]);

if ($duplicateSignupResponse['code'] === 400) {
    echo "✅ Duplicate email signup correctly rejected!\n";
    echo "Response: " . json_encode($duplicateSignupResponse['response'], JSON_PRETTY_PRINT) . "\n\n";
} else {
    echo "❌ Duplicate email signup not properly handled!\n";
    echo "Status code: " . $duplicateSignupResponse['code'] . "\n";
    echo "Response: " . json_encode($duplicateSignupResponse['response'], JSON_PRETTY_PRINT) . "\n\n";
}

echo "Authentication system tests completed!\n";
?> 