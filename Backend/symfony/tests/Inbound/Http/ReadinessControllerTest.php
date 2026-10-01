<?php

declare(strict_types=1);

namespace App\Tests\Inbound\Http;

use App\Application\Port\Outbound\DatabaseAvailability;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class ReadinessControllerTest extends WebTestCase
{
    #[DataProvider('availability')]
    public function testReadiness(bool $available, int $status, string $body): void
    {
        $client = self::createClient();
        $database = $this->createMock(DatabaseAvailability::class);
        $database->expects(self::once())->method('isAvailable')->willReturn($available);
        self::getContainer()->set(DatabaseAvailability::class, $database);

        $client->request('GET', '/ready');

        self::assertResponseStatusCodeSame($status);
        self::assertResponseHeaderSame('Content-Type', 'application/json');
        self::assertSame(['status' => $body], json_decode($client->getResponse()->getContent(), true, flags: JSON_THROW_ON_ERROR));
    }

    public static function availability(): iterable
    {
        yield 'database available' => [true, 200, 'ok'];
        yield 'database unavailable' => [false, 503, 'unavailable'];
    }
}
