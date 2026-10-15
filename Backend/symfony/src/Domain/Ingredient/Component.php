<?php

declare(strict_types=1);

namespace App\Domain\Ingredient;

final readonly class Component
{
    public function __construct(
        private string $id,
        private ?string $name = null,
        private ?Transition $transition = null,
    ) {
    }

    public function id(): string
    {
        return $this->id;
    }

    public function name(): ?string
    {
        return $this->name;
    }

    public function transition(): ?Transition
    {
        return $this->transition;
    }

    /** @return list<Component> */
    public function components(): array
    {
        return array_map(
            static fn (TransitionComponent $usage): Component => $usage->component(),
            $this->transition?->transitionComponents() ?? [],
        );
    }
}
