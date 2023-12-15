from rest_framework import serializers
from ..models import FoodPlanerItem


class FoodPlanerItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodPlanerItem
        fields = ['id', 'date', 'meals']

    def update(self, instance, validated_data):
        print("test")
        return super().update(instance, validated_data)
