<?php
// Pierre & Son's Vendor Calculation Logic and Rules Display
// All logic and display for Pierre & Son's is here, not in the main plugin file.

if (!defined('ABSPATH')) exit;

// Official Pierre & Son's rules (for display)
function pierre_sons_vendor_rules_text() {
    return <<<EOT
Hourly Rate (3-hour minimum):
- $65/hr for 1 guy
- $135/hr for 2 guys
- $165/hr for 3 guys
- $195/hr for 4 guys
- $225/hr for 5 guys
- $255/hr for 6 guys

Truck Fee (one time):
- $100 (16ft) for 1-bed/1-truck, within 50km. +$1/km over 50km
- $140 (20ft) for 2-bed/2-truck, within 50km. +$1/km over 50km
- $180 (26ft) for 3-bed/3-truck, within 50km. +$1/km over 50km

Travel Time:
- Each move includes 1 hour of travel time (covers return to office)
- If >1 hour away, travel time fee matches the time it takes for the team to return to the office

Commission: 15% of total receipt for each confirmed job (for partner, not customer)
EOT;
}

// Calculation logic for Pierre & Son's Moving & Delivery
function pierre_sons_calc_php($input, $travel_time_minutes, $distance_km, $truck_drive_time_minutes = null) {
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
    
    // 200km distance limit removed - now only check 10-hour travel time limit
    
    $PIERRE_SONS_HOURLY = [1=>65, 2=>135, 3=>165, 4=>195, 5=>225, 6=>255];
    $PIERRE_SONS_TRUCK = [1=>100, 2=>140, 3=>180];
    // Determine crew size
    $rooms = isset($input['total_rooms']) ? intval($input['total_rooms']) : 2;
    $size = isset($input['square_footage']) ? $input['square_footage'] : '';
    $crew = 2;
    if ($rooms >= 6 || $size === '5+ Bedrooms') $crew = 5;
    elseif ($rooms >= 4 || $size === '4 Bedrooms') $crew = 4;
    elseif ($rooms >= 3 || $size === '3 Bedrooms') $crew = 3;
    elseif ($rooms >= 2 || $size === '2 Bedrooms') $crew = 2;
    elseif ($rooms === 1 || $size === '1 Bedroom' || $size === 'Studio') $crew = 1;
    // Minimum 2 for most moves
    if ($crew < 2) $crew = 2;
    $hourly_rate = $PIERRE_SONS_HOURLY[$crew];
    // Estimate labor hours based on rooms
    $labor_hours_map = [1=>3.5, 2=>4.5, 3=>5.5, 4=>6.5, 5=>7.5];
    $hours = isset($labor_hours_map[$rooms]) ? $labor_hours_map[$rooms] : max(3, isset($input['base_labor_hours']) ? floatval($input['base_labor_hours']) : 3);
    // Calculate labor cost
    $labor_cost = $hours * $hourly_rate;
    
    // Dynamic truck fee based on move size
    $truck_fee = 100; // Base fee
    if ($rooms >= 4 || $size === '4 Bedrooms' || $size === '5+ Bedrooms') {
        $truck_fee = 140; // Larger truck for bigger moves
    }
    
    // Calculate extra km charges (as per Pierre & Son's rules)
    $extra_km = 0;
    $extra_km_fee = 0;
    $fuel_charge = 0;
    if ($distance_km > 50) { // Charge extra for moves over 50km
        $extra_km = $distance_km - 50;
        $fuel_charge = $extra_km * 2; // $2 per extra km as fuel charge
        $extra_km_fee = $fuel_charge; // For backward compatibility
    }
    
    // Calculate travel time fee
    $travel_fee = $travel_time_hours * $hourly_rate;
    
    // Calculate heavy item fees
    $heavy_item_fees = 0;
    $heavy_items_list = [];
    
    if (!empty($input['has_piano'])) {
        $heavy_item_fees += 200;
        $heavy_items_list[] = 'Piano ($200)';
    }
    if (!empty($input['has_safe'])) {
        $heavy_item_fees += 180;
        $heavy_items_list[] = 'Safe ($180)';
    }
    if (!empty($input['has_treadmill'])) {
        $heavy_item_fees += 100;
        $heavy_items_list[] = 'Treadmill ($100)';
    }
    if (!empty($input['has_pool_table'])) {
        $heavy_item_fees += 300;
        $heavy_items_list[] = 'Pool Table ($300)';
    }
    
    $total = $labor_cost + $truck_fee + $extra_km_fee + $travel_fee + $heavy_item_fees;
    return [
        'num_movers' => $crew,
        'crew_hourly_rate' => $hourly_rate,
        'base_labor_hours' => $hours,
        'labor_hours' => $hours,
        'labor_cost' => $labor_cost,
        'truck_fee' => $truck_fee,
        'extra_km' => $extra_km,
        'extra_km_fee' => $extra_km_fee,
        'fuel_charge' => $fuel_charge,
        'travel_time_hours' => $travel_time_hours,
        'truck_travel_time_hours' => $truck_drive_time_minutes ? $truck_drive_time_minutes / 60.0 : null,
        'travel_fee' => $travel_fee,
        'total' => round($total),
        'car_drive_time_minutes' => $car_drive_time_minutes,
        'truck_drive_time_minutes' => $truck_drive_time_minutes,
        'dispatcher' => $dispatcher,
        'journey_breakdown' => $journey,
        'heavy_item_fees' => $heavy_item_fees,
        'heavy_items_list' => $heavy_items_list
    ];
}

// Return an array of all possible extra services and whether Pierre & Son's supports them
function pierre_sons_supported_services() {
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
function pierre_sons_calculation_steps_html($input, $breakdown) {
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
    $steps[] = '1. <b>Crew Size:</b> ' . $breakdown['num_movers'] . ' movers, $' . $breakdown['crew_hourly_rate'] . '/hr.';
    $steps[] = '2. <b>Labor:</b> ' . $breakdown['base_labor_hours'] . ' hours x $' . $breakdown['crew_hourly_rate'] . ' = <b>$' . $breakdown['labor_cost'] . '</b>.';
    $steps[] = '3. <b>Truck Fee:</b> $' . $breakdown['truck_fee'] . ' (based on move size/type).';
    if ($breakdown['extra_km'] > 0) {
        $steps[] = '4. <b>Extra KM Fee:</b> ' . $breakdown['extra_km'] . ' km x $2 = $' . $breakdown['extra_km_fee'] . '.';
    }
    $steps[] = '5. <b>Travel Time Fee:</b> ' . (round($breakdown['travel_time_hours'],2)) . ' hours x $' . $breakdown['crew_hourly_rate'] . ' (min 1h) = $' . round($breakdown['travel_fee'],2) . '.';
    $steps[] = '6. <b>Heavy Item Fees:</b> $' . $breakdown['heavy_item_fees'] . '.';
    $steps[] = '7. <b>Total:</b> Labor + Truck + Extra KM + Travel + Heavy Item Fees = <b>$' . $breakdown['total'] . '</b>.';
    $html = '<div style="background:#f4f8ff;padding:16px 22px;border-radius:8px;margin-top:24px;max-width:800px;border:1px solid #cce0ff;">';
    $html .= '<h3 style="margin-top:0;color:#0056b3;">Calculation Steps</h3>';
    $html .= '<ol style="font-size:15px;line-height:1.7;">';
    foreach ($steps as $s) $html .= '<li>' . $s . '</li>';
    $html .= '</ol>';
    $html .= '</div>';
    return $html;
}

// Display rules and calculator explanation for Pierre & Son's
function pierre_sons_vendor_explanation_html() {
    $rules = pierre_sons_vendor_rules_text();
    $html = '<div style="background:#f8f9fa;padding:18px 24px;border-radius:8px;margin-top:30px;max-width:800px;">';
    $html .= '<h2>Pierre & Son\'s Official Rules (Vendor)</h2>';
    $html .= '<pre style="white-space:pre-wrap;font-size:15px;">' . esc_html($rules) . '</pre>';
    $html .= '<h2>How Our Calculator Works</h2>';
    $html .= '<ul style="font-size:15px;line-height:1.7;">';
    $html .= '<li>Determines crew size and truck type from house size/rooms.</li>';
    $html .= '<li>Applies the official hourly rates and minimum hours.</li>';
    $html .= '<li>Adds the correct truck fee and extra km fee if over 50km.</li>';
    $html .= '<li>Uses real Google Maps travel time for the travel fee (min 1 hour).</li>';
    $html .= '<li>Calculates heavy item fees based on the input parameters.</li>';
    $html .= '<li>Returns a full breakdown and total, matching the vendor\'s official rules.</li>';
    $html .= '</ul>';
    $html .= '</div>';
    return $html;
}

// Display a warning for unsupported services if present in the input
function pierre_sons_unsupported_services_html($input) {
    $unsupported_services = [];
    if (!empty($input['requires_packing'])) $unsupported_services[] = 'Packing';
    if (!empty($input['requires_storage'])) $unsupported_services[] = 'Storage';
    if (!empty($input['requires_cleaning'])) $unsupported_services[] = 'Cleaning';
    if (!empty($input['requires_junk_removal'])) $unsupported_services[] = 'Junk Removal';
    if (!empty($input['high_value_items'])) $unsupported_services[] = 'Special/High Value Items';
    if (!empty($input['special_handling_required'])) $unsupported_services[] = 'Special Handling';
    if (count($unsupported_services) === 0) return '';
    $html = '<div style="background:#fff3cd;padding:16px 22px;border-radius:8px;margin-top:24px;max-width:800px;border:1px solid #ffeeba;">';
    $html .= '<h3 style="margin-top:0;color:#856404;">Unavailable Services for Pierre & Son\'s</h3>';
    $html .= '<ul style="font-size:15px;line-height:1.7;">';
    foreach ($unsupported_services as $svc) {
        $html .= '<li>' . esc_html($svc) . ' <b style="color:#b94a48;">Not offered by Pierre & Son\'s</b></li>';
    }
    $html .= '</ul>';
    $html .= '<div style="color:#856404;font-size:14px;">If you require any of these services, please choose a different vendor.</div>';
    $html .= '</div>';
    return $html;
} 