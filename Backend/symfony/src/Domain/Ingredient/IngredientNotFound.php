<?php

declare(strict_types=1);

namespace App\Domain\Ingredient;

final class IngredientNotFound extends \RuntimeException
{
    public function __construct(string $title)
    {
        parent::__construct(sprintf('Ingredient "%s" was not found.', $title));
    }
}
