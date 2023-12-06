from rest_framework import serializers
from .models import Meal, ShoppingList, ShoppingListItem, FoodPlanerItem, Ingredient, MealIngredient, InventoryItem


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['title', 'description', 'preferedUnit']

    def get_attribute(self, instance):

        value = super().get_attribute(instance)
        return value


class MealIngredientSerializerWithMeal(serializers.ModelSerializer):
    class Meta:
        model = MealIngredient
        fields = ['meal', 'ingredient', 'amount', 'unit']


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

    def get_attribute(self, instance):

        value = super().get_attribute(instance)
        return value


class MealSerializerNoAmounts(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'title', 'description', 'ingredients']


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

    def get_attribute(self, instance):

        value = super().get_attribute(instance)
        return value


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
        fields = ['id', 'ingredient', 'amount', 'unit']

    def create(self, validated_data):
        ingr = validated_data['ingredient']
        items = InventoryItem.objects.filter(
            ingredient=ingr, unit=validated_data['unit'])
        if not items.exists():
            if validated_data['amount'] > 0:
                inventory_item = InventoryItem.objects.create(
                    ingredient=validated_data['ingredient'], amount=validated_data['amount'], unit=validated_data['unit'])
                return inventory_item

        else:
            first = items.first()
            if validated_data['unit'] == first.unit:
                new_amount = first.amount + validated_data['amount']
                if new_amount > 0:
                    first.amount = new_amount
                    first.save()
                else:
                    first.delete()
                return first
            else:
                new_amount = validated_data['amount']
                if new_amount > 0:
                    inventory_item = InventoryItem.objects.create(
                        ingredient=validated_data['ingredient'], amount=new_amount, unit=validated_data['unit'])
                    return inventory_item
                else:
                    pass
        return InventoryItem.objects.first()


class ShoppingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListItem
        fields = ['id', 'bought', 'added',
                  'ingredient', 'amount', 'unit', 'notes']

    def update(self, instance, validated_data):
        return self.update


class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['id', 'created', 'items']
