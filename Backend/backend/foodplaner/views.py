from .models import InventoryItem, InventoryList, Meal, FoodPlanerItem, Ingredient, MealIngredient
from rest_framework import viewsets, generics
from .serializers import MealSerializer, FoodPlanerItemSerializer, IngredientSerializer, MealIngredientSerializer, InventoryItemSerializer, InventoryListSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MealSerializer, MealListSerializer


class MealListView(viewsets.ModelViewSet):
    serializer_class = MealListSerializer
    queryset = Meal.objects.all()


class MealDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer


class CreateMealWithIngredientsView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = MealSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class MealIngredientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MealIngredient.objects.all()
    serializer_class = MealIngredientSerializer


class InventoryItemListView(generics.ListCreateAPIView):
    serializer_class = InventoryItemSerializer
    queryset = InventoryItem.objects.all()


class InventoryItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InventoryItemSerializer
    queryset = InventoryItem.objects.all()


class InventoryListView(generics.ListCreateAPIView):
    serializer_class = InventoryListSerializer
    queryset = InventoryList.objects.all()


class InventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InventoryListSerializer
    queryset = InventoryList.objects.all()
