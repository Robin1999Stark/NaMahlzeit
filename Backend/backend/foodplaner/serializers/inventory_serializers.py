from rest_framework import serializers
from ..models import InventoryItem
from ..unit_synonyms import get_unit_syn_dict


class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'ingredient', 'amount', 'unit']

    def create(self, validated_data):

        unit_syn_dict = get_unit_syn_dict()

        ingr = validated_data['ingredient']

        unit = validated_data['unit']

        if unit in unit_syn_dict:
            unit = unit_syn_dict[unit]

        items = InventoryItem.objects.filter(
            ingredient=ingr, unit=unit)
       
        if not items.exists():
            if validated_data['amount'] > 0:
                inventory_item = InventoryItem.objects.create(
                    ingredient=validated_data['ingredient'], amount=validated_data['amount'], unit=validated_data['unit'])
                return inventory_item

        else:
            first = items.first()
            if unit == first.unit:
                new_amount = first.amount + validated_data['amount']
                if new_amount > 0:
                    first.amount = new_amount
                    first.save()
                else:
                    first.delete()
                return first
            else:
                new_amount = validated_data['amount']
                if new_amount > 0:
                    inventory_item = InventoryItem.objects.create(
                        ingredient=validated_data['ingredient'], amount=new_amount, unit=unit)
                    return inventory_item
                else:
                    pass

        return InventoryItem.objects.first()
