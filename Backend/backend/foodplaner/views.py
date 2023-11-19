from .models import Meal, FoodPlanerItem
from rest_framework import viewsets
from .serializers import MealSerializer, FoodPlanerItemSerializer
from rest_framework import generics


class FoodPlanerItemView(viewsets.ModelViewSet):
    serializer_class = FoodPlanerItemSerializer
    queryset = FoodPlanerItem.objects.all()


class MealListView(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    queryset = Meal.objects.all()


class MealDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer


class FoodPlanerItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodPlanerItem.objects.all()
    serializer_class = FoodPlanerItemSerializer
