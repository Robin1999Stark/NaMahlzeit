<?php

declare(strict_types=1);

namespace App\Domain\Ingredient;

final readonly class Ingredient
{
    public function __construct(
        private string $title,
        private ?string $description,
        private ?string $preferredUnit,
    ) {
    }

    public function title(): string
    {
        return $this->title;
    }

    public function description(): ?string
    {
        return $this->description;
    }

    public function preferredUnit(): ?string
    {
        return $this->preferredUnit;
    }
}
