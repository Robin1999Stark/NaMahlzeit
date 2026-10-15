<?php

declare(strict_types=1);

namespace App\Domain\Ingredient;

enum TransitionMethod: string
{
    case Mix = 'mix';
    case Cook = 'cook';
    case Shape = 'shape';
    case Bake = 'bake';
    case Fry = 'fry';
}
