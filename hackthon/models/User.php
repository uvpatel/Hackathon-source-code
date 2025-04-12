<?php

require_once __DIR__ . '/../config/database.php';

class User {
    private $db;
    private $id;
    private $username;
    private $email;
    private $password_hash;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function register($username, $email, $password) {
        // Check if user already exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        
        if ($stmt->rowCount() > 0) {
            return false;
        }

        // Create new user
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
        return $stmt->execute([$username, $email, $password_hash]);
    }

    public function login($username, $password) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $this->id = $user['id'];
            $this->username = $user['username'];
            $this->email = $user['email'];
            return true;
        }
        return false;
    }

    public function getProfile() {
        if (!$this->id) return null;
        
        $stmt = $this->db->prepare("SELECT * FROM profiles WHERE user_id = ?");
        $stmt->execute([$this->id]);
        return $stmt->fetch();
    }

    public function updateProfile($data) {
        if (!$this->id) return false;

        $stmt = $this->db->prepare("
            INSERT INTO profiles (user_id, full_name, education_level, current_occupation, years_experience)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            full_name = VALUES(full_name),
            education_level = VALUES(education_level),
            current_occupation = VALUES(current_occupation),
            years_experience = VALUES(years_experience)
        ");

        return $stmt->execute([
            $this->id,
            $data['full_name'],
            $data['education_level'],
            $data['current_occupation'],
            $data['years_experience']
        ]);
    }

    public function getId() {
        return $this->id;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getEmail() {
        return $this->email;
    }
} 