<?php
// Velocity Movers Vendor Calculation Logic and Rules Display
// All logic and display for Velocity Movers is here, not in the main plugin file.

if (!defined('ABSPATH')) exit;

// Official Velocity Movers rules (for display)
function velocity_vendor_rules_text() {
    return <<<EOT
Velocity Movers Residential Price List

Hourly Rate
- Two Movers: $150.00/hr
- Each Additional Mover: $40.00/hr

Truck Fee
- Priced accordingly within GTA (Truck | Mileage | Fuel Cost)

Consumable Fee
- Moving Blankets, Shrink Wrap, Tape, Floor Runners, Shoe Covers, Dollies, Straps, Tools, Equipment

Storage | Warehouse Solutions
- $3.00/sqft floor space
- $60.00 - $100.00 per skid/crate

Disposal Services
- Handling Fee: $200.00 + Disposal Cost

White Glove Service
- Two Movers: $160.00/hr
- Each Additional Mover: $60.00/hr

Billing Details
- Billing is based on an hourly rate basis.
- Hourly rates are billed from arrival at pickup location to completion of unloading at drop-off location.
- 3 hour minimum on booked moves.

Partner Commission
- 10% commission on booked moves.

Service Area
- GTA and surrounding areas, or moves between Toronto area and Ontario (the closer the better).
EOT;
}

// Calculation logic for Velocity Movers
function velocity_calc_php($input, $travel_time_minutes, $distance_km, $truck_drive_time_minutes = null) {
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
    
    // Check 10-hour travel time limit
    $travel_time_hours = $car_drive_time_minutes / 60.0;
    if ($travel_time_hours > 10) {
        return [
            'special_message' => "This is a long-distance move. We'd love to help! Please call us at +1-XXX-XXX-XXX for a custom quote, or we can schedule a meeting with our agent at your convenience.",
            'travel_time_hours' => $travel_time_hours,
            'max_allowed_hours' => 10
        ];
    }
    
    // Official Velocity Movers weight/hours table (from image)
    $VELOCITY_TABLE = [
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
    function velocity_estimate_weight($input) {
        if (!empty($input['estimated_weight_lbs'])) return $input['estimated_weight_lbs'];
        // Map rooms to weight more accurately
        $room_to_weight = [1=>1000, 2=>2000, 3=>3000, 4=>4000, 5=>5000, 6=>6000];
        if (!empty($input['total_rooms']) && isset($room_to_weight[$input['total_rooms']])) return $room_to_weight[$input['total_rooms']];
        return 4000;
    }
    function velocity_get_table_row($weight, $table) {
        foreach ($table as $row) {
            if ($weight >= $row[0] && $weight <= $row[1]) return $row;
        }
        return $table[count($table)-1];
    }
    $weight = velocity_estimate_weight($input);
    $row = velocity_get_table_row($weight, $VELOCITY_TABLE);
    $crew = $row[2];
    $truck = $row[3];
    if ($weight >= 6000) $truck = 2;
    $hours = $row[4];
    // Dynamic truck fee
    $truck_fee = ($truck == 2) ? 250 : 200;
    // Enforce 3-hour minimum (labor + travel)
    $travel_time_hours = $car_drive_time_minutes / 60.0;
    $total_billable_hours = max($hours + $travel_time_hours, 3);
    $hourly_rate = 150 + ($crew - 2) * 40;
    $labor_cost = $total_billable_hours * $hourly_rate;
    // Fuel charge as before
    $fuel_charge = 0;
    if ($travel_time_hours > 1.75) {
        $fuel_charge = 50 + ($travel_time_hours - 1.75) * 25;
    }
    // Heavy item and extra fees as before
    $heavy_item_fees = 0;
    $heavy_items_list = [];
    if (!empty($input['has_piano'])) {
        $heavy_item_fees += 300;
        $heavy_items_list[] = 'Piano ($300)';
    }
    if (!empty($input['has_safe'])) {
        $heavy_item_fees += 250;
        $heavy_items_list[] = 'Safe ($250)';
    }
    if (!empty($input['has_treadmill'])) {
        $heavy_item_fees += 150;
        $heavy_items_list[] = 'Treadmill ($150)';
    }
    if (!empty($input['has_pool_table'])) {
        $heavy_item_fees += 400;
        $heavy_items_list[] = 'Pool Table ($400)';
    }
    $consumable_fee = !empty($input['requires_consumables']) ? 50 : 0;
    $storage_fee = !empty($input['requires_storage']) ? 100 : 0;
    $disposal_fee = !empty($input['requires_disposal']) ? 200 : 0;
    $total = $labor_cost + $truck_fee + $fuel_charge + $heavy_item_fees + $consumable_fee + $storage_fee + $disposal_fee;
    return [
        'num_movers' => $crew,
        'num_trucks' => $truck,
        'crew_hourly_rate' => $hourly_rate,
        'base_labor_hours' => $hours,
        'labor_hours' => $hours,
        'labor_cost' => $labor_cost,
        'truck_fee' => $truck_fee,
        'travel_time_hours' => $travel_time_hours,
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

// Return an array of all possible extra services and whether Velocity Movers supports them
function velocity_supported_services() {
    return [
        'Packing' => false,
        'Storage' => true,
        'Cleaning' => false,
        'Junk Removal' => true,
        'Special/High Value Items' => true,
        'Special Handling' => true,
        'Basic Move' => true,
        'White Glove Service' => true,
    ];
}

// Output a detailed step-by-step explanation of the calculation
function velocity_calculation_steps_html($input, $breakdown) {
    $steps = [];
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
    $steps[] = '1. <b>Crew Size:</b> ' . $breakdown['num_movers'] . ' movers, $' . $breakdown['crew_hourly_rate'] . '/hr.';
    $steps[] = '2. <b>Labor:</b> ' . $breakdown['base_labor_hours'] . ' hours x $' . $breakdown['crew_hourly_rate'] . ' = <b>$' . $breakdown['labor_cost'] . '</b>.';
    $steps[] = '3. <b>Truck Fee:</b> $' . $breakdown['truck_fee'] . ' (set by dispatcher/admin for each move).';
    $steps[] = '4. <b>Travel Time Fee:</b> $' . $breakdown['travel_fee'] . ' (calculated based on travel time).';
    $steps[] = '5. <b>Total:</b> Labor + Truck + Travel Time = <b>$' . $breakdown['total'] . '</b>.';
    $html = '<div style="background:#f4f8ff;padding:16px 22px;border-radius:8px;margin-top:24px;max-width:800px;border:1px solid #cce0ff;">';
    $html .= '<h3 style="margin-top:0;color:#0056b3;">Calculation Steps</h3>';
    $html .= '<ol style="font-size:15px;line-height:1.7;">';
    foreach ($steps as $s) $html .= '<li>' . $s . '</li>';
    $html .= '</ol>';
    $html .= '</div>';
    return $html;
}

// Display rules and calculator explanation for Velocity Movers
function velocity_vendor_explanation_html() {
    $rules = velocity_vendor_rules_text();
    $html = '<div style="background:#f8f9fa;padding:18px 24px;border-radius:8px;margin-top:30px;max-width:800px;">';
    $html .= '<h2>Velocity Movers Official Rules (Vendor)</h2>';
    $html .= '<pre style="white-space:pre-wrap;font-size:15px;">' . esc_html($rules) . '</pre>';
    $html .= '<h2>How Our Calculator Works</h2>';
    $html .= '<ul style="font-size:15px;line-height:1.7;">';
    $html .= '<li>Determines crew size from house size/rooms.</li>';
    $html .= '<li>Applies the official hourly rates and minimum hours.</li>';
    $html .= '<li>Adds the truck fee as set by dispatcher/admin for each move.</li>';
    $html .= '<li>Adds the travel time fee based on travel time.</li>';
    $html .= '<li>Returns a full breakdown and total, matching the vendor\'s official rules.</li>';
    $html .= '</ul>';
    $html .= '</div>';
    return $html;
}

// Display a warning for unsupported services if present in the input
function velocity_unsupported_services_html($input) {
    $unsupported_services = [];
    if (!empty($input['requires_packing'])) $unsupported_services[] = 'Packing';
    if (!empty($input['requires_cleaning'])) $unsupported_services[] = 'Cleaning';
    if (!empty($input['requires_junk_removal'])) $unsupported_services[] = 'Junk Removal';
    if (!empty($input['high_value_items'])) $unsupported_services[] = 'Special/High Value Items';
    if (!empty($input['special_handling_required'])) $unsupported_services[] = 'Special Handling';
    if (count($unsupported_services) === 0) return '';
    $html = '<div style="background:#fff3cd;padding:16px 22px;border-radius:8px;margin-top:24px;max-width:800px;border:1px solid #ffeeba;">';
    $html .= '<h3 style="margin-top:0;color:#856404;">Unavailable Services for Velocity Movers</h3>';
    $html .= '<ul style="font-size:15px;line-height:1.7;">';
    foreach ($unsupported_services as $svc) {
        $html .= '<li>' . esc_html($svc) . ' <b style="color:#b94a48;">Not offered by Velocity Movers</b></li>';
    }
    $html .= '</ul>';
    $html .= '<div style="color:#856404;font-size:14px;">If you require any of these services, please choose a different vendor.</div>';
    $html .= '</div>';
    return $html;
} 