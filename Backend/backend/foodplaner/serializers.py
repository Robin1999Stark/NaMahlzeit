from rest_framework import serializers
from .models import Meal, FoodPlanerItem


class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'


class FoodPlanerItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodPlanerItem
        fields = '__all__'
