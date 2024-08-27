from django.http import HttpResponseBadRequest, JsonResponse
from ..models import MealTags, IngredientTags, Tag
from ..serializers.tags_serializers import TagSerializer, MealTagsSerializer, IngredientTagsSerializer
from rest_framework import viewsets


def meals_by_tags(request, tags):
 # Check if the request method is GET
    if request.method != 'GET':
        return HttpResponseBadRequest("Only GET requests are allowed for this view.")

    # Ensure that tags is not None
    if tags is None:
        return HttpResponseBadRequest("Tags parameter is missing or empty.")

    # Convert the tags parameter into a list
    try:
        tag_list = tags.split(',')
    except AttributeError:
        # Handle the case where tags is not a string
        return HttpResponseBadRequest("Invalid format for tags parameter.")

    # Query meals that have all the specified tags using MealTags
    meal_tags = MealTags.objects.filter(tags__name__in=tag_list).distinct()

    serializer = MealTagsSerializer(meal_tags, many=True)
    serialized_data = serializer.data
    data = {'meals': serialized_data}
    return JsonResponse(data=data)


def ingredients_by_tags(request, tags):
 # Check if the request method is GET
    if request.method != 'GET':
        return HttpResponseBadRequest("Only GET requests are allowed for this view.")

    # Ensure that tags is not None
    if tags is None:
        return HttpResponseBadRequest("Tags parameter is missing or empty.")

    # Convert the tags parameter into a list
    try:
        tag_list = tags.split(',')
    except AttributeError:
        # Handle the case where tags is not a string
        return HttpResponseBadRequest("Invalid format for tags parameter.")

    # Query ingredients that have all the specified tags using IngredientTags
    ingredient_tags = IngredientTags.objects.filter(
        tags__name__in=tag_list).distinct()

    serializer = IngredientTagsSerializer(ingredient_tags, many=True)
    serialized_data = serializer.data
    data = {'ingredients': serialized_data}
    return JsonResponse(data=data)


class TagListView(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()


class MealTagsListView(viewsets.ModelViewSet):
    serializer_class = MealTagsSerializer
    queryset = MealTags.objects.all()


class IngredientTagsListView(viewsets.ModelViewSet):
    serializer_class = IngredientTagsSerializer
    queryset = IngredientTags.objects.all()
