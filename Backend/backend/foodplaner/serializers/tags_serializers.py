from rest_framework import serializers
from ..models import Tag, MealTags, IngredientTags


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']


class MealTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealTags
        fields = ['meal', 'tags']


class IngredientTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientTags
        fields = ['ingredient', 'tags']
