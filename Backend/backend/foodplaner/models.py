from django.db import models


class Ingredient(models.Model):
    title = models.CharField(max_length=180, primary_key=True, null=False)
    description = models.CharField(null=True, max_length=500)


class Meal(models.Model):
    title = models.CharField(max_length=180)
    description = models.TextField(null=True, max_length=500)
    ingredients = models.ManyToManyField(
        Ingredient, blank=True, through='MealIngredient')


class MealIngredient(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=10)


class FoodPlanerItem(models.Model):
    date = models.DateField()
    meals = models.ManyToManyField(Meal, blank=True)


class InventoryList(models.Model):
    date = models.DateField()
    ingredients = models.ManyToManyField(
        Ingredient, through='InventoryItem', blank=True)


class InventoryItem(models.Model):
    inventory_list = models.ForeignKey(InventoryList, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=10)
