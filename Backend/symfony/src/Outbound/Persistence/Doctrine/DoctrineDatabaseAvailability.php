<?php

declare(strict_types=1);

namespace App\Outbound\Persistence\Doctrine;

use App\Application\Port\Outbound\DatabaseAvailability;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;

final readonly class DoctrineDatabaseAvailability implements DatabaseAvailability
{
    public function __construct(private Connection $connection)
    {
    }

    public function isAvailable(): bool
    {
        try {
            $this->connection->executeQuery('SELECT 1')->fetchOne();

            return true;
        } catch (Exception) {
            $this->connection->close();

            return false;
        }
    }
}
