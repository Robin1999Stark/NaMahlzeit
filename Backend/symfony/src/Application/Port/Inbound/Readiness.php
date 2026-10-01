<?php

declare(strict_types=1);

namespace App\Application\Port\Inbound;

interface Readiness
{
    public function isReady(): bool;
}
