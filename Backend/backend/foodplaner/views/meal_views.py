from ..models import Ingredient, Meal, FoodPlanerItem, MealIngredient
from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse, HttpResponse
from datetime import date, datetime
from django.shortcuts import get_object_or_404
from ..serializers.meal_serializers import MealIngredientSerializer, MealListSerializer, MealIngredientSerializerWithMeal, MealSerializerNoAmounts, MealSerializer
from ..serializers.planer_serializers import FoodPlanerItem
from rest_framework.decorators import api_view
import json
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from collections import defaultdict
from decimal import Decimal
from django.core.exceptions import ValidationError


def querydict_to_dict(querydict):
    result = defaultdict(dict)

    for key in querydict:
        parts = key.split('][')
        if len(parts) > 1:
            index = parts[0].split('[')[1]
            field = parts[1].rstrip(']')
            result[index][field] = querydict[key]

    return {int(k): v for k, v in result.items()}


@api_view(['GET'])
def export_meals(request):
    meals = Meal.objects.all()
    serializer = MealSerializer(meals, many=True)
    response_data = json.dumps(serializer.data, indent=4)
    return HttpResponse(response_data, content_type='application/json', headers={'Content-Disposition': 'attachment; filename="meals.json"'})


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
    parser_classes = (MultiPartParser, FormParser)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        form_data = request.data
        print("Form Data:", form_data)

        # Handle picture and portion_size
        picture = form_data.get('picture', instance.picture)
        portion_size = form_data.get('portion_size', instance.portion_size)

        # Update meal fields
        instance.title = form_data.get('title', instance.title)
        instance.description = form_data.get(
            'description', instance.description)
        instance.preparation = form_data.get(
            'preparation', instance.preparation)
        instance.duration = form_data.get('duration', instance.duration)
        instance.picture = picture
        instance.portion_size = portion_size
        instance.save()

        ingredients_data = querydict_to_dict(form_data)
        print("Parsed Ingredients Data:", ingredients_data)

        existing_ingredients = MealIngredient.objects.filter(meal=instance)
        existing_ingredients_ids = set(
            existing_ingredients.values_list('id', flat=True))
        processed_ingredients = set()

        for index, ingredient_data in ingredients_data.items():
            ingredient_id = int(ingredient_data.get('id', 0))
            ingredient_name = ingredient_data.get('ingredient')
            amount = Decimal(ingredient_data.get('amount', 0))
            unit = ingredient_data.get('unit')

            try:
                # Fetch the Ingredient instance based on its name
                ingredient_instance = get_object_or_404(
                    Ingredient, title=ingredient_name)

                if ingredient_id in existing_ingredients_ids:
                    # Update existing ingredient
                    ingredient = existing_ingredients.get(id=ingredient_id)
                    ingredient.ingredient = ingredient_instance
                    ingredient.amount = amount
                    ingredient.unit = unit
                    ingredient.save()
                    processed_ingredients.add(ingredient.id)
                else:
                    # Create a new ingredient
                    new_ingredient = MealIngredient.objects.create(
                        meal=instance,
                        ingredient=ingredient_instance,
                        amount=amount,
                        unit=unit
                    )
                    processed_ingredients.add(new_ingredient.id)
            except Ingredient.DoesNotExist:
                print(f"Ingredient '{ingredient_name}' does not exist.")
            except (ValueError, ValidationError) as e:
                print(f"Error with ingredient data: {e}")
                raise

        # Remove ingredients not processed (deleted by the user)
        ingredients_to_delete = existing_ingredients_ids - processed_ingredients
        MealIngredient.objects.filter(id__in=ingredients_to_delete).delete()

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
