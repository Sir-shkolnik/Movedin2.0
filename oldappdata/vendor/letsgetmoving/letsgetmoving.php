<?php
// Let's Get Moving Vendor Calculation Logic and Rules Display
// All logic and display for Let's Get Moving is here, not in the main plugin file.

if (!defined('ABSPATH')) exit;

// Official LGM rules (for display)
function letsgetmoving_vendor_rules_text() {
    return <<<EOT
Let's Get Moving Official Price List

Hourly Rate (2025):
- 2 Movers: $150/hr
- 3 Movers: $180/hr
- 4 Movers: $220/hr
- 5 Movers: $270/hr

Travel Fee: $120 flat (GTA)
Stairs Fee: $40 per flight
Heavy Item Fees: Piano $250, Safe $300, Treadmill $100
Packing Fee: $110/hr
Insurance: $150 flat
EOT;
}

// Calculation logic for Let's Get Moving
function letsgetmoving_calc_php($input, $travel_time_minutes, $distance_km, $truck_drive_time_minutes = null, $dispatcher = null) {
    $log_file = __DIR__ . '/letsgetmoving_debug.log';
    $log_entry = date('c') . "\nINPUT: " . json_encode($input) . "\nDISPATCHER: " . json_encode($dispatcher) . "\n";
    
    // Accept dispatcher as array, not file path
    if (!$dispatcher || !is_array($dispatcher)) {
        $log_entry .= "ERROR: Dispatcher data missing or invalid\n";
        @file_put_contents($log_file, $log_entry, FILE_APPEND);
        return [
            'error' => 'Dispatcher data missing or invalid',
            'debug' => [ 'input' => $input, 'dispatcher' => $dispatcher ]
        ];
    }
    
    // Map frontend input parameters to expected parameters
    $date = isset($input['move_date']) ? $input['move_date'] : '2025-01-15'; // format: YYYY-MM-DD
    
    // Map crew size from various possible input fields - ENHANCED: Better crew recommendations for larger homes
    $movers = 2; // default
    if (isset($input['crew_size'])) {
        $movers = intval($input['crew_size']);
    } elseif (isset($input['num_movers'])) {
        $movers = intval($input['num_movers']);
    } else {
        // Enhanced mover recommendations for better service
        $room_count = 2; // default
        if (isset($input['room_count'])) {
            $room_count = intval($input['room_count']);
        } elseif (isset($input['total_rooms'])) {
            $room_count = intval($input['total_rooms']);
        } elseif (isset($input['current_rooms'])) {
            $room_count = intval($input['current_rooms']);
        } elseif (isset($input['square_footage'])) {
            // Estimate rooms from square footage
            $sqft = intval($input['square_footage']);
            if ($sqft <= 500) $room_count = 1;
            elseif ($sqft <= 800) $room_count = 2;
            elseif ($sqft <= 1200) $room_count = 3;
            elseif ($sqft <= 1800) $room_count = 4;
            else $room_count = 5;
        }
        
        // ENHANCED: Better crew size recommendations for larger homes
        if ($room_count >= 7) {
            $movers = 5; // 5+ movers for very large homes
        } elseif ($room_count >= 5) {
            $movers = 4; // 4 movers for 5-6 bedroom homes
        } elseif ($room_count >= 4) {
            $movers = 3; // 3 movers for 4 bedroom homes
        } else {
            $movers = 2; // 2 movers for smaller homes
        }
        
        // Add extra movers for heavy items
        if (isset($input['has_piano']) && $input['has_piano']) {
            $movers = max($movers, 3); // Minimum 3 for piano
        }
        if (isset($input['has_safe']) && $input['has_safe']) {
            $movers = max($movers, 3); // Minimum 3 for safe
        }
    }
    
    // ENHANCED: Map trucks with better logic for larger homes
    $trucks = isset($input['num_trucks']) ? intval($input['num_trucks']) : 1;
    
    // Auto-determine trucks based on crew size and room count
    if ($movers >= 5 || $room_count >= 6) {
        $trucks = 2; // 2 trucks for 5+ movers or 6+ bedrooms
    } elseif ($movers >= 4 || $room_count >= 5) {
        $trucks = 2; // 2 trucks for 4+ movers or 5+ bedrooms
    } else {
        $trucks = 1; // 1 truck for smaller moves
    }
    
    // Map room count from various possible input fields
    $room_count = 2; // default
    if (isset($input['room_count'])) {
        $room_count = intval($input['room_count']);
    } elseif (isset($input['total_rooms'])) {
        $room_count = intval($input['total_rooms']);
    } elseif (isset($input['current_rooms'])) {
        $room_count = intval($input['current_rooms']);
    } elseif (isset($input['square_footage'])) {
        // Estimate rooms from square footage
        $sqft = intval($input['square_footage']);
        if ($sqft <= 500) $room_count = 1;
        elseif ($sqft <= 800) $room_count = 2;
        elseif ($sqft <= 1200) $room_count = 3;
        elseif ($sqft <= 1800) $room_count = 4;
        else $room_count = 5;
    }
    
    // ENHANCED: Increase labor time estimates for proper service with larger crews
    $labor_hours = 3.5; // default
    if (isset($input['estimated_hours'])) {
        $labor_hours = floatval($input['estimated_hours']);
    } else {
        // Estimate hours based on room count - ENHANCED for better service with larger crews
        switch ($room_count) {
            case 1: $labor_hours = 3.5; break;
            case 2: $labor_hours = 4.5; break;
            case 3: $labor_hours = 5.5; break;
            case 4: $labor_hours = 6.5; break;
            case 5: $labor_hours = 7.5; break;
            case 6: $labor_hours = 8.5; break;
            case 7: $labor_hours = 9.5; break;
            default: $labor_hours = 5.5; break;
        }
        
        // ENHANCED: Adjust hours based on crew size - larger crews work faster
        if ($movers >= 4) {
            $labor_hours = max($labor_hours * 0.8, $labor_hours - 1); // 20% faster or 1 hour less
        } elseif ($movers >= 3) {
            $labor_hours = max($labor_hours * 0.85, $labor_hours - 0.5); // 15% faster or 0.5 hour less
        }
    }
    
    // FIXED: Add travel time to billable hours
    $travel_time_hours = $travel_time_minutes > 0 ? round($travel_time_minutes / 60, 2) : 0;
    
    // FIXED: Check if travel time exceeds 10 hours - Let's Get Moving doesn't do these moves
    if ($travel_time_hours > 10) {
        $log_entry .= "ERROR: Travel time exceeds 10 hours ($travel_time_hours hours). Let's Get Moving doesn't do these moves.\n";
        @file_put_contents($log_file, $log_entry, FILE_APPEND);
        return [
            'error' => 'Travel time exceeds 10 hours. Let\'s Get Moving doesn\'t do moves with more than 10 hours of travel time.',
            'travel_time_hours' => $travel_time_hours,
            'max_allowed_hours' => 10,
            'suggestion' => 'Please contact us directly for very long distance moves.'
        ];
    }

    $total_billable_hours = $labor_hours + $travel_time_hours;
    
    // Map additional fees from frontend input
    $stairs_flights = 0;
    if (isset($input['stairs_flights'])) {
        $stairs_flights = intval($input['stairs_flights']);
    } elseif (isset($input['stairs_at_pickup'])) {
        $stairs_flights += intval($input['stairs_at_pickup']);
    } elseif (isset($input['stairs_at_dropoff'])) {
        $stairs_flights += intval($input['stairs_at_dropoff']);
    }
    
    $has_piano = isset($input['has_piano']) ? $input['has_piano'] : false;
    $has_safe = isset($input['has_safe']) ? $input['has_safe'] : false;
    $has_treadmill = isset($input['has_treadmill']) ? $input['has_treadmill'] : false;
    $packing_hours = isset($input['packing_hours']) ? floatval($input['packing_hours']) : 0;
    $storage = isset($input['storage']) ? $input['storage'] : false;
    $cleaning = isset($input['cleaning']) ? $input['cleaning'] : false;
    $junk_removal = isset($input['junk_removal']) ? $input['junk_removal'] : false;
    $long_carry_m = isset($input['long_carry_m']) ? intval($input['long_carry_m']) : 0;

    // FIXED: Get base rate for the date - use actual date or fallback properly
    $base_rate = null;
    if (isset($dispatcher['calendar_hourly_price'][$date])) {
        $base_rate = $dispatcher['calendar_hourly_price'][$date];
    } else {
        // Try to find a rate for the same month/year first
        $date_parts = explode('-', $date);
        if (count($date_parts) >= 2) {
            $month_year = $date_parts[0] . '-' . $date_parts[1];
            foreach ($dispatcher['calendar_hourly_price'] as $cal_date => $rate) {
                if (strpos($cal_date, $month_year) === 0) {
                    $base_rate = $rate;
                    $log_entry .= "WARNING: No rate for date $date, using rate from $cal_date\n";
                    break;
                }
            }
        }
        
        // If still no rate, use first available date
        if ($base_rate === null) {
            $calendar_dates = array_keys($dispatcher['calendar_hourly_price']);
            if (!empty($calendar_dates)) {
                $base_rate = $dispatcher['calendar_hourly_price'][$calendar_dates[0]];
                $log_entry .= "WARNING: No rate for date $date, using rate from " . $calendar_dates[0] . "\n";
            } else {
                $log_entry .= "ERROR: No base rate found for this date: $date and no calendar dates available\n";
                @file_put_contents($log_file, $log_entry, FILE_APPEND);
                return [
                    'error' => 'No base rate found for this date',
                    'date' => $date
                ];
            }
        }
    }

    // TABLE-BASED HOURLY RATE LOGIC (matches image.png)
    $hourly_rate = 0;
    if ($trucks == 1) {
        if ($movers == 2) {
            $hourly_rate = $base_rate;
        } elseif ($movers == 3) {
            $hourly_rate = $base_rate + 60;
        } elseif ($movers == 4) {
            $hourly_rate = $base_rate + 140;
        } else {
            // Fallback: treat as 4 movers
            $hourly_rate = $base_rate + 140;
        }
    } elseif ($trucks == 2) {
        if ($movers == 4) {
            $hourly_rate = 2 * $base_rate + 20;
        } elseif ($movers == 5) {
            $hourly_rate = 2 * $base_rate + 80;
        } elseif ($movers == 6) {
            $hourly_rate = 2 * $base_rate + 140;
    } else {
            // Fallback: treat as 6 movers
            $hourly_rate = 2 * $base_rate + 140;
        }
    }

    // FIXED: Calculate labor cost using total billable hours (labor + travel)
    $labor_cost = $hourly_rate * $total_billable_hours;

    // 4. Add additional fees (standardized, can be moved to config if needed)
    $fees = 0;
    $STAIRS_PER_FLIGHT = 40;
    $PIANO_FEE = 250;
    $SAFE_FEE = 300;
    $TREADMILL_FEE = 100;
    $PACKING_PER_HOUR = 110;
    $STORAGE_FEE = 200;
    $CLEANING_FEE = 396;
    $JUNK_REMOVAL_FEE = 150;
    $LONG_CARRY_THRESHOLD_M = 75;
    $LONG_CARRY_FEE = 50;

    // FIXED: Add fuel charge using official Let's Get Moving fuel charge table
    $fuel_charge = 0;
    $is_long_distance = false;
    
    // Check 10-hour travel time limit for fuel charge calculation
    if ($travel_time_hours > 10) {
        $log_entry .= "REJECTED: Travel time exceeds 10-hour limit for fuel charge: {$travel_time_hours}h\n";
        @file_put_contents($log_file, $log_entry, FILE_APPEND);
        return [
            'special_message' => "This is a long-distance move. We'd love to help! Please call us at +1-XXX-XXX-XXX for a custom quote, or we can schedule a meeting with our agent at your convenience.",
            'travel_time_hours' => $travel_time_hours,
            'max_allowed_hours' => 10
        ];
    }
    
    // Official Let's Get Moving fuel charge table based on round-trip travel time
    $fuel_charge_table = [
        [1.75, 2.75, 260],   // 1:45–2:45 Hours, $260
        [2.75, 3.75, 450],   // 2:45–3:45 Hours, $450
        [3.75, 4.75, 580],   // 3:45–4:45 Hours, $580
        [4.75, 5.75, 710],   // 4:45–5:45 Hours, $710
        [5.75, 6.75, 840],   // 5:45–6:45 Hours, $840
        [6.75, 7.75, 970],   // 6:45–7:45 Hours, $970
        [7.75, 8.75, 1100],  // 7:45–8:45 Hours, $1,100
        [8.75, 9.75, 1230],  // 8:45–9:45 Hours, $1,230
        [9.75, 10.75, 1360]  // 9:45–10:45 Hours, $1,360
    ];
    
    // Find the appropriate fuel charge based on travel time
    foreach ($fuel_charge_table as $range) {
        if ($travel_time_hours >= $range[0] && $travel_time_hours < $range[1]) {
            $fuel_charge = $range[2];
            $is_long_distance = true;
            break;
        }
    }
    
    if ($stairs_flights > 0) {
        $fees += $STAIRS_PER_FLIGHT * $stairs_flights;
    }
    if ($has_piano) {
        $fees += $PIANO_FEE;
    }
    if ($has_safe) {
        $fees += $SAFE_FEE;
    }
    if ($has_treadmill) {
        $fees += $TREADMILL_FEE;
    }
    if (!empty($input['has_pool_table'])) {
        $fees += 400; // Pool table fee
    }
    if ($packing_hours > 0) {
        $fees += $PACKING_PER_HOUR * $packing_hours;
    }
    if ($storage) {
        $fees += $STORAGE_FEE;
    }
    if ($cleaning) {
        $fees += $CLEANING_FEE;
    }
    if ($junk_removal) {
        $fees += $JUNK_REMOVAL_FEE;
    }
    if ($long_carry_m > $LONG_CARRY_THRESHOLD_M) {
        $fees += $LONG_CARRY_FEE;
    }

    // Calculate heavy item fees and list
    $heavy_item_fees = 0;
    $heavy_items_list = [];
    
    if ($has_piano) {
        $heavy_item_fees += $PIANO_FEE;
        $heavy_items_list[] = 'Piano ($' . $PIANO_FEE . ')';
    }
    if ($has_safe) {
        $heavy_item_fees += $SAFE_FEE;
        $heavy_items_list[] = 'Safe ($' . $SAFE_FEE . ')';
    }
    if ($has_treadmill) {
        $heavy_item_fees += $TREADMILL_FEE;
        $heavy_items_list[] = 'Treadmill ($' . $TREADMILL_FEE . ')';
    }
    if (!empty($input['has_pool_table'])) {
        $heavy_item_fees += 400;
        $heavy_items_list[] = 'Pool Table ($400)';
    }
    
    $fees += $fuel_charge;

    // 5. Total
    $total = $labor_cost + $fees;

    // ENHANCED: Enhanced breakdown with better explanations for crew and truck recommendations
    $mover_reason = "Standard crew for this size move";
    if ($movers == 3) {
        if ($room_count >= 4) {
            $mover_reason = "3 movers recommended for large home (4+ rooms)";
        } elseif ($has_piano || $has_safe) {
            $mover_reason = "3 movers recommended for heavy items";
        }
    } elseif ($movers == 4) {
        if ($room_count >= 5) {
            $mover_reason = "4 movers recommended for 5-6 bedroom homes";
        } else {
            $mover_reason = "4 movers for efficient service";
        }
    } elseif ($movers == 5) {
        if ($room_count >= 7) {
            $mover_reason = "5 movers for very large homes (7+ rooms)";
        } else {
            $mover_reason = "5 movers for maximum efficiency";
        }
    }
    
    // ENHANCED: Add truck recommendation explanation
    $truck_reason = "";
    if ($trucks == 2) {
        if ($movers >= 5) {
            $truck_reason = "2 trucks required for 5+ movers";
        } elseif ($room_count >= 6) {
            $truck_reason = "2 trucks recommended for 6+ bedroom homes";
        } elseif ($room_count >= 5) {
            $truck_reason = "2 trucks for efficient 5+ bedroom moves";
        } else {
            $truck_reason = "2 trucks for larger crew efficiency";
        }
    }

    $result = [
        'date' => $date,
        'base_rate' => $base_rate,
        'movers' => $movers,
        'num_movers' => $movers,
        'trucks' => $trucks,
        'num_trucks' => $trucks,
        'hourly_rate' => $hourly_rate,
        'crew_hourly_rate' => $hourly_rate,
        'labor_hours' => $labor_hours,
        'travel_time_hours' => $travel_time_hours,
        'total_billable_hours' => $total_billable_hours,
        'labor_cost' => $labor_cost,
        'additional_fees' => $fees,
        'fuel_charge' => $fuel_charge,
        'heavy_item_fees' => $heavy_item_fees,
        'heavy_items_list' => $heavy_items_list,
        'total' => $total,
        'calculation_method' => 'dock_to_dock_dynamic',
        'dispatcher' => $dispatcher,
        'pricing_formula' => $dispatcher['pricing_formula'],
        'mover_recommendation_reason' => $mover_reason,
        'truck_recommendation_reason' => $truck_reason,
        'is_long_distance' => $is_long_distance,
        'debug' => [
            'input' => $input,
            'dispatcher' => $dispatcher,
            'mapped_params' => [
                'movers' => $movers,
                'trucks' => $trucks,
                'room_count' => $room_count,
                'labor_hours' => $labor_hours,
                'travel_time_hours' => $travel_time_hours,
                'total_billable_hours' => $total_billable_hours,
                'stairs_flights' => $stairs_flights,
                'distance_km' => $distance_km,
                'fuel_charge' => $fuel_charge,
                'heavy_item_fees' => $heavy_item_fees
            ]
        ]
    ];
    
    $log_entry .= "RESULT: " . json_encode($result) . "\n";
    @file_put_contents($log_file, $log_entry, FILE_APPEND);
    
    return $result;
} 