<?php

declare(strict_types=1);

namespace App\Application\Service;

use App\Application\Port\Inbound\Readiness;
use App\Application\Port\Outbound\DatabaseAvailability;

final readonly class ReadinessService implements Readiness
{
    public function __construct(private DatabaseAvailability $database)
    {
    }

    public function isReady(): bool
    {
        return $this->database->isAvailable();
    }
}
