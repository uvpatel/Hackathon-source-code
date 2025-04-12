<?php
namespace App\Services;

use Google\GenerativeAI\GenerativeModel;
use Google\GenerativeAI\Client;

class GeminiService {
    private $model;

    public function __construct() {
        $client = new Client($_ENV['GEMINI_API_KEY']);
        $this->model = new GenerativeModel($client, 'gemini-pro');
    }

    public function generateCareerSuggestions(array $userProfile) {
        $prompt = $this->buildPrompt($userProfile);
        
        try {
            $response = $this->model->generateContent($prompt);
            return $this->formatResponse($response->text());
        } catch (\Exception $e) {
            throw new \Exception("Failed to generate career suggestions: " . $e->getMessage());
        }
    }

    private function buildPrompt(array $userProfile) {
        return "Given the following user profile, provide 3 ideal career paths with detailed explanations:
        
        Skills and Ratings:
        " . $this->formatSkills($userProfile['skills']) . "
        
        Career Interests: " . implode(', ', $userProfile['interests']) . "
        Education Level: " . $userProfile['education'] . "
        Experience: " . $userProfile['experience'] . "
        Location Preference: " . $userProfile['location'] . "
        
        Please provide:
        1. Three suitable career paths
        2. Required skills for each path
        3. Potential salary ranges
        4. Growth opportunities
        5. Recommended next steps
        
        Format the response in a clear, structured manner.";
    }

    private function formatSkills(array $skills) {
        $formatted = "";
        foreach ($skills as $skill => $rating) {
            $formatted .= "- $skill: $rating/5\n";
        }
        return $formatted;
    }

    private function formatResponse(string $response) {
        // Split the response into sections
        $sections = explode("\n\n", $response);
        
        $formatted = [
            'career_paths' => [],
            'summary' => ''
        ];

        foreach ($sections as $section) {
            if (strpos($section, 'Career Path') !== false) {
                $formatted['career_paths'][] = $this->parseCareerPath($section);
            } else {
                $formatted['summary'] .= $section . "\n\n";
            }
        }

        return $formatted;
    }

    private function parseCareerPath(string $section) {
        $lines = explode("\n", $section);
        $path = [
            'title' => '',
            'skills' => [],
            'salary' => '',
            'growth' => '',
            'steps' => []
        ];

        foreach ($lines as $line) {
            if (strpos($line, 'Title:') !== false) {
                $path['title'] = trim(str_replace('Title:', '', $line));
            } elseif (strpos($line, 'Skills:') !== false) {
                $path['skills'] = explode(',', trim(str_replace('Skills:', '', $line)));
            } elseif (strpos($line, 'Salary:') !== false) {
                $path['salary'] = trim(str_replace('Salary:', '', $line));
            } elseif (strpos($line, 'Growth:') !== false) {
                $path['growth'] = trim(str_replace('Growth:', '', $line));
            } elseif (strpos($line, 'Steps:') !== false) {
                $path['steps'] = explode("\n- ", trim(str_replace('Steps:', '', $line)));
            }
        }

        return $path;
    }
} 