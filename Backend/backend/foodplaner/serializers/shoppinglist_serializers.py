from rest_framework import serializers
from ..models import ShoppingListItem, ShoppingList
from ..unit_synonyms import get_unit_syn_dict


class ShoppingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListItem
        fields = ['id', 'bought', 'added',
                  'ingredient', 'amount', 'unit', 'notes']

    def update(self, instance, validated_data):
        instance.bought = validated_data.get('bought', instance.bought)
        instance.added = validated_data.get('added', instance.added)
        instance.ingredient = validated_data.get(
            'ingredient', instance.ingredient)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.notes = validated_data.get('notes', instance.notes)
        
        unit_syn_dict = get_unit_syn_dict()
        unit = validated_data.get('unit', instance.unit)
        
        if unit in unit_syn_dict:
            instance.unit = unit_syn_dict[unit]
        else:
            instance.unit = unit  
        
        instance.save()
        return instance


class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['id', 'created', 'items']
