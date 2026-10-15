<?php

declare(strict_types=1);

namespace App\Domain\Ingredient;

enum Unit: string
{
    case Gram = 'g';
    case Milliliter = 'ml';
    case Piece = 'stk';
    case Portion = 'portion';
}
