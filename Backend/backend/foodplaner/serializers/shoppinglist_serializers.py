from rest_framework import serializers
from ..models import ShoppingListItem, ShoppingList


class ShoppingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListItem
        fields = ['id', 'bought', 'added',
                  'ingredient', 'amount', 'unit', 'notes']

    def update(self, instance, validated_data):
        return self.update


class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['id', 'created', 'items']
