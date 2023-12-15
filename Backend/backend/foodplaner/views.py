from .models import InventoryItem, ShoppingList, ShoppingListItem, Meal, FoodPlanerItem, Ingredient, MealIngredient
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import JsonResponse
from datetime import date
from django.shortcuts import get_object_or_404
from .serializers.ingredient_serializers import Ingredient, IngredientSerializer
from .serializers.meal_serializers import MealIngredientSerializer, MealListSerializer, MealIngredientSerializerWithMeal, MealSerializerNoAmounts, MealSerializer
from .serializers.planer_serializers import FoodPlanerItem, FoodPlanerItemSerializer
from .serializers.inventory_serializers import InventoryItem, InventoryItemSerializer
from .serializers.shoppinglist_serializers import ShoppingListItemSerializer, ShoppingListSerializer
from django.db import transaction


def is_planned(request, meal_pk):
    meal = get_object_or_404(Meal, id=meal_pk)

    today = date.today()
    planned_items = FoodPlanerItem.objects.filter(meals=meal, date__gte=today)

    if planned_items.exists():
        planned_date = planned_items.first().date
        response_data = {'is_planned': True, 'planned_date': planned_date}
    else:
        response_data = {'is_planned': False, 'planned_date': None}

    # Return a JSON response indicating whether the meal is planned and its date
    return JsonResponse(response_data)


def get_all_mealingredients_from_planer(request):

    start = date(2023, 12, 5)
    end = date(2023, 12, 10)

    planer_in_timeslot = FoodPlanerItem.objects.filter(date__range=[
                                                       start, end])
    all_meals = []
    for planer in planer_in_timeslot:
        all_meals.extend(planer.meals.all())

    all_meal_ingredients = []
    for meal_item in all_meals:
        all_meal_ingredients.extend(
            MealIngredient.objects.filter(meal=meal_item))

    serialized_meal_ingredients = MealIngredientSerializerWithMeal(
        all_meal_ingredients, many=True).data
    data = {'meals': serialized_meal_ingredients}
    return JsonResponse(data)


def get_all_mealingredients_from_meals(request):

    pass


def get_all_meals_on_planer(request):

    start = date(2023, 12, 5)
    end = date(2023, 12, 24)

    planer_in_timeslot = FoodPlanerItem.objects.filter(date__range=[
                                                       start, end])
    all_meals = []
    for planer in planer_in_timeslot:
        all_meals.extend(planer.meals.all())

    serialized_meals = MealSerializerNoAmounts(all_meals, many=True).data
    data = {'meals': serialized_meals}
    return JsonResponse(data)


class MealListView(viewsets.ModelViewSet):
    serializer_class = MealListSerializer
    queryset = Meal.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = MealSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Update Meal data
        meal_data = serializer.validated_data
        instance.title = meal_data.get('title', instance.title)
        instance.description = meal_data.get(
            'description', instance.description)
        instance.duration = meal_data.get('duration', instance.duration)
        instance.preparation = meal_data.get(
            'preparation', instance.preparation)
        instance.save()

        # Update or create MealIngredient entries
        ingredients_data = meal_data.get('ingredients', [])

        # Track existing ingredients for removal
        existing_ingredient_titles = [
            ingredient.title for ingredient in instance.ingredients.all()]

        with transaction.atomic():
            for ingredient_data in ingredients_data:
                ingredient_dict = ingredient_data.get('ingredient', {})

                # Ensure ingredient_dict is a dictionary
                if isinstance(ingredient_dict, dict):
                    ingredient_title = ingredient_dict.get('title')

                    # Ensure ingredient_title is provided and not empty
                    if ingredient_title:
                        amount = ingredient_data.get('amount')
                        unit = ingredient_data.get('unit')

                        # Try to get existing Ingredient
                        ingredient, created = Ingredient.objects.get_or_create(
                            title=ingredient_title,
                            defaults={'preferedUnit': unit}
                        )

                        # Now create MealIngredient using the retrieved or created Ingredient
                        meal_ingredient, created = MealIngredient.objects.get_or_create(
                            meal=instance,
                            ingredient=ingredient,
                            defaults={'amount': amount, 'unit': unit}
                        )

                        # Update existing MealIngredient if it was not created
                        if not created:
                            meal_ingredient.amount = amount
                            meal_ingredient.unit = unit
                            meal_ingredient.save()

                        # Remove the ingredient title from the list of existing ingredients
                        existing_ingredient_titles.remove(ingredient_title)

        # Remove any remaining ingredients that were not in the received data
        instance.ingredients.filter(
            title__in=existing_ingredient_titles).delete()

        return Response(serializer.data, status=status.HTTP_200_OK)


class MealDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Meal.objects.all()
    serializer_class = MealSerializer

    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print("test")
        return super().update(request, *args, **kwargs)


class FoodPlanerItemView(viewsets.ModelViewSet):
    serializer_class = FoodPlanerItemSerializer
    queryset = FoodPlanerItem.objects.all()


class FoodPlanerItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodPlanerItem.objects.all()
    serializer_class = FoodPlanerItemSerializer


class IngredientListView(viewsets.ModelViewSet):
    serializer_class = IngredientSerializer
    queryset = Ingredient.objects.all()


class IngredientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


# Additional Views for Nested Serialization

class MealIngredientListView(generics.ListCreateAPIView):
    queryset = MealIngredient.objects.all()
    serializer_class = MealIngredientSerializer

    def get(self, request, *args, **kwargs):
        meal_pk = self.kwargs.get('meal_pk')
        queryset = MealIngredient.objects.filter(meal=meal_pk)
        serializer = MealIngredientSerializer(queryset, many=True)
        return Response(serializer.data)


class MealIngredientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MealIngredient.objects.all()
    serializer_class = MealIngredientSerializer


class MealIngredientListViewNormal(viewsets.ModelViewSet):
    queryset = MealIngredient.objects.all()
    serializer_class = MealIngredientSerializerWithMeal


class InventoryItemView(viewsets.ModelViewSet):
    serializer_class = InventoryItemSerializer
    queryset = InventoryItem.objects.all()


class ShoppingListView(viewsets.ModelViewSet):
    serializer_class = ShoppingListSerializer
    queryset = ShoppingList.objects.all()


class ShoppingListItemView(viewsets.ModelViewSet):
    serializer_class = ShoppingListItemSerializer
    queryset = ShoppingListItem.objects.all()
