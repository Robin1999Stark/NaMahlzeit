from rest_framework import serializers
from ..models import Meal, Ingredient, MealIngredient
from .ingredient_serializers import IngredientSerializer


class MealIngredientSerializerWithMeal(serializers.ModelSerializer):
    class Meta:
        model = MealIngredient
        fields = ['meal', 'ingredient', 'amount', 'unit']


class MealIngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = MealIngredient
        fields = ['ingredient', 'amount', 'unit']


class MealSerializerNoAmounts(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'title', 'description',
                  'ingredients', 'duration', 'preparation']


class MealSerializer(serializers.ModelSerializer):
    Ingredients = IngredientSerializer(
        Ingredient.objects.all(), many=True, read_only=True)

    class Meta:
        model = Meal
        fields = ['id', 'title', 'description',
                  'ingredients', 'duration', 'preparation']


class MealListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'title', 'description',
                  'ingredients', 'duration', 'preparation']
