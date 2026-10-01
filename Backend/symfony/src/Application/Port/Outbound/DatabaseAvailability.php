<?php

declare(strict_types=1);

namespace App\Application\Port\Outbound;

interface DatabaseAvailability
{
    public function isAvailable(): bool;
}
