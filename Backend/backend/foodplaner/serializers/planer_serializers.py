from rest_framework import serializers
from ..models import FoodPlanerItem


class FoodPlanerItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodPlanerItem
        fields = ['date', 'meals']
