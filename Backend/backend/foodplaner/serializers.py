from rest_framework import serializers
from .models import Meal, FoodPlanerItem, Ingredient, MealIngredient, InventoryItem


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['title', 'description']


class MealIngredientSerializer(serializers.ModelSerializer):
    ingredient = serializers.CharField(source='ingredient.title')

    class Meta:
        model = MealIngredient
        fields = ['ingredient', 'amount', 'unit']
        required = False

    def create(self, validated_data):
        meal = validated_data.pop('meal', None)

        # If meal is not provided, you might want to handle it in a specific way or raise an error
        if meal is None:
            # Handle the case where meal is not provided, e.g., raise ValidationError
            raise serializers.ValidationError(
                "Meal is required for MealIngredient creation.")

        ingredient_title = validated_data['ingredient']['title']
        ingredient = Ingredient.objects.get(title=ingredient_title)

        return MealIngredient.objects.create(meal=meal, ingredient=ingredient, **validated_data)


class MealSerializer(serializers.ModelSerializer):
    ingredients = MealIngredientSerializer(many=True)

    class Meta:
        model = Meal
        fields = ['id', 'title', 'description', 'ingredients']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        meal = Meal.objects.create(**validated_data)

        for ingredient_data in ingredients_data:
            ingredient_title = ingredient_data.pop('ingredient')['title']

            ingredient = Ingredient.objects.get(
                title=ingredient_title)

            # Create MealIngredient instance without requiring an existing meal
            MealIngredient.objects.create(
                meal=meal, ingredient=ingredient, **ingredient_data)

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
    class Meta:
        model = InventoryItem
        fields = ['ingredient', 'amount', 'unit']
