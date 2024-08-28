from rest_framework import serializers
from ..models import Meal, Ingredient, MealIngredient
from .ingredient_serializers import IngredientSerializer


class MealIngredientSerializerWithMeal(serializers.ModelSerializer):
    class Meta:
        model = MealIngredient
        fields = ['id', 'meal', 'ingredient', 'amount', 'unit']


class MealIngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = MealIngredient
        fields = ['ingredient', 'amount', 'unit']


class MealSerializerNoAmounts(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'title', 'description', 'ingredients',
                  'duration', 'preparation', 'portion_size', 'picture']


class MealSerializer(serializers.ModelSerializer):
    ingredients = MealIngredientSerializer(
        source='meal_to_ingredient', many=True, read_only=True)

    class Meta:
        model = Meal
        fields = ['id', 'title', 'description', 'ingredients',
                  'duration', 'preparation', 'portion_size', 'picture']


class MealListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'title', 'description', 'ingredients',
                  'duration', 'preparation', 'portion_size', 'picture']
