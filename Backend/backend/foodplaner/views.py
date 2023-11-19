from .models import Meal, FoodPlanerItem, Ingredient
from rest_framework import viewsets
from .serializers import MealSerializer, FoodPlanerItemSerializer, IngredientSerializer
from rest_framework import generics


class MealListView(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    queryset = Meal.objects.all()


class MealDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer


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
