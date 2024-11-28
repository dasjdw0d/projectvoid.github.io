<?php
header('Content-Type: application/json');

function getTopGames($limit = 3) {
    $dataFile = __DIR__ . '/../data/game_visits.txt';
    
    if (!file_exists($dataFile)) {
        return [];
    }

    // Read and parse the data
    $visits = array_filter(explode("\n", file_get_contents($dataFile)));
    $visitsArray = [];
    
    foreach ($visits as $visit) {
        list($game, $count) = explode(':', $visit);
        $visitsArray[trim($game)] = (int)$count;
    }

    // Sort by visits (descending)
    arsort($visitsArray);

    // Get top games with proper ranking
    $result = [];
    $rank = 0;
    $lastVisits = null;
    $count = 0;
    
    foreach ($visitsArray as $game => $visits) {
        if ($count >= $limit) break;
        
        if ($lastVisits !== $visits) {
            $rank = $count + 1;
        }
        
        $result[] = [
            'rank' => $rank,
            'title' => $game,
            'visits' => $visits
        ];
        
        $lastVisits = $visits;
        $count++;
    }
    
    return $result;
}

echo json_encode(getTopGames()); 