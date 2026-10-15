<?php

declare(strict_types=1);

namespace App\Domain\Ingredient;

use InvalidArgumentException;

final readonly class Transition
{
    /** @var list<TransitionComponent> */
    private array $transitionComponents;

    /** @param list<TransitionComponent> $transitionComponents */
    public function __construct(
        private string $id,
        private TransitionMethod $method,
        array $transitionComponents = [],
    ) {
        foreach ($transitionComponents as $usage) {
            if (!$usage instanceof TransitionComponent) {
                throw new InvalidArgumentException('Transition components must be TransitionComponent instances.');
            }

            if ($usage->transitionId() !== $id) {
                throw new InvalidArgumentException('A component usage must belong to this transition.');
            }
        }

        $this->transitionComponents = array_values($transitionComponents);
    }

    public function id(): string
    {
        return $this->id;
    }

    public function method(): TransitionMethod
    {
        return $this->method;
    }

    /** @return list<TransitionComponent> */
    public function transitionComponents(): array
    {
        return $this->transitionComponents;
    }
}
