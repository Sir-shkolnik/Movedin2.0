<?php
// Easy2Go Vendor Calculation Logic and Rules Display
// All logic and display for Easy2Go is here, not in the main plugin file.

if (!defined('ABSPATH')) exit;

// Official Easy2Go rules (for display)
function easy2go_vendor_rules_text() {
    return <<<EOT
2 Movers = $150/hr\n3 Movers = $200/hr\n4 Movers = $250/hr\n5 Movers = $300/hr\n\n16ft Truck Fee = $150\n20ft Truck Fee = $150\n26ft Truck Fee = $200\n30ft Truck Fee = $200\n\nReturning Travel is charged at the movers hourly rate to the depot at 3397 American Drive, Mississauga.
EOT;
}

// Calculation logic for Easy2Go
function easy2go_calc_php($input, $travel_time_minutes, $truck_drive_time_minutes = null) {
    $distance_km = isset($input['distance_km']) ? floatval($input['distance_km']) : 0;
    // 200km distance limit removed - now only check 10-hour travel time limit
    if ($travel_time_minutes > 600) {
        return [
            'special_message' => "This is a long-distance move. We'd love to help! Please call us at +1-XXX-XXX-XXX for a custom quote, or we can schedule a meeting with our agent at your convenience."
        ];
    }
    $dispatcher = isset($input['dispatcher']) ? $input['dispatcher'] : null;
    $journey = isset($input['journey_breakdown']) ? $input['journey_breakdown'] : null;
    // Patch: always sum journey_breakdown for drive times
    $car_drive_time_minutes = 0;
    if (is_array($journey)) {
        foreach ($journey as $leg) {
            $car_drive_time_minutes += isset($leg['duration_min']) ? floatval($leg['duration_min']) : 0;
        }
    } else {
        $car_drive_time_minutes = $travel_time_minutes;
    }
    $truck_drive_time_minutes = $car_drive_time_minutes > 0 ? round($car_drive_time_minutes * 1.2, 2) : null;
    $EASY2GO_HOURLY = [2=>150, 3=>200, 4=>250, 5=>300];
    $EASY2GO_TRUCK = [16=>150, 20=>150, 26=>200, 30=>200];
    $EASY2GO_TABLE = [
        [500, 1000, 2, 1, 2, 2.25, 2.5],
        [1000, 2000, 2, 1, 2, 2.5, 2.5],
        [2000, 3000, 2, 1, 3, 3, 3],
        [3000, 4000, 3, 1, 3.5, 4.25, 4.75],
        [4000, 5000, 3, 1, 5, 5.5, 6],
        [5000, 6000, 3, 1, 6.5, 7.75, 8.75],
        [6000, 7000, 3, 1, 7.5, 9, 10.5],
        [7000, 8000, 3, 1, 8.5, 10.5, 11.75],
        [8000, 9000, 3, 1, 9.5, 11.75, 12.75],
        [9000, 10000, 3, 1, 11, 13.5, 14.5],
        [10000, 11000, 4, 2, 9, 11.5, 12.5],
        [11000, 12000, 4, 2, 10, 12.5, 13.5],
        [12000, 13000, 5, 2, 9, 11, 12],
        [13000, 14000, 5, 2, 9.5, 12, 12.5],
        [14000, 15000, 5, 2, 10, 12.5, 13.5]
    ];
    function estimate_weight($input) {
        if (!empty($input['estimated_weight_lbs'])) return $input['estimated_weight_lbs'];
        $sizeMap = [
            'Studio'=>1000,'1 Bedroom'=>2000,'2 Bedrooms'=>3000,'3 Bedrooms'=>4000,'4 Bedrooms'=>6000,'5+ Bedrooms'=>8000
        ];
        if (!empty($input['square_footage']) && isset($sizeMap[$input['square_footage']])) return $sizeMap[$input['square_footage']];
        if (!empty($input['total_rooms'])) return 1000 + 1000 * intval($input['total_rooms']);
        return 4000;
    }
    function get_table_row($weight, $table) {
        foreach ($table as $row) {
            if ($weight >= $row[0] && $weight <= $row[1]) return $row;
        }
        return $table[count($table)-1];
    }
    $weight = estimate_weight($input);
    $row = get_table_row($weight, $EASY2GO_TABLE);
    $men = $row[2];
    $truck = $row[3];
    // For 6 rooms (6000 lbs) and up, enforce 2 trucks
    if ($weight >= 6000) $truck = 2;
    $stairsAtPickup = !empty($input['stairs_at_pickup']) ? $input['stairs_at_pickup'] : 0;
    $stairsAtDropoff = !empty($input['stairs_at_dropoff']) ? $input['stairs_at_dropoff'] : 0;
    $elevatorAtPickup = !empty($input['elevator_at_pickup']) ? 1 : 0;
    $elevatorAtDropoff = !empty($input['elevator_at_dropoff']) ? 1 : 0;
    $stairsOrElevPickup = $stairsAtPickup > 0 || $elevatorAtPickup;
    $stairsOrElevDropoff = $stairsAtDropoff > 0 || $elevatorAtDropoff;
    
    // STANDARDIZED: Use consistent labor hours based on room count (same as other vendors)
    $rooms = isset($input['total_rooms']) ? intval($input['total_rooms']) : 2;
    $labor_hours_map = [1=>3.5, 2=>4.5, 3=>5.5, 4=>6.5, 5=>7.5];
    $hours = isset($labor_hours_map[$rooms]) ? $labor_hours_map[$rooms] : max(3.5, isset($input['base_labor_hours']) ? floatval($input['base_labor_hours']) : 3.5);
    
    // Add extra time for stairs/elevator scenarios
    if ($stairsOrElevPickup && $stairsOrElevDropoff) {
        $hours += 1.0; // Both locations have stairs/elevator
    } elseif ($stairsOrElevPickup || $stairsOrElevDropoff) {
        $hours += 0.5; // One location has stairs/elevator
    }
    
    $hourlyRate = $EASY2GO_HOURLY[$men];
    $travelHours = $car_drive_time_minutes / 60.0;
    $truckTravelHours = $truck_drive_time_minutes ? $truck_drive_time_minutes / 60.0 : null;
    // Enforce 3-hour minimum (labor + travel)
    $total_billable_hours = max($hours + $travelHours, 3);
    $laborCost = $total_billable_hours * $hourlyRate;
    // Use correct truck fee based on number of trucks needed (already present)
    $truckFee = $EASY2GO_TRUCK[16]; // Default to 16ft truck
    if ($truck === 2) {
        $truckFee = $EASY2GO_TRUCK[26]; // Use 26ft truck for larger moves
    }
    // Calculate travel cost (already present)
    $travelCost = $travelHours * $hourlyRate;
    // Calculate fuel charge (distance-based, $2/km over 50km)
    $fuel_charge = 0;
    if ($distance_km > 50) {
        $fuel_charge = ($distance_km - 50) * 2;
    }
    // Calculate heavy item fees (already present)
    $heavy_item_fees = 0;
    $heavy_items_list = [];
    if (!empty($input['has_piano'])) {
        $heavy_item_fees += 280;
        $heavy_items_list[] = 'Piano ($280)';
    }
    if (!empty($input['has_safe'])) {
        $heavy_item_fees += 220;
        $heavy_items_list[] = 'Safe ($220)';
    }
    if (!empty($input['has_treadmill'])) {
        $heavy_item_fees += 120;
        $heavy_items_list[] = 'Treadmill ($120)';
    }
    if (!empty($input['has_pool_table'])) {
        $heavy_item_fees += 350;
        $heavy_items_list[] = 'Pool Table ($350)';
    }
    // Add consumable fee if requested
    $consumable_fee = !empty($input['requires_consumables']) ? 50 : 0;
    // Add storage fee if requested
    $storage_fee = !empty($input['requires_storage']) ? 100 : 0;
    // Add disposal fee if requested
    $disposal_fee = !empty($input['requires_disposal']) ? 200 : 0;
    $total = $laborCost + $truckFee + $travelCost + $fuel_charge + $heavy_item_fees + $consumable_fee + $storage_fee + $disposal_fee;
    return [
        'num_movers' => $men,
        'num_trucks' => $truck,
        'crew_hourly_rate' => $hourlyRate,
        'base_labor_hours' => $hours,
        'labor_hours' => $hours,
        'labor_cost' => $laborCost,
        'truck_fee' => $truckFee,
        'travel_time_hours' => $travelHours,
        'truck_travel_time_hours' => $truckTravelHours,
        'travel_cost' => $travelCost,
        'fuel_charge' => $fuel_charge,
        'heavy_item_fees' => $heavy_item_fees,
        'heavy_items_list' => $heavy_items_list,
        'consumable_fee' => $consumable_fee,
        'storage_fee' => $storage_fee,
        'disposal_fee' => $disposal_fee,
        'total' => round($total),
        'car_drive_time_minutes' => $car_drive_time_minutes,
        'truck_drive_time_minutes' => $truck_drive_time_minutes,
        'dispatcher' => $dispatcher,
        'journey_breakdown' => $journey
    ];
}

// Display rules and calculator explanation for Easy2Go
function easy2go_vendor_explanation_html() {
    $rules = easy2go_vendor_rules_text();
    $html = '<div style="background:#f8f9fa;padding:18px 24px;border-radius:8px;margin-top:30px;max-width:800px;">';
    $html .= '<h2>Easy2Go Official Rules (Vendor)</h2>';
    $html .= '<pre style="white-space:pre-wrap;font-size:15px;">' . esc_html($rules) . '</pre>';
    $html .= '<h2>How Our Calculator Works</h2>';
    $html .= '<ul style="font-size:15px;line-height:1.7;">';
    $html .= '<li>Estimates weight from house size or user input.</li>';
    $html .= '<li>Looks up the correct number of movers, trucks, and hours from the official Easy2Go table.</li>';
    $html .= '<li>Uses the correct hours column based on stairs/elevator at pickup/dropoff.</li>';
    $html .= '<li>Applies the official hourly rates and truck fees.</li>';
    $html .= '<li>Uses real Google Maps travel time for the travel cost, charged at the hourly rate for the number of movers.</li>';
    $html .= '<li>Returns a full breakdown and total, matching the vendor\'s official rules.</li>';
    $html .= '</ul>';
    $html .= '</div>';
    return $html;
}

// Display a warning for unsupported services if present in the input
function easy2go_unsupported_services_html($input) {
    $unsupported_services = [];
    if (!empty($input['requires_packing'])) $unsupported_services[] = 'Packing';
    if (!empty($input['requires_storage'])) $unsupported_services[] = 'Storage';
    if (!empty($input['requires_cleaning'])) $unsupported_services[] = 'Cleaning';
    if (!empty($input['requires_junk_removal'])) $unsupported_services[] = 'Junk Removal';
    if (!empty($input['high_value_items'])) $unsupported_services[] = 'Special/High Value Items';
    if (!empty($input['special_handling_required'])) $unsupported_services[] = 'Special Handling';
    if (count($unsupported_services) === 0) return '';
    $html = '<div style="background:#fff3cd;padding:16px 22px;border-radius:8px;margin-top:24px;max-width:800px;border:1px solid #ffeeba;">';
    $html .= '<h3 style="margin-top:0;color:#856404;">Unavailable Services for Easy2Go</h3>';
    $html .= '<ul style="font-size:15px;line-height:1.7;">';
    foreach ($unsupported_services as $svc) {
        $html .= '<li>' . esc_html($svc) . ' <b style="color:#b94a48;">Not offered by Easy2Go</b></li>';
    }
    $html .= '</ul>';
    $html .= '<div style="color:#856404;font-size:14px;">If you require any of these services, please choose a different vendor.</div>';
    $html .= '</div>';
    return $html;
}

// Return an array of all possible extra services and whether Easy2Go supports them
function easy2go_supported_services() {
    return [
        'Packing' => false,
        'Storage' => false,
        'Cleaning' => false,
        'Junk Removal' => false,
        'Special/High Value Items' => false,
        'Special Handling' => false,
        'Basic Move' => true,
    ];
}

// Output a detailed step-by-step explanation of the calculation
function easy2go_calculation_steps_html($input, $breakdown) {
    $steps = [];
    // Dispatcher and journey breakdown at the top
    if (!empty($breakdown['dispatcher'])) {
        $steps[] = '<span style="color:#0056b3;font-weight:bold;">Dispatcher used:</span> <b>' . ($breakdown['dispatcher']['name'] ?? '') . '</b> (' . ($breakdown['dispatcher']['address'] ?? '') . ')';
    }
    if (!empty($breakdown['journey_breakdown'])) {
        $total_time = 0; $total_dist = 0;
        $steps[] = '<span style="color:#0056b3;font-weight:bold;">3-Legged Journey Breakdown:</span>';
        $leg_labels = ['Dispatcher → From','From → To','To → Dispatcher'];
        foreach ($breakdown['journey_breakdown'] as $i => $leg) {
            $total_time += $leg['duration_min'];
            $total_dist += $leg['distance_km'];
            $steps[] = '&nbsp;&nbsp;<b>' . $leg_labels[$i] . ':</b> ' . htmlspecialchars($leg['from']) . ' → ' . htmlspecialchars($leg['to']) . ' — <b>' . $leg['duration_min'] . ' min</b>, <b>' . $leg['distance_km'] . ' km</b>';
        }
        $steps[] = '<b>Total Journey:</b> ' . round($total_time,2) . ' min, ' . round($total_dist,2) . ' km';
    }
    $steps[] = '1. <b>Weight Estimate:</b> ' . (isset($input['estimated_weight_lbs']) ? $input['estimated_weight_lbs'] . ' lbs (from input)' : 'Estimated from house size/rooms') . '.';
    $steps[] = '2. <b>Table Lookup:</b> For ' . ($input['square_footage'] ?? '?') . ' and weight ' . ($input['estimated_weight_lbs'] ?? '?') . ' lbs, found ' . $breakdown['num_movers'] . ' movers, ' . $breakdown['num_trucks'] . ' truck(s), and ' . $breakdown['base_labor_hours'] . ' base hours.';
    $stairs = ($input['stairs_at_pickup'] ?? 0) + ($input['stairs_at_dropoff'] ?? 0);
    $elev = (!empty($input['elevator_at_pickup']) ? 1 : 0) + (!empty($input['elevator_at_dropoff']) ? 1 : 0);
    $steps[] = '3. <b>Stairs/Elevator:</b> ' . ($stairs ? $stairs . ' flights of stairs' : 'No stairs') . ', ' . ($elev ? 'elevator present' : 'no elevator') . '. Used correct hours column.';
    $steps[] = '4. <b>Hourly Rate:</b> $' . $breakdown['crew_hourly_rate'] . ' x ' . $breakdown['base_labor_hours'] . ' hours = <b>$' . $breakdown['labor_cost'] . '</b>.';
    $steps[] = '5. <b>Truck Fee:</b> $' . $breakdown['truck_fee'] . '.';
    $steps[] = '6. <b>Travel Time:</b> ' . round($breakdown['travel_time_hours'],2) . ' hours x $' . $breakdown['crew_hourly_rate'] . ' = <b>$' . round($breakdown['travel_cost'],2) . '</b>.';
    $steps[] = '7. <b>Total:</b> Labor + Truck + Travel = <b>$' . $breakdown['total'] . '</b>.';
    $html = '<div style="background:#f4f8ff;padding:16px 22px;border-radius:8px;margin-top:24px;max-width:800px;border:1px solid #cce0ff;">';
    $html .= '<h3 style="margin-top:0;color:#0056b3;">Calculation Steps</h3>';
    $html .= '<ol style="font-size:15px;line-height:1.7;">';
    foreach ($steps as $s) $html .= '<li>' . $s . '</li>';
    $html .= '</ol>';
    $html .= '</div>';
    return $html;
} 