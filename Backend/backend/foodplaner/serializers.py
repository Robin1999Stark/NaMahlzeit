from rest_framework import serializers
from .models import Meal, FoodPlanerItem, Ingredient, MealIngredient, InventoryItem, InventoryList


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['title', 'description']


class MealIngredientSerializer(serializers.ModelSerializer):
    ingredient = serializers.CharField(source='ingredient.title')

    class Meta:
        model = MealIngredient
        fields = ['ingredient', 'amount', 'unit']


class MealSerializer(serializers.ModelSerializer):
    ingredients = MealIngredientSerializer(many=True)

    class Meta:
        model = Meal
        fields = ['id', 'title', 'description', 'ingredients']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        meal = Meal.objects.create(**validated_data)
        for ingredient_data in ingredients_data:
            MealIngredient.objects.create(meal=meal, **ingredient_data)
        return meal


class MealListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'title', 'description', 'ingredients']


class FoodPlanerItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = FoodPlanerItem
        fields = ['id', 'date', 'meals']


class InventoryItemSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = InventoryItem
        fields = ['ingredient', 'amount', 'unit']


class InventoryListSerializer(serializers.ModelSerializer):
    ingredients = InventoryItemSerializer(many=True)

    class Meta:
        model = InventoryList
        fields = ['id', 'date', 'ingredients']
