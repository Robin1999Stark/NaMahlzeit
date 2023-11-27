from rest_framework import serializers
from .models import Meal, FoodPlanerItem, Ingredient


class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = [
            'id',
            'title',
            'description',
            'ingredients'
        ]


class FoodPlanerItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodPlanerItem
        fields = [
            'id',
            'date',
            'meals'
        ]


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = [
            'title',
            'description'
        ]
