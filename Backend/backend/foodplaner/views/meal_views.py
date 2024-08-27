from ..models import InventoryItem, ShoppingList, ShoppingListItem, Meal, FoodPlanerItem, Ingredient, MealIngredient
from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from datetime import date, datetime
from django.shortcuts import get_object_or_404
from ..serializers.ingredient_serializers import Ingredient, IngredientSerializer
from ..serializers.meal_serializers import MealIngredientSerializer, MealListSerializer, MealIngredientSerializerWithMeal, MealSerializerNoAmounts, MealSerializer
from ..serializers.planer_serializers import FoodPlanerItem, FoodPlanerItemSerializer
from ..serializers.inventory_serializers import InventoryItem, InventoryItemSerializer
from ..serializers.shoppinglist_serializers import ShoppingListItemSerializer, ShoppingListSerializer


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


def get_all_mealingredients_from_meals(request):

    pass


def get_all_mealingredients_from_planer(request, start, end):

    start_date = datetime.strptime(start, '%Y-%m-%d').date()
    end_date = datetime.strptime(end, '%Y-%m-%d').date()

    planer_in_timeslot = FoodPlanerItem.objects.filter(date__range=[
                                                       start_date, end_date])
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


def get_all_meals_on_planer(request, start, end):

    start_date = datetime.strptime(start, '%Y-%m-%d').date()
    end_date = datetime.strptime(end, '%Y-%m-%d').date()
    planer_in_timeslot = FoodPlanerItem.objects.filter(date__range=[
                                                       start_date, end_date])
    all_meals = []
    for planer in planer_in_timeslot:
        all_meals.extend(planer.meals.all())

    serialized_meals = MealSerializerNoAmounts(all_meals, many=True).data
    data = {'meals': serialized_meals}
    return JsonResponse(data)


class MealListView(viewsets.ModelViewSet):
    serializer_class = MealListSerializer
    queryset = Meal.objects.all()


class MealDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Meal.objects.all()
    serializer_class = MealSerializer


class MealIngredientListView(generics.ListCreateAPIView):
    queryset = MealIngredient.objects.all()
    serializer_class = MealIngredientSerializer

    def get(self, request, *args, **kwargs):
        meal_pk = self.kwargs.get('meal_pk')
        queryset = MealIngredient.objects.filter(meal=meal_pk)
        serializer = MealIngredientSerializerWithMeal(queryset, many=True)
        return Response(serializer.data)


class MealIngredientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MealIngredient.objects.all()
    serializer_class = MealIngredientSerializer


class MealIngredientListViewNormal(viewsets.ModelViewSet):
    queryset = MealIngredient.objects.all()
    serializer_class = MealIngredientSerializerWithMeal
