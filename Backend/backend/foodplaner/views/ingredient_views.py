from rest_framework import viewsets, generics
from ..serializers.ingredient_serializers import Ingredient, IngredientSerializer
from rest_framework.decorators import api_view
from django.http import HttpResponse
import json


@api_view(['GET'])
def export_ingredients(request):
    ingredients = Ingredient.objects.all()
    serializer = IngredientSerializer(ingredients, many=True)
    response_data = json.dumps(serializer.data, indent=4)
    return HttpResponse(response_data, content_type='application/json', headers={'Content-Disposition': 'attachment; filename="ingredients.json"'})


class IngredientListView(viewsets.ModelViewSet):
    serializer_class = IngredientSerializer
    queryset = Ingredient.objects.all()


class IngredientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
