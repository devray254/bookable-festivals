
<?php
// Set headers for JSON response
header('Content-Type: application/json');

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Validate request data
if (!isset($data['sql'])) {
    http_response_code(400);
    echo json_encode(['message' => 'SQL query is required']);
    exit;
}

// Get SQL and parameters from request
$sql = $data['sql'];
$params = $data['params'] ?? [];

try {
    // Include database configuration
    require_once 'db-config.php';
    
    // Prepare and execute the query
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        throw new Exception($conn->error);
    }
    
    // Bind parameters if they exist
    if (!empty($params)) {
        // Generate types string (s for string, i for integer, d for double)
        $types = '';
        $bindParams = [];
        
        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= 'i';
            } elseif (is_float($param)) {
                $types .= 'd';
            } else {
                $types .= 's';
            }
            $bindParams[] = $param;
        }
        
        // Only bind parameters if we have any
        if (!empty($types)) {
            // Create a references array for bind_param
            $bindParamsRef = [];
            $bindParamsRef[] = $types;
            
            for ($i = 0; $i < count($bindParams); $i++) {
                $bindParamsRef[] = &$bindParams[$i];
            }
            
            // Call bind_param with the dynamically created references
            call_user_func_array([$stmt, 'bind_param'], $bindParamsRef);
        }
    }
    
    // Execute the statement
    $stmt->execute();
    
    // Get the result
    $result = $stmt->get_result();
    
    // Handle different query types
    if ($result) {
        // SELECT query
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        echo json_encode(['result' => $rows]);
    } else {
        // INSERT, UPDATE, DELETE query
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'result' => [
                    'affectedRows' => $stmt->affected_rows,
                    'insertId' => $stmt->insert_id
                ]
            ]);
        } else {
            echo json_encode(['result' => []]);
        }
    }
    
    // Close statement
    $stmt->close();
    
} catch (Exception $e) {
    // Handle errors
    http_response_code(500);
    echo json_encode([
        'message' => 'Query execution failed: ' . $e->getMessage()
    ]);
}

// Close connection
$conn->close();
?>
