from ..models import MealTags, IngredientTags, Tag
from ..serializers.tags_serializers import TagSerializer, MealTagsSerializer, IngredientTagsSerializer
from rest_framework import viewsets


class TagListView(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()


class MealTagsListView(viewsets.ModelViewSet):
    serializer_class = MealTagsSerializer
    queryset = MealTags.objects.all()


class IngredientTagsListView(viewsets.ModelViewSet):
    serializer_class = IngredientTagsSerializer
    queryset = IngredientTags.objects.all()
