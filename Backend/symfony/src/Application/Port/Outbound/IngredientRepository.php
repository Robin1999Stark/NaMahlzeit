<?php

declare(strict_types=1);

namespace App\Application\Port\Outbound;

use App\Domain\Ingredient\Ingredient;
use App\Domain\Ingredient\IngredientNotFound;

interface IngredientRepository
{
    /** @throws IngredientNotFound */
    public function findByTitle(string $title): Ingredient;
}
