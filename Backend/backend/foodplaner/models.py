from django.db import models


class Ingredient(models.Model):
    title = models.CharField(max_length=180, null=False)
    description = models.CharField(null=True, max_length=500)


class Meal(models.Model):
    title = models.CharField(max_length=180)
    description = models.TextField(null=True, max_length=500)
    ingredients = models.ManyToManyField(Ingredient)


class FoodPlanerItem(models.Model):
    date = models.DateField()
    meals = models.ManyToManyField(Meal)
