from django.db import models


class Meal(models.Model):
    title = models.CharField(max_length=180)


class FoodPlanerItem(models.Model):
    date = models.DateField()
    meals = models.ManyToManyField(Meal)
