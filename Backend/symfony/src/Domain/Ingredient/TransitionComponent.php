<?php

declare(strict_types=1);

namespace App\Domain\Ingredient;

use InvalidArgumentException;

final readonly class TransitionComponent
{
    public function __construct(
        private string $id,
        private string $transitionId,
        private Component $component,
        private int $amount,
        private Unit $unit,
        private ?int $workTimeInSeconds = null,
    ) {
        if ($amount <= 0) {
            throw new InvalidArgumentException('Amount must be greater than zero.');
        }

        if ($workTimeInSeconds !== null && $workTimeInSeconds < 0) {
            throw new InvalidArgumentException('Work time must not be negative.');
        }
    }

    public function id(): string
    {
        return $this->id;
    }

    public function transitionId(): string
    {
        return $this->transitionId;
    }

    public function component(): Component
    {
        return $this->component;
    }

    public function componentId(): string
    {
        return $this->component->id();
    }

    public function amount(): int
    {
        return $this->amount;
    }

    public function unit(): Unit
    {
        return $this->unit;
    }

    public function workTimeInSeconds(): ?int
    {
        return $this->workTimeInSeconds;
    }
}
