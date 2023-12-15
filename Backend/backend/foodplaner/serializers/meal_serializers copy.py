from rest_framework import serializers
from ..models import Meal, Ingredient, MealIngredient


class MealIngredientSerializerWithMeal(serializers.ModelSerializer):
    class Meta:
        model = MealIngredient
        fields = ['id', 'meal', 'ingredient', 'amount', 'unit']


class MealIngredientSerializer(serializers.ModelSerializer):
    ingredient = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all())

    class Meta:
        model = MealIngredient
        fields = ['ingredient', 'amount', 'unit']
        required = False

    def to_internal_value(self, data):
        if 'ingredient' not in data and 'title' in data:
            # If 'ingredient' is not present but 'title' is, assume it's a string
            data['ingredient'] = data['title']
            data.pop('title')

        ingredient_data = data.get('ingredient')

        if isinstance(ingredient_data, dict):
            # If 'ingredient' is a dictionary, try to get the 'title'
            ingredient_title = ingredient_data.get('title')
            if ingredient_title is not None:
                # If 'title' is present, try to get the Ingredient instance
                try:
                    ingredient_instance = Ingredient.objects.get(
                        title=ingredient_title)
                    # Store the primary key
                    data['ingredient'] = ingredient_instance.pk
                except Ingredient.DoesNotExist:
                    raise serializers.ValidationError(
                        f"Invalid ingredient: {ingredient_title}")
        elif isinstance(ingredient_data, Ingredient):
            # If 'ingredient' is an instance of Ingredient, store it directly
            data['ingredient'] = ingredient_data.pk
        return super().to_internal_value(data)

    def create(self, validated_data):
        meal = validated_data.pop('meal', None)

        if meal is None:
            raise serializers.ValidationError(
                "Meal is required for MealIngredient creation.")

        ingredient_title = validated_data.get('ingredient', {}).get('title')
        ingredient, created = Ingredient.objects.get_or_create(
            title=ingredient_title,
            defaults={'preferedUnit': validated_data.get('unit')}
        )

        return MealIngredient.objects.create(meal=meal, ingredient=ingredient, **validated_data)


class MealSerializerNoAmounts(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'title', 'description',
                  'ingredients', 'duration', 'preparation']


class MealSerializer(serializers.ModelSerializer):
    ingredients = MealIngredientSerializer(many=True)

    class Meta:
        model = Meal
        fields = ['id', 'title', 'description',
                  'ingredients', 'duration', 'preparation']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        meal = Meal.objects.create(**validated_data)

        for ingredient_data in ingredients_data:
            ingredient_serializer = MealIngredientSerializer(
                data=ingredient_data)
            if not ingredient_serializer.is_valid():
                raise serializers.ValidationError(ingredient_serializer.errors)

            # Use the serializer data, not the original ingredient_data
            ingredient_title = ingredient_serializer.validated_data.get(
                'ingredient')
            ingredient, created = Ingredient.objects.get_or_create(
                title=ingredient_title,
                defaults={
                    'preferedUnit': ingredient_serializer.validated_data.get('unit')}
            )

            if not created:
                # Update existing Ingredient if it was not created
                ingredient.preferedUnit = ingredient_serializer.validated_data.get(
                    'unit')
                ingredient.save()

            # Remove 'ingredient' key from the serializer data, not the original ingredient_data
            ingredient_serializer.validated_data.pop('ingredient')

            # Pass the serializer data to create the MealIngredient instance
            MealIngredient.objects.create(
                meal=meal, ingredient=ingredient, **ingredient_serializer.validated_data)

        return meal

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

    def get_attribute(self, instance):

        value = super().get_attribute(instance)
        return value


class MealListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'title', 'description',
                  'ingredients', 'duration', 'preparation']
