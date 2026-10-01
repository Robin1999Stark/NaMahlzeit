<?php

declare(strict_types=1);

namespace App\Tests\Outbound\Persistence\Doctrine;

use App\Application\Port\Outbound\IngredientRepository;
use App\Domain\Ingredient\IngredientNotFound;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

final class DoctrineIngredientRepositoryTest extends KernelTestCase
{
    public function testMappingAgainstPostgres(): void
    {
        if (getenv('RUN_DATABASE_TESTS') !== '1') {
            self::markTestSkipped('Set RUN_DATABASE_TESTS=1 to run PostgreSQL integration tests.');
        }

        self::bootKernel();
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $connection = $entityManager->getConnection();
        $repository = self::getContainer()->get(IngredientRepository::class);

        // A temporary table shadows the real table on this connection only.
        // Rollback removes the temporary table and every test record.
        $connection->beginTransaction();

        try {
            $connection->executeStatement('CREATE TEMP TABLE foodplaner_ingredient (
                title varchar(180) PRIMARY KEY,
                description varchar(1200),
                "preferedUnit" varchar(20)
            )');
            $title = "Tomato ' OR 1=1 --";
            $connection->executeStatement('INSERT INTO foodplaner_ingredient VALUES (?, ?, ?), (?, NULL, NULL)', [$title, 'Fresh', 'stk', 'Salt']);

            $ingredient = $repository->findByTitle($title);
            self::assertSame($title, $ingredient->title());
            self::assertSame('Fresh', $ingredient->description());
            self::assertSame('stk', $ingredient->preferredUnit());

            $ingredient = $repository->findByTitle('Salt');
            self::assertSame('Salt', $ingredient->title());
            self::assertNull($ingredient->description());
            self::assertNull($ingredient->preferredUnit());

            $this->expectException(IngredientNotFound::class);
            $repository->findByTitle('missing');
        } finally {
            $entityManager->clear();
            $connection->rollBack();
        }
    }
}
