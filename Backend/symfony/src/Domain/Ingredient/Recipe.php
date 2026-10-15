<?php

declare(strict_types=1);

namespace App\Domain\Ingredient;

final readonly class Recipe
{
    public function __construct(
        private string $id,
        private Component $component,
    ) {
    }

    public function id(): string
    {
        return $this->id;
    }

    public function component(): Component
    {
        return $this->component;
    }

    public function componentId(): string
    {
        return $this->component->id();
    }
}
