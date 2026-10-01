<?php

declare(strict_types=1);

namespace App\Tests\Inbound\Http;

use App\Application\Port\Outbound\DatabaseAvailability;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class HealthControllerTest extends WebTestCase
{
    public function testHealthDoesNotCheckDatabase(): void
    {
        $client = self::createClient();
        $database = $this->createMock(DatabaseAvailability::class);
        $database->expects(self::never())->method('isAvailable');
        self::getContainer()->set(DatabaseAvailability::class, $database);

        $client->request('GET', '/health');

        self::assertResponseIsSuccessful();
        self::assertSame(['status' => 'ok'], json_decode($client->getResponse()->getContent(), true, flags: JSON_THROW_ON_ERROR));
    }
}
