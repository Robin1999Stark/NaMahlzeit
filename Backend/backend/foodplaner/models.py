from django.db import models
from datetime import datetime


class UnitOptions(models.TextChoices):
    KG = 'kg', 'KG'
    LITER = 'l', 'L'
    GRAM = 'g', 'G'
    MILLILITRE = 'ml', 'ML'
    PIECE = 'stk', 'stk.'
    TEASPOON = 'tsp', 'TSP'
    TABLESPOON = 'TBSP', 'Tbsp'
    OUNCE = 'oz'
    CUP = 'cup'
    GALLON = 'gal', 'gallon'
    PINCH = 'pinch', 'prise'
    DROP = 'drop', 'Tropfen'
    HANDFUL = 'handful'
    SPRIG = 'sprig', 'Zweig'
    CLOVE = 'Zehe', 'clove'
    SHEET = 'sheet', 'Blatt'
    BOTTLE = 'bottle', 'Flasche'
    BUNCH = 'bund', 'bunch'
    PACKAGE = 'Package', 'package'
    BAR = 'tafel', 'bar'
    CAN = 'can', 'dose'
    STICK = 'stick', 'stange'


class Ingredient(models.Model):
    title = models.CharField(max_length=180, primary_key=True, null=False)
    description = models.CharField(null=True, max_length=1200)
    preferedUnit = models.CharField(
        choices=UnitOptions.choices,
        null=True,
        default=UnitOptions.PIECE,
        max_length=20)


class Meal(models.Model):
    title = models.CharField(max_length=180)
    description = models.TextField(null=True, max_length=500)
    ingredients = models.ManyToManyField(
        Ingredient, blank=True, through='MealIngredient')
    duration = models.PositiveSmallIntegerField(default=0)
    preparation = models.TextField(null=True, blank=True)


class MealIngredient(models.Model):
    meal = models.ForeignKey(
        Meal, on_delete=models.CASCADE, related_name='meal_to_ingredient')
    ingredient = models.ForeignKey(
        Ingredient, on_delete=models.CASCADE, related_name='ingredient_to_meal')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=10)

    class Meta:
        db_table = 'meal_ingredient'
        constraints = [
            models.UniqueConstraint(
                fields=['meal', 'ingredient'], name='unique_meal_ingredient')
        ]


class FoodPlanerItem(models.Model):
    date = models.DateField()
    meals = models.ManyToManyField(Meal, blank=True)


class InventoryItem(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    unit = models.CharField(
        max_length=20,
        choices=UnitOptions.choices,
        default=UnitOptions.PIECE,
    )


class ShoppingListItem(models.Model):
    bought = models.BooleanField(default=False)
    added = models.DateTimeField(default=datetime.now())
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.DecimalField(
        max_digits=10, default=1, decimal_places=2, null=True)
    unit = models.CharField(
        max_length=20,
        choices=UnitOptions.choices,
        default=UnitOptions.PIECE,
    )
    notes = models.TextField(
        blank=True,
        null=True,
        max_length=200,
    )


class ShoppingList(models.Model):
    created = models.DateTimeField(default=datetime.now())
    items = models.ManyToManyField(ShoppingListItem, blank=True)
