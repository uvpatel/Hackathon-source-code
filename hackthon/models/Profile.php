<?php

require_once __DIR__ . '/../config/database.php';

class Profile {
    private $db;
    private $user_id;

    public function __construct($user_id) {
        $this->db = Database::getInstance()->getConnection();
        $this->user_id = $user_id;
    }

    public function getSkills() {
        $stmt = $this->db->prepare("
            SELECT s.*, us.proficiency_level 
            FROM skills s
            JOIN user_skills us ON s.id = us.skill_id
            WHERE us.user_id = ?
        ");
        $stmt->execute([$this->user_id]);
        return $stmt->fetchAll();
    }

    public function updateSkills($skills) {
        // Start transaction
        $this->db->beginTransaction();

        try {
            // Delete existing skills
            $stmt = $this->db->prepare("DELETE FROM user_skills WHERE user_id = ?");
            $stmt->execute([$this->user_id]);

            // Insert new skills
            $stmt = $this->db->prepare("INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES (?, ?, ?)");
            
            foreach ($skills as $skill) {
                $stmt->execute([
                    $this->user_id,
                    $skill['skill_id'],
                    $skill['proficiency_level']
                ]);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }

    public function getCareerSuggestions() {
        $stmt = $this->db->prepare("
            SELECT * FROM career_suggestions 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$this->user_id]);
        return $stmt->fetchAll();
    }

    public function addCareerSuggestion($suggestion, $confidence_score) {
        $stmt = $this->db->prepare("
            INSERT INTO career_suggestions (user_id, suggestion, confidence_score)
            VALUES (?, ?, ?)
        ");
        return $stmt->execute([$this->user_id, $suggestion, $confidence_score]);
    }

    public function getChatHistory() {
        $stmt = $this->db->prepare("
            SELECT * FROM chat_history 
            WHERE user_id = ? 
            ORDER BY created_at ASC
        ");
        $stmt->execute([$this->user_id]);
        return $stmt->fetchAll();
    }

    public function addChatMessage($message, $is_user) {
        $stmt = $this->db->prepare("
            INSERT INTO chat_history (user_id, message, is_user)
            VALUES (?, ?, ?)
        ");
        return $stmt->execute([$this->user_id, $message, $is_user]);
    }

    public static function getAllSkills() {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM skills ORDER BY category, name");
        $stmt->execute();
        return $stmt->fetchAll();
    }
} 