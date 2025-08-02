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