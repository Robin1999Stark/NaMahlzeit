<?php

declare(strict_types=1);

namespace App\Outbound\Persistence\Doctrine;

use App\Application\Port\Outbound\IngredientRepository;
use App\Domain\Ingredient\Ingredient;
use App\Domain\Ingredient\IngredientNotFound;
use App\Outbound\Persistence\Doctrine\Entity\IngredientRecord;
use Doctrine\ORM\EntityManagerInterface;

final readonly class DoctrineIngredientRepository implements IngredientRepository
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function findByTitle(string $title): Ingredient
    {
        $record = $this->entityManager->find(IngredientRecord::class, $title);

        if ($record === null) {
            throw new IngredientNotFound($title);
        }

        return $record->toDomain();
    }
}
