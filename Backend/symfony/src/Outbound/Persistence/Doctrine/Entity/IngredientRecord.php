<?php

declare(strict_types=1);

namespace App\Outbound\Persistence\Doctrine\Entity;

use App\Domain\Ingredient\Ingredient;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'foodplaner_ingredient')]
class IngredientRecord
{
    #[ORM\Id]
    #[ORM\Column(type: Types::STRING, length: 180)]
    private string $title;

    #[ORM\Column(type: Types::STRING, length: 1200, nullable: true)]
    private ?string $description;

    // Django's existing mixed-case column is intentionally quoted.
    #[ORM\Column(name: '`preferedUnit`', type: Types::STRING, length: 20, nullable: true)]
    private ?string $preferredUnit;

    public function toDomain(): Ingredient
    {
        return new Ingredient($this->title, $this->description, $this->preferredUnit);
    }
}
